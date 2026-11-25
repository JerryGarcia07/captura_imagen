# CaptureImg — Documentación técnica

> Aplicación web para **generar y exportar imágenes personalizadas** (iconos, tarjetas de anime y carpetas de K-pop) directamente en el navegador. No hay backend: todo el renderizado, la búsqueda de metadatos y la exportación ocurren en el cliente.

---

## 1. ¿Qué hace el proyecto?

CaptureImg permite crear tres tipos de composición visual:

| Módulo | Ruta | Resultado | Fuente de datos |
| --- | --- | --- | --- |
| Crear Icon | `/icon` | Un icono con caja, etiqueta lateral e imagen, exportable a `.ico`, `.png`, `.jpg`, `.webp` | TMDB o imagen local |
| Tarjeta Anime | `/anime` | Una ficha vertical de anime con póster, título, episodios, año, estudio, géneros y sinopsis | AniList + TMDB o imagen local |
| Carpeta K-pop | `/kpop-folder` | Una carpeta estilizada con pestaña y contraportada personalizables | iTunes Search API o imagen local |

Flujo funcional común de todos los módulos:

```
Búsqueda en API / subida de archivo
            ↓
  Estado React (nombre, imagen, opciones)
            ↓
  Vista previa en vivo (previewRef)
            ↓
 html-to-image convierte el DOM a PNG/JPG/WEBP/ICO
            ↓
        Descarga o compartir
```

---

## 2. Stack tecnológico

| Tecnología | Versión | Uso |
| --- | --- | --- |
| React | 19.x | UI basada en componentes y hooks |
| TypeScript | ~7.0 | Tipado estático (modo estricto en lint) |
| Vite | 8.x | Dev server, build y HMR |
| Tailwind CSS | 4.x | Estilos utilitarios (vía `@tailwindcss/vite`) |
| React Router DOM | 7.x | Enrutado cliente (`BrowserRouter`) |
| html-to-image | 1.11.x | Captura de un nodo DOM como imagen |
| lucide-react | 1.x | Iconografía |
| ESLint | 10.x | Reglas JS/TS, React Hooks y React Refresh |

Gestor de paquetes: el repo incluye `pnpm-lock.yaml`, por lo que **pnpm** es el gestor previsto.

---

## 3. Puesta en marcha

### 3.1 Requisitos

- Node.js 20+ (recomendado 22).
- pnpm instalado (`npm i -g pnpm`).

### 3.2 Instalación

```bash
pnpm install
```

### 3.3 Variables de entorno

El proyecto usa una única variable, leída en tiempo de build por Vite:

```env
VITE_TMDB_API_KEY=<tu_api_key_de_tmdb>
```

Se consume como `import.meta.env.VITE_TMDB_API_KEY` en las páginas de Icon y Anime.

> ⚠️ **Importante sobre seguridad**: cualquier variable `VITE_*` queda incrustada en el bundle público. Además, el archivo `.env` **no está incluido en `.gitignore`**, por lo que la clave actual está versionada. En producción conviene:
> 1. Añadir `.env` a `.gitignore` y rotar la clave.
> 2. Mover las llamadas a TMDB detrás de un proxy/backend si la clave debe mantenerse privada.

### 3.4 Scripts disponibles

```bash
pnpm dev       # Servidor de desarrollo con HMR
pnpm build     # tsc -b && vite build  → genera /dist
pnpm preview   # Sirve el build de producción localmente
pnpm lint      # ESLint sobre todo el proyecto
```

El build es un SPA puro: produce `dist/index.html` + `dist/assets/*`. Cualquier hosting estático sirve, **pero necesita una regla de rewrite hacia `index.html`** para que rutas como `/anime` funcionen al recargar (porque se usa `BrowserRouter`, no `HashRouter`).

---

## 4. Estructura del proyecto

