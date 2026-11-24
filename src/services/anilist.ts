export interface AniListMedia {
  title?: { romaji?: string | null; english?: string | null };
  episodes?: number | null;
  seasonYear?: number | null;
  startDate?: { year?: number | null } | null;
  format?: string | null;
  studios?: { nodes?: Array<{ name: string }> } | null;
  genres?: string[] | null;
  tags?: Array<{ name: string }> | null;
  averageScore?: number | null;
  coverImage?: { extraLarge?: string | null } | null;
}

export async function searchAniListAnime(
  search: string,
): Promise<AniListMedia | null> {
  const query = `
    query ($search: String) {
      Media (search: $search, type: ANIME) {
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
  `;

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { search },
    }),
  });

  if (!response.ok) {
    throw new Error(`AniList respondió con estado ${response.status}`);
  }

  const json: { data?: { Media?: AniListMedia | null } } =
    await response.json();
  return json.data?.Media ?? null;
}
