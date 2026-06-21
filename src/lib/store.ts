import { writable } from 'svelte/store'
import type { ArchiveItem } from '../types'
import { archiveItems as initialItems } from '../data'
import { fetchAnimeList, fetchMangaList } from './mal'

// Start with the initial hardcoded items (mostly Games)
export const itemsStore = writable<ArchiveItem[]>(initialItems)
export const isLoadingStore = writable<boolean>(false)
export const errorStore = writable<string | null>(null)

export async function loadData() {
  isLoadingStore.set(true)
  errorStore.set(null)
  
  try {
    const [animeList, mangaList] = await Promise.all([
      fetchAnimeList(),
      fetchMangaList()
    ])
    
    itemsStore.update(existingItems => {
      // Keep only Games from the initial hardcoded items
      const games = existingItems.filter(item => item.category === 'games')
      // Combine Games with the real Anime and Manga fetched from MyAnimeList
      return [...games, ...animeList, ...mangaList]
    })
  } catch (err: any) {
    console.error('Failed to load MyAnimeList data:', err)
    errorStore.set(err.message || 'Failed to load MyAnimeList data')
  } finally {
    isLoadingStore.set(false)
  }
}
