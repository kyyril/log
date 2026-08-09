import type { ArchiveItem } from './types'

// All data is now fetched from APIs:
//  - Anime & Manga: MyAnimeList API (via src/lib/mal.ts)
//  - Games: IGDB "Played" list via r.jina.ai proxy (via src/lib/igdb.ts)
//  - Novels: static src/data/novels.json
export const archiveItems: ArchiveItem[] = []