```
capture-img/
├── index.html                 # HTML raíz, monta #root y /src/main.tsx
├── vite.config.ts             # Plugins: react + tailwindcss
├── tsconfig.app.json          # TS del cliente (target es2023, noUnusedLocals…)
├── eslint.config.js           # Reglas ESLint
├── .env                       # VITE_TMDB_API_KEY
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── dist/                      # Build de producción (ignorado por git)
└── src/
    ├── main.tsx               # createRoot + <StrictMode>
    ├── App.tsx                # Definición de rutas
    ├── index.css              # Tailwind + estilos custom (clip-path, 3D, scrollbar)
    ├── pages/                 # Contenedores: estado + lógica + composición
    │   ├── Home.tsx
    │   ├── IconCreator.tsx
    │   ├── AnimeCard.tsx
    │   ├── KpopFolder.tsx
    │   └── NotFound.tsx
    ├── components/
    │   ├── layout/            # Header, Footer, OptionCard
    │   ├── forms/             # Formularios (solo presentación)
    │   └── preview/           # Vistas previas capturables (forwardRef)
    ├── services/              # Clientes de APIs externas
    │   ├── tmdb.ts
    │   └── anilist.ts
    └── utils/
        ├── export.ts          # Conversión y descarga (PNG/JPG/WEBP/ICO)
        └── share.ts           # Web Share API
```

### 4.1 Patrón arquitectónico

Cada módulo repite deliberadamente esta separación en tres capas:

1. **Página (`pages/*.tsx`)** — *container*. Mantiene **todo** el estado con `useState`, las llamadas a APIs, la validación, la gestión de errores y el `previewRef`. No renderiza estilos de formulario ni de tarjeta.
2. **Formulario (`components/forms/*.tsx`)** — *presentacional puro*. Recibe estado y callbacks por props. No tiene lógica propia ni acceso a APIs.
3. **Vista previa (`components/preview/*.tsx`)** — *presentacional puro* envuelto en `forwardRef<HTMLDivElement>`, de modo que la página pueda pasar `ref={previewRef}` y capturar exactamente ese nodo.

Ventajas: la lógica queda centralizada y testeable; los componentes visuales son reutilizables y fáciles de modificar sin tocar la lógica.

> Este patrón es consistente en los tres módulos, aunque **no hay estado compartido entre páginas** (todo se reinicia al navegar). No se usa Context, Redux ni persistencia más allá de `localStorage` para el tema.

---

## 5. Enrutado

