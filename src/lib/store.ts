import { writable } from 'svelte/store'
import type { ArchiveItem } from '../types'
import { fetchAnimeList, fetchMangaList } from './mal'
import { fetchGameList } from './rawg'

export const itemsStore = writable<ArchiveItem[]>([])
export const isLoadingStore = writable<boolean>(false)
export const errorStore = writable<string | null>(null)

const CACHE_KEY_ANIME  = 'mal_cache_anime'
const CACHE_KEY_MANGA  = 'mal_cache_manga'
const CACHE_KEY_GAMES  = 'rawg_cache_games'
const CACHE_KEY_TIME   = 'mal_cache_timestamp'
const CACHE_DURATION   = 60 * 60 * 1000 // 1 hour

export async function loadData() {
  let cachedAnime: ArchiveItem[] = []
  let cachedManga: ArchiveItem[] = []
  let cachedGames: ArchiveItem[] = []
  let cacheTime = 0

  if (typeof window !== 'undefined') {
    try {
      const animeRaw = localStorage.getItem(CACHE_KEY_ANIME)
      const mangaRaw = localStorage.getItem(CACHE_KEY_MANGA)
      const gamesRaw = localStorage.getItem(CACHE_KEY_GAMES)
      const timeRaw  = localStorage.getItem(CACHE_KEY_TIME)

      if (animeRaw && mangaRaw && timeRaw) {
        cachedAnime = JSON.parse(animeRaw)
        cachedManga = JSON.parse(mangaRaw)
        cacheTime   = parseInt(timeRaw, 10)

        // Force refresh if cached data predates the score field
        const hasScore = cachedAnime.some(i => 'score' in i) || cachedManga.some(i => 'score' in i)
        if (!hasScore) cacheTime = 0
      }

      if (gamesRaw) {
        cachedGames = JSON.parse(gamesRaw)
        const hasOldGames = cachedGames.some(i => i.id.includes('-0-') || ['10', '11', '12'].includes(i.id))
        if (hasOldGames) cacheTime = 0
      }

      // Instantly populate store with whatever we have in cache
      if (cachedAnime.length || cachedManga.length || cachedGames.length) {
        itemsStore.set([...cachedGames, ...cachedAnime, ...cachedManga])
      }
    } catch (e) {
      console.warn('Failed to read local cache', e)
    }
  }

  const now = Date.now()
  const isCacheValid = cacheTime && (now - cacheTime < CACHE_DURATION)

  if (isCacheValid && cachedAnime.length > 0 && cachedManga.length > 0 && cachedGames.length > 0) {
    return
  }

  isLoadingStore.set(true)
  errorStore.set(null)

  // Fetch each source independently using allSettled — one failure won't block or wipe the others
  const [animeResult, mangaResult, gamesResult] = await Promise.allSettled([
    cachedAnime.length && isCacheValid ? Promise.resolve(cachedAnime) : fetchAnimeList(),
    cachedManga.length && isCacheValid ? Promise.resolve(cachedManga) : fetchMangaList(),
    cachedGames.length && isCacheValid ? Promise.resolve(cachedGames) : fetchGameList(),
  ])

  // Fall back to existing cache if a source failed — never show empty
  const animeList = animeResult.status === 'fulfilled' ? animeResult.value : cachedAnime
  const mangaList = mangaResult.status === 'fulfilled' ? mangaResult.value : cachedManga
  const gameList  = gamesResult.status === 'fulfilled' ? gamesResult.value : cachedGames

  if (animeResult.status === 'rejected') console.warn('Anime fetch failed, keeping cache:', animeResult.reason)
  if (mangaResult.status === 'rejected') console.warn('Manga fetch failed, keeping cache:', mangaResult.reason)
  if (gamesResult.status === 'rejected') console.warn('Games fetch failed, keeping cache:', gamesResult.reason)

  itemsStore.set([...gameList, ...animeList, ...mangaList])

  if (typeof window !== 'undefined') {
    // Only persist to localStorage if that specific source succeeded
    if (animeResult.status === 'fulfilled') localStorage.setItem(CACHE_KEY_ANIME, JSON.stringify(animeList))
    if (mangaResult.status === 'fulfilled') localStorage.setItem(CACHE_KEY_MANGA, JSON.stringify(mangaList))
    if (gamesResult.status === 'fulfilled') localStorage.setItem(CACHE_KEY_GAMES, JSON.stringify(gameList))
    // Only update timestamp when ALL sources succeed
    if (animeResult.status === 'fulfilled' && mangaResult.status === 'fulfilled' && gamesResult.status === 'fulfilled') {
      localStorage.setItem(CACHE_KEY_TIME, now.toString())
    }
  }

  if (animeResult.status === 'rejected' && mangaResult.status === 'rejected' && gamesResult.status === 'rejected' && !cachedAnime.length && !cachedManga.length) {
    errorStore.set('Failed to load data')
  }

  isLoadingStore.set(false)
}
