import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type { ArchiveItem } from '../types'
import { fetchAnimeList, fetchMangaList } from './mal'
import { fetchGameList } from './igdb'
import novelsData from '../data/novels.json'

export const itemsStore = writable<ArchiveItem[]>([])
export const loadingAnimeStore = writable(false)
export const loadingMangaStore = writable(false)
export const loadingGamesStore = writable(false)
export const errorStore = writable<string | null>(null)

const CACHE_DURATION = 10 * 60 * 1000 // 10 min, so IGDB/MAL updates appear quickly
const FETCH_TIMEOUT = 20 * 1000 // 20s per source, then fall back to cache

const CACHE_KEYS = {
  anime: 'mal_cache_anime',
  manga: 'mal_cache_manga',
  games: 'igdb_cache_games',
} as const

type SourceKey = keyof typeof CACHE_KEYS

// Static novel list loaded from src/data/novels.json
const novelItems: ArchiveItem[] = novelsData as ArchiveItem[]

// Holds the latest data of every source independently — a slow/failed fetch
// of one source never blocks or wipes the others.
const sourceState: Record<SourceKey, ArchiveItem[]> = { anime: [], manga: [], games: [] }

function publish() {
  itemsStore.set([...sourceState.games, ...sourceState.anime, ...sourceState.manga, ...novelItems])
}

function readCache(key: string): ArchiveItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeCache(key: string, items: ArchiveItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch {
    // storage full/unavailable — skip silently
  }
}

function fetchWithTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
    promise.then(
      (value) => { clearTimeout(timer); resolve(value) },
      (error) => { clearTimeout(timer); reject(error) },
    )
  })
}

async function loadSource(
  key: SourceKey,
  fetcher: () => Promise<ArchiveItem[]>,
  loadingStore: Writable<boolean>,
  isCacheFresh: (cached: ArchiveItem[]) => boolean,
) {
  const cacheKey = CACHE_KEYS[key]
  const cached = readCache(cacheKey)

  // Show whatever we already have immediately — never a blank section
  if (cached.length) {
    sourceState[key] = cached
    publish()
  }

  // Per-source cache validity: a stale/old games cache must NOT force
  // anime/manga to refetch, and vice versa.
  const now = Date.now()
  const timeKey = `${cacheKey}_timestamp`
  const cacheTime = typeof window !== 'undefined' ? parseInt(localStorage.getItem(timeKey) || '0', 10) : 0
  const isCacheValid = cacheTime > 0 && now - cacheTime < CACHE_DURATION && isCacheFresh(cached)

  if (isCacheValid) return

  loadingStore.set(true)
  try {
    const items = await fetchWithTimeout(fetcher(), FETCH_TIMEOUT)
    sourceState[key] = items
    publish()
    writeCache(cacheKey, items)
    if (typeof window !== 'undefined') localStorage.setItem(timeKey, now.toString())
  } catch (e) {
    console.warn(`${key} fetch failed, keeping cache:`, e)
    if (!cached.length) errorStore.set(`Failed to load ${key} data`)
  } finally {
    loadingStore.set(false)
  }
}

const hasScore = (cached: ArchiveItem[]) => cached.some(i => 'score' in i)
const isFreshGames = (cached: ArchiveItem[]) => cached.every(i => i.imageUrl && i.slug)

// Each source loads independently and updates the store as soon as it's done.
// A hanging or failing games fetch only affects the games section.
export function loadData() {
  loadSource('anime', fetchAnimeList, loadingAnimeStore, hasScore)
  loadSource('manga', fetchMangaList, loadingMangaStore, hasScore)
  loadSource('games', fetchGameList, loadingGamesStore, isFreshGames)
}