`src/App.tsx` define el mapa de rutas:

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/icon" element={<IconCreator />} />
    <Route path="/anime" element={<AnimeCard />} />
    <Route path="/kpop-folder" element={<KpopFolder />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

- `/` muestra tres `OptionCard` generadas a partir de un array (`title` + `path`) y navega con `<Link>`.
- Cualquier ruta desconocida cae en `NotFound`, que ofrece un enlace de vuelta al inicio.
- No hay rutas anidadas, layouts compartidos ni lazy loading: todas las páginas se incluyen en el bundle inicial.

---

## 6. Layout y tema

### 6.1 Header

`components/layout/Header.tsx` contiene:
- Logo/enlace a `/` con icono `Camera` de lucide.
- **Selector de tema claro/oscuro**. La preferencia:
  - Se inicializa desde `localStorage.getItem("theme")`; si no existe, **el modo oscuro es el predeterminado**.
  - Se aplica añadiendo/quitando la clase `dark` en `<html>` (`document.documentElement`).
  - Se persiste en `localStorage` en cada cambio.

### 6.2 Tailwind 4 y modo oscuro

`src/index.css`:

```css
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:...");
@import "tailwindcss";
@variant dark (&:where(.dark, .dark *));
```

- La fuente global es **Plus Jakarta Sans** (cargada desde Google Fonts).
- El `@variant dark` hace que las utilidades `dark:*` respondan a la clase `.dark` en un ancestro (no a `prefers-color-scheme`).
- Se añaden utilidades custom: `clip-path` del icono (`img-fondo01`), perspectiva/rotación 3D (`ChangePertive`, `img-etiqueta01`), textos con borde y una scrollbar naranja.

### 6.3 Footer

Simple línea de copyright (`PandaAsia@ copyright 2024`). Se repite manualmente en cada página.

---

## 7. Módulo 1 — Crear Icon (`/icon`)

**Archivos**: `pages/IconCreator.tsx`, `forms/IconForm.tsx`, `preview/IconPreview.tsx`.

### 7.1 Estado

```ts
searchQuery  // texto del buscador TMDB
name         // título mostrado en la etiqueta lateral
image        // URL remota (TMDB) o blob: local
color        // color de fondo de la etiqueta (por defecto #d1d5db)
format       // "ico" | "png" | "jpg" | "webp" (por defecto "ico")
showModal    // modal de "sin resultados"
isProcessing // bloquea botones mientras se exporta
error        // mensaje de validación/API
```

`previewRef` apunta al `<div>` interno de `IconPreview` que se captura.

### 7.2 Búsqueda en TMDB

1. Si `searchQuery` está vacío, no hace nada.
2. Si falta la API key → error visible.
3. `searchTMDB(query, key)` hace `GET /3/search/multi?language=es-ES`.
4. Se toma el **primer resultado que tenga `poster_path`** y se rellenan `name` (title/name/original_name) e `image` (`https://image.tmdb.org/t/p/w500{poster_path}`).
5. Si no hay resultados válidos o hay excepción → se abre el modal "No hay resultados".

### 7.3 Imagen local

El input `type="file"` acepta `image/*`, valida `file.type.startsWith("image/")` y crea un `URL.createObjectURL(file)`. Un `useEffect` revoca el object URL anterior al cambiar de imagen o desmontar, evitando fugas de memoria.

### 7.4 Composición visual

`IconPreview` construye una caja de **324 × 512 px** con:
- Un fondo oscuro recortado con `clip-path` (`img-fondo01`).
- Tres capas superpuestas de "etiqueta" con `rotateY(-5deg)` para simular un lomo 3D: base con degradado metálico, tinte de color al 50 % y el texto rotado 90° (`writing` vertical).
- La portada (`object-cover`) con `perspective`/`rotateY(5deg)` (`ChangePertiveImg`) para dar profundidad.
- `crossOrigin="anonymous"` en las imágenes para que `html-to-image` no contamine el canvas.
- Placeholder con el icono `Image` si no hay imagen.

### 7.5 Validación

`validateFields()` exige: nombre no vacío, imagen y formato. Devuelve `false` y setea `error` si falla; el formulario lo muestra con animación `animate-pulse`.

---

## 8. Módulo 2 — Tarjeta Anime (`/anime`)

**Archivos**: `pages/AnimeCard.tsx`, `forms/AnimeCardForm.tsx`, `preview/AnimeCardPreview.tsx`.

Este es el flujo más complejo, porque **combina dos APIs**.

### 8.1 Estado

Campos editables: `name`, `episodes`, `year`, `type` (TV/Movie/OVA/ONA/Special), `studio`, `genres`, `score`, `synopsis`, `image`. Opciones: `showScore` (checkbox para mostrar la puntuación sobre el póster), `format` (`png` por defecto, `jpg`, `webp` — sin ICO). Además: `isSearching`, `isProcessing`, `error`, `showModal`.

### 8.2 Flujo de búsqueda (fallback en cascada)

```
handleSearchAnime()
│
├─ 1. AniList (GraphQL POST https://graphql.anilist.co)
│     └─ Media(search, type: ANIME) → título, episodios, año, formato,
│        estudios principales, géneros, tags, averageScore, portada
│
├─ 2. TMDB (multi-search en es-ES)
│     └─ busca póster y sinopsis en español
│     └─ Si TMDB no encuentra nada y AniList sí, reintenta con title.english
│
├─ 3. Consolidación en la UI
│     ├─ Si AniList respondió: usa sus datos exactos
│     │   ├─ score = averageScore / 10
│     │   ├─ formato mapeado (TV_SHORT→TV, MOVIE→Movie, …)
│     │   ├─ episodios vacíos → "En emisión"
│     │   ├─ estudio → primer nodo o "Desconocido"
│     │   ├─ géneros traducidos al español
│     │   └─ sinopsis/póster desde TMDB; si no hay, portada de AniList
│     │       y "Sinopsis no disponible en español."
│     ├─ Si solo TMDB respondió: rellena datos básicos
│     │   (tipo, 1 episodio si es película, año de estreno, "--" en
│     │    estudio/géneros) y avisa con un warning no bloqueante
│     └─ Si nada respondió: modal "No hay resultados"
│
└─ finally: isSearching = false
```

Detalles relevantes:

- **Géneros**: se combinan `genres` de AniList con los `tags` que coincidan con demografías (`Shounen`, `Seinen`, `Shoujo`, `Josei`, `Isekai`, `Mecha`) y se traducen con el diccionario `genreTranslations` (inglés → español). Los géneros sin traducción se dejan tal cual.
- **Errores de AniList no bloquean**: si la GraphQL falla, se hace `console.warn` y se sigue con TMDB.
- **Errores de TMDB sí abortan** hacia el modal, porque están dentro del `try` principal.
- La API key de TMDB se comprueba **antes** de llamar a AniList (aunque AniList no la necesite).

### 8.3 Vista previa

`AnimeCardPreview` es una tarjeta fija de **512 px de ancho** con:
- Póster que ocupa el ancho completo (`max-height: 500px`, `object-cover`).
- Degradado inferior que funde el póster con el fondo verde (`#29422F` → `#2c3d33`).
- Puntuación gigante (`text-8xl`) en la esquina inferior derecha, solo si `showScore` y `score` tienen valor.
- Bloque de metadatos: `Caps | año | tipo | estudio`, con traducción de `Movie`→"Película" y `Special`→"Especial".
- Géneros, separador y sinopsis (`whitespace-pre-wrap`).
- Valores por defecto visibles cuando un campo está vacío.

> Nota: el placeholder de la sinopsis dice literalmente `"Sipnopsis... Aquí aparecerá la descripción."` (typo incluido en el código actual).

### 8.4 Validación

Solo exige **nombre e imagen** (`validateFields`). Formato y demás campos son libres; el botón de descarga se deshabilita mientras `isProcessing || isSearching`.

---

## 9. Módulo 3 — Carpeta K-pop (`/kpop-folder`)

**Archivos**: `pages/KpopFolder.tsx`, `forms/KpopFolderForm.tsx`, `preview/KpopFolderPreview.tsx`.

### 9.1 Estado

`searchQuery`, `name`, `image`, `tabColor` (`#FF5722`), `textColor` (`#FF5FA2`), `format` (`ico` por defecto, `png`, `jpg`, `webp`), `isSearching`, `isProcessing`, `error`, `showModal`.

### 9.2 Búsqueda en iTunes

La llamada se hace **inline en la página** (no hay servicio dedicado):

```ts
GET https://itunes.apple.com/search?term=<query>&entity=album&limit=5
```

- Toma el primer resultado con `artworkUrl100`.
- Usa `collectionName` (o `artistName` como respaldo) como nombre.
- **Escala la portada** reemplazando `100x100bb` por `600x600bb`.
- Sin resultados o error → modal "No hay resultados".
- La API de iTunes es pública: no requiere clave.

### 9.3 Vista previa

Carpeta de **420 × 360 px**:
- **Pestaña** superior izquierda (190 × 64) con `border-radius` superior, color `tabColor`, degradado interno (`white/10 → black/40`) y nombre en cursiva/negrita con color `textColor`, truncado a una línea.
- **Cuerpo** frontal desplazado 52 px hacia abajo, redondeado, con la imagen `object-cover` y dos capas decorativas: brillo superior (`white/50 → transparent`) y un `ring` interior blanco para simular relieve.

### 9.4 Validación

Igual que Icon: nombre, imagen y formato obligatorios.

---

## 10. Servicios externos

### 10.1 `services/tmdb.ts`

```ts
searchTMDB(query, apiKey): Promise<TMDBSearchResult[]>
// GET https://api.themoviedb.org/3/search/multi
//   ?api_key=...&query=...&language=es-ES

getTMDBPosterUrl(posterPath): string
// https://image.tmdb.org/t/p/w500{poster_path}
```

La interfaz `TMDBSearchResult` solo declara los campos usados: `poster_path`, `media_type`, `title`, `name`, `original_name`, `release_date`, `first_air_date`, `vote_average`, `overview`.

### 10.2 `services/anilist.ts`

`searchAniListAnime(search)` envía un `POST` GraphQL a `https://graphql.anilist.co` con:

```graphql
query ($search: String) {
  Media(search: $search, type: ANIME) {
    title { romaji english }
    episodes
    seasonYear
    startDate { year }
    format
    studios(isMain: true) { nodes { name } }
    genres
    tags { name }
    averageScore
    description
    coverImage { extraLarge }
  }
}
```

Devuelve `AniListMedia | null` (el primer `Media` que encuentre AniList, es decir, su mejor coincidencia).

### 10.3 iTunes Search API

Consumida directamente en `KpopFolder.tsx` (ver §9.2). No hay tipado compartido; se define la interfaz `ITunesAlbumResult` localmente.

---

## 11. Exportación de imágenes

Todo vive en `src/utils/export.ts` y `src/utils/share.ts`.

### 11.1 Captura del DOM con `html-to-image`

Se pasa el nodo referenciado por `previewRef`. Consideraciones:

- Se usa `pixelRatio: 2` para exportar al doble de resolución (mejor calidad).
- Las imágenes remotas llevan `crossOrigin="anonymous"` para evitar que el canvas quede contaminado (`SecurityError` al llamar `toDataURL`).
- La captura incluye **solo** el nodo de la vista previa: los paneles, sombras externas y fondos de la tarjeta contenedora no se exportan.

### 11.2 Formatos

| Formato | Implementación | Notas |
| --- | --- | --- |
| `png` | `toPng` (calidad 1, ratio 2) | Fondo transparente |
| `jpg` | `toJpeg` (calidad 0.9) | Fuerza fondo blanco `#ffffff` |
| `webp` | `toCanvas` (ratio 2) → `toDataURL("image/webp", 0.92)` | El navegador debe soportar WebP |
| `ico` | `toPng` → canvas 128×128 → blob PNG → cabecera ICO binaria | Ver abajo |

### 11.3 Generación real de `.ico`

No se usa librería: se construye el contenedor ICO a mano.

1. La captura se dibuja en un canvas de **128 × 128** (`drawImage` estira/encoge la imagen).
2. Se obtiene un `Blob` PNG con `canvas.toBlob`.
3. Se crea un `ArrayBuffer` de `22 + tamañoPNG` bytes y se rellena con `DataView`:

| Offset | Bytes | Campo | Valor |
| --- | --- | --- | --- |
| 0 | 2 | Reservado | `0` |
| 2 | 2 | Tipo | `1` (ICO) |
| 4 | 2 | Nº de imágenes | `1` |
| 6 | 1 | Ancho | `128` |
| 7 | 1 | Alto | `128` |
| 8 | 1 | Colores de paleta | `0` |
| 9 | 1 | Reservado | `0` |
| 10 | 2 | Planos de color | `1` |
| 12 | 2 | Bits por píxel | `32` |
| 14 | 4 | Tamaño de los datos | `png.length` |
| 18 | 4 | Offset de los datos | `22` |
| 22… | n | PNG embebido | bytes del PNG |

> Todos los enteros se escriben **little-endian** (`true` como tercer parámetro de `setUint16/setUint32`). ICO admite PNG embebido desde Windows Vista; esta implementación genera un único tamaño de 128 px.
>
> Limitación: el campo de ancho/alto es de 1 byte y `0` significaría 256 px. Aquí siempre se escribe `128`, correcto para este caso.

4. El blob resultante (`image/x-icon`) se descarga y el object URL se revoca a los 1000 ms.

### 11.4 Descarga

`triggerDownload(url, filename)` crea un `<a download>`, asigna `href` y hace `click()` programático. El nombre se sanea con `trim()` y cae a `"CaptureImg"` si está vacío.

### 11.5 Compartir nativo

`shareImageNative`:
1. Captura a PNG (ratio 2) y convierte el data URL en `Blob` vía `fetch`.
2. Construye un `File` con el nombre dado.
3. Si `navigator.canShare({ files: [file] })` es verdadero, llama a `navigator.share({ title, text, files })`.
4. Si no hay soporte, muestra un `alert`.
5. Cualquier error (incluida la cancelación del usuario) se registra solo en consola.

> Esta función **siempre exporta PNG**, sin importar el formato elegido en el formulario. El texto es fijo: `"¡Mira este icono que he generado en CaptureImg!"`, incluso en los módulos de anime y K-pop.

### 11.6 Manejo de errores de exportación

`downloadImage` envuelve todo en `try/catch`: registra el error y muestra `alert("Ocurrió un error al generar la imagen.")`. La página desactiva los botones mientras dura la operación mediante `isProcessing` (con `finally`, así que siempre se libera).

---

## 12. Gestión de estado y ciclo de vida

- **Sin librería de estado**: cada página gestiona su propio `useState`. No hay Context global ni store.
- **`useEffect` de limpieza en las tres páginas**:

  ```ts
  useEffect(() => {
    return () => {
      if (image?.startsWith("blob:")) URL.revokeObjectURL(image);
    };
  }, [image]);
  ```

  El cleanup se ejecuta al cambiar `image` y al desmontar, revocando únicamente object URLs locales (no las de TMDB/AniList/iTunes).
- **`StrictMode`** activo en `main.tsx`: en desarrollo los efectos se montan/desmontan dos veces; el cleanup anterior evita fugas.
- **`forwardRef`** es el mecanismo que conecta página y vista previa para la captura.
- **`isSearching`** deshabilita inputs/botones de búsqueda y muestra un `Loader2` animado; **`isProcessing`** hace lo propio durante la exportación y cambia el texto a "Procesando…".
- Los modales de error son bloques condicionales (`showModal && (...)`), no componentes reutilizables: el mismo markup se repite en las tres páginas.

---

## 13. Calidad de código y build

- `tsconfig.app.json`: `target es2023`, `moduleResolution: bundler`, `jsx: react-jsx`, `verbatimModuleSyntax`, `noEmit`, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`. No se define `strict` explícitamente en este archivo (se hereda de `tsconfig.json`).
- `eslint.config.js`: `js.configs.recommended`, `tseslint.configs.recommended`, `react-hooks` (flat recommended) y `react-refresh` (vite). `dist` está ignorado.
- `pnpm build` ejecuta primero `tsc -b` (type-check de los proyectos referenciados) y después `vite build`. Un error de tipos **rompe el build**.
- Salida: `dist/index.html`, `dist/assets/index-*.js`, `dist/assets/index-*.css` y los estáticos de `public/`.

---

## 14. Limitaciones y posibles mejoras

### Limitaciones actuales

1. **API key expuesta** en el bundle y `.env` versionado (ver §3.3).
2. **SPA con `BrowserRouter`**: requiere rewrite del servidor; si se sirve como archivos estáticos planos, recargar `/anime` da 404.
3. Solo se usa **el primer resultado** de cada API; no hay selector de resultados.
4. El buscador de Icon usa `search/multi`, por lo que puede devolver películas, series o personas (si tuvieran póster).
5. El ICO generado es de **un único tamaño (128×128)**; los `.ico` multirresolución requieren varias entradas en el directorio.
6. `shareImageNative` ignora el formato elegido y usa un texto fijo para los tres módulos.
7. Duplicación notable: modales de error, input de archivo, select de formatos y estilos de botones se repiten en cada formulario.
8. La lógica de APIs vive en las páginas (patrón container), lo que dificulta tests unitarios sin renderizar React.
9. `Home` declara una rejilla de hasta 5 columnas (`lg:grid-cols-5`) para solo 3 opciones.
10. `index.html` tiene `lang="en"` pese a que la interfaz está en español; el `<title>` es genérico.
11. Typos visibles: `"Creacion"` (sin tilde), `"Sipnopsis"`.

### Mejoras sugeridas

- Añadir `.env` a `.gitignore` y mover TMDB a un proxy serverless.
- Extraer componentes `Modal`, `FileInput`, `FormatSelect`, `ActionButtons` y un `Layout` con Header/Footer compartido.
- Introducir un hook `useImageExport` que unifique validación + descarga + compartir.
- Mover la llamada a iTunes a `services/itunes.ts` para mantener consistencia.
- Añadir selector de resultados y caché de búsquedas.
- Añadir `HashRouter` (o rewrite documentado) según el hosting objetivo.
- Tests con Vitest + Testing Library para la consolidación de datos de AniList/TMDB.
- Accesibilidad: `aria-label` en botones de solo icono, `role="dialog"`/`aria-modal` en modales, foco atrapado y cierre con Escape.

---

## 15. Resumen del flujo completo (ejemplo: Tarjeta Anime)

1. El usuario entra a `/anime` → `App` monta `AnimeCard`.
2. Escribe "Kusuriya no Hitorigoto" y pulsa Enter.
3. `AnimeCardForm` llama a `handleSearchAnime` (prop).
4. `AnimeCard` consulta AniList (GraphQL) y TMDB (`search/multi`, `es-ES`), con reintento por título en inglés si hace falta.
5. Consolida el resultado en ~10 estados (`setName`, `setEpisodes`, … y `setImage`).
6. React re-renderiza `AnimeCardPreview` con los nuevos props → la tarjeta se actualiza en vivo.
7. El usuario ajusta campos, activa "Mostrar Puntuación" y elige PNG.
8. Pulsa "Descargar" → `validateFields` → `isProcessing = true`.
9. `downloadImage(previewRef.current, "png", name)` → `html-to-image` captura el nodo a ×2 → `triggerDownload`.
10. `isProcessing = false`. Listo: la imagen está en la carpeta de descargas del navegador.
