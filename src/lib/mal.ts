import type { ArchiveItem, Category, Status } from '../types'

const MAL_CLIENT_ID = import.meta.env.MAL_CLIENT_ID || ''
const USERNAME = 'kyyrill'

// Map MAL status to our Status type
const mapStatus = (malStatus: string): Status => {
  switch (malStatus) {
    case 'completed':
      return 'completed'
    case 'watching':
    case 'reading':
    case 'on_hold':
      return 'in-progress'
    case 'dropped':
      return 'dropped'
    case 'plan_to_watch':
    case 'plan_to_read':
    default:
      return 'planned'
  }
}

// Fetch anime from MAL API or Jikan fallback
export async function fetchAnimeList(username: string = USERNAME): Promise<ArchiveItem[]> {
  const fields = 'list_status{comments,score,num_episodes_watched},start_season,start_date'
  const limit = 100
  const malUrl = `https://api.myanimelist.net/v2/users/${username}/animelist?limit=${limit}&fields=${fields}`
  
  // Use Vite proxy in development, direct URL in production
  const url = import.meta.env.DEV
    ? `/api/myanimelist/users/${username}/animelist?limit=${limit}&fields=${encodeURIComponent(fields)}`
    : malUrl

  try {
    const headers: Record<string, string> = {}
    if (MAL_CLIENT_ID) {
      headers['X-MAL-CLIENT-ID'] = MAL_CLIENT_ID
    }

    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(`MAL API returned ${response.status}`)
    }
    const json = await response.json()
    
    return json.data.map((item: any) => {
      const node = item.node
      const listStatus = item.list_status || {}
      
      const year = node.start_season?.year || 
        (node.start_date ? new Date(node.start_date).getFullYear() : 0)
      
      return {
        id: `anime-${node.id}`,
        title: node.title,
        category: 'anime' as Category,
        year,
        status: mapStatus(listStatus.status),
        rating: listStatus.score ? Math.round(listStatus.score / 2) : undefined, // scale 10 to 5 stars
        score: listStatus.score || undefined, // scale 1-10
        note: listStatus.comments || 'No thoughts recorded.',
        imageUrl: node.main_picture?.large || node.main_picture?.medium || '',
        hours: listStatus.num_episodes_watched ? Math.round(listStatus.num_episodes_watched * 0.4) : undefined // rough estimate: 24 mins per ep
      }
    })
  } catch (error) {
    console.warn('MAL API failed, falling back to Jikan API:', error)
    return fetchAnimeListJikan(username)
  }
}

// Fetch manga from MAL API or Jikan fallback
export async function fetchMangaList(username: string = USERNAME): Promise<ArchiveItem[]> {
  const fields = 'list_status{comments,score,num_chapters_read},start_date'
  const limit = 100
  const malUrl = `https://api.myanimelist.net/v2/users/${username}/mangalist?limit=${limit}&fields=${fields}`
  
  // Use Vite proxy in development, direct URL in production
  const url = import.meta.env.DEV
    ? `/api/myanimelist/users/${username}/mangalist?limit=${limit}&fields=${encodeURIComponent(fields)}`
    : malUrl

  try {
    const headers: Record<string, string> = {}
    if (MAL_CLIENT_ID) {
      headers['X-MAL-CLIENT-ID'] = MAL_CLIENT_ID
    }

    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(`MAL API returned ${response.status}`)
    }
    const json = await response.json()
    
    return json.data.map((item: any) => {
      const node = item.node
      const listStatus = item.list_status || {}
      
      const year = node.start_date ? new Date(node.start_date).getFullYear() : 0
      
      return {
        id: `manga-${node.id}`,
        title: node.title,
        category: 'manga' as Category,
        year,
        status: mapStatus(listStatus.status),
        rating: listStatus.score ? Math.round(listStatus.score / 2) : undefined,
        score: listStatus.score || undefined,
        note: listStatus.comments || 'No thoughts recorded.',
        imageUrl: node.main_picture?.large || node.main_picture?.medium || '',
        chapters: listStatus.num_chapters_read || undefined
      }
    })
  } catch (error) {
    console.warn('MAL API failed, falling back to Jikan API:', error)
    return fetchMangaListJikan(username)
  }
}

// Jikan fallback for Anime
async function fetchAnimeListJikan(username: string): Promise<ArchiveItem[]> {
  const url = `https://api.jikan.moe/v4/users/${username}/animelist`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Jikan API returned ${response.status}`)
  }
  const json = await response.json()
  return json.data.map((item: any) => {
    const anime = item.anime
    const year = anime.year || (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 0)
    
    return {
      id: `anime-${anime.mal_id}`,
      title: anime.title,
      category: 'anime',
      year,
      status: mapStatus(item.status),
      rating: item.score ? Math.round(item.score / 2) : undefined,
      score: item.score || undefined,
      note: item.comments || 'No thoughts recorded.',
      imageUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '',
      hours: item.progress ? Math.round(item.progress * 0.4) : undefined
    }
  })
}

// Jikan fallback for Manga
async function fetchMangaListJikan(username: string): Promise<ArchiveItem[]> {
  const url = `https://api.jikan.moe/v4/users/${username}/mangalist`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Jikan API returned ${response.status}`)
  }
  const json = await response.json()
  return json.data.map((item: any) => {
    const manga = item.manga
    const year = manga.published?.from ? new Date(manga.published.from).getFullYear() : 0
    
    return {
      id: `manga-${manga.mal_id}`,
      title: manga.title,
      category: 'manga',
      year,
      status: mapStatus(item.status),
      rating: item.score ? Math.round(item.score / 2) : undefined,
      score: item.score || undefined,
      note: item.comments || 'No thoughts recorded.',
      imageUrl: manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url || '',
      chapters: item.progress || undefined
    }
  })
}
