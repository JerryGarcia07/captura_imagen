import Header from "../components/layout/Header";
import OptionCard from "../components/layout/OptionCard";

export default function Home() {
  const options = [
    { title: "Crear Icon", path: "/icon" },
    { title: "Tarjeta Anime", path: "/anime" },
  ];

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50 flex flex-col transition-colors duration-300">
      <Header />

      <main className="flex-grow flex flex-col items-center p-8">
        <div className="w-full max-w-5xl flex flex-col items-center mt-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-[#FFD8C9] mb-16 transition-colors duration-300">
            Generar Imagen
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full">
            {options.map((option, index) => (
              <OptionCard key={index} title={option.title} path={option.path} />
            ))}
          </div>
        </div>
      </main>

      <footer className="text-gray-500 dark:text-gray-400 text-sm py-6 text-center">
        PandaAsia@ copyright 2024
      </footer>
    </div>
  );
}
