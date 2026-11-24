export interface TMDBSearchResult {
  poster_path?: string | null;
  media_type?: string;
  title?: string;
  name?: string;
  original_name?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
}

export async function searchTMDB(
  query: string,
  apiKey: string,
): Promise<TMDBSearchResult[]> {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=es-ES`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB respondió con estado ${response.status}`);
  }
  const data: { results?: TMDBSearchResult[] } = await response.json();
  return data.results ?? [];
}

export function getTMDBPosterUrl(posterPath: string): string {
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
}
