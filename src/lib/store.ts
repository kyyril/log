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
        if (hasOldGames) {
          cacheTime = 0
        }
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

  try {
    const [animeList, mangaList, gameList] = await Promise.all([
      cachedAnime.length && isCacheValid ? Promise.resolve(cachedAnime) : fetchAnimeList(),
      cachedManga.length && isCacheValid ? Promise.resolve(cachedManga) : fetchMangaList(),
      cachedGames.length && isCacheValid ? Promise.resolve(cachedGames) : fetchGameList(),
    ])

    itemsStore.set([...gameList, ...animeList, ...mangaList])

    if (typeof window !== 'undefined') {
      localStorage.setItem(CACHE_KEY_ANIME, JSON.stringify(animeList))
      localStorage.setItem(CACHE_KEY_MANGA, JSON.stringify(mangaList))
      localStorage.setItem(CACHE_KEY_GAMES, JSON.stringify(gameList))
      localStorage.setItem(CACHE_KEY_TIME, now.toString())
    }
  } catch (err: any) {
    console.error('Failed to load data:', err)
    if (!cachedAnime.length && !cachedManga.length) {
      errorStore.set(err.message || 'Failed to load data')
    }
  } finally {
    isLoadingStore.set(false)
  }
}
