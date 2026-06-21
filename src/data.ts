import type { ArchiveItem } from './types'

// All data is now fetched from APIs:
//  - Anime & Manga: MyAnimeList API (via src/lib/mal.ts)
//  - Games: RAWG API (via src/lib/rawg.ts)
// Edit your personal game list in src/lib/rawg.ts → myGameList
export const archiveItems: ArchiveItem[] = []
