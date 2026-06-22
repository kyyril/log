import type { ArchiveItem, Status } from '../types'

const RAWG_KEY = import.meta.env.RAWG_KEY || ''
const USERNAME = 'kyyril'

// Permanent cover cache — never expires, covers don't change
const COVER_CACHE_KEY = 'rawg_cover_cache'

function loadCoverCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(COVER_CACHE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveCoverCache(cache: Record<string, string>) {
  try {
    localStorage.setItem(COVER_CACHE_KEY, JSON.stringify(cache))
  } catch {
    // localStorage full — skip silently
  }
}

async function fetchBackloggdCover(title: string, cache: Record<string, string>): Promise<string | null> {
  // Return from permanent cache if available
  if (cache[title]) return cache[title]

  // Clean special characters that cause Backloggd's search parser to throw a 500 Internal Server Error
  const cleanTitle = title
    .replace(/['"’“”‘:—\-–]/g, ' ') // Replace quotes, colons, dashes with spaces
    .replace(/\s+/g, ' ')           // Collapse multiple spaces
    .trim()

  const url = `/api/backloggd?page=1&query=${encodeURIComponent(cleanTitle)}&type=games`
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 800) // Strict 800ms timeout

  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    if (!res.ok) return null
    const html = await res.text()

    // Scrape first vertical IGDB cover image
    const match = html.match(/<img\s+class="card-img height"\s+src="([^"]+)"/i)
    const coverUrl = match?.[1] ?? null

    if (coverUrl) {
      cache[title] = coverUrl  // persist for next visit
    }
    return coverUrl
  } catch (e) {
    clearTimeout(timeoutId)
    // Fail fast and silently to prevent blocking the UI
    return null
  }
}

export async function fetchGameList(username: string = USERNAME): Promise<ArchiveItem[]> {
  if (!RAWG_KEY) {
    console.warn('RAWG_KEY is not defined in environment variables.')
    return []
  }

  const statuses: { rawgStatus: string; appStatus: Status }[] = [
    { rawgStatus: 'beaten', appStatus: 'completed' },
    { rawgStatus: 'completed', appStatus: 'completed' },
    { rawgStatus: 'playing', appStatus: 'in-progress' },
    { rawgStatus: 'owned', appStatus: 'in-progress' },
    { rawgStatus: 'dropped', appStatus: 'dropped' },
    { rawgStatus: 'toplay', appStatus: 'planned' }
  ]

  const gamesMap = new Map<number, ArchiveItem>()
  const rawgGames: { game: any; appStatus: Status }[] = []

  // Load permanent cover cache before fetching
  const coverCache = loadCoverCache()

  try {
    // 1. Fetch user game list per status from RAWG sequentially to avoid rate-limiting (max 5 req/sec) and 522 timeouts
    for (const { rawgStatus, appStatus } of statuses) {
      const url = `/api/rawg/users/${username}/games?key=${RAWG_KEY}&statuses=${rawgStatus}&page_size=100`

      const res = await fetch(url)
      if (!res.ok) throw new Error(`RAWG API returned ${res.status}`)
      const json = await res.json()

      if (json.results) {
        json.results.forEach((game: any) => {
          const existingIdx = rawgGames.findIndex(item => item.game.id === game.id)
          if (existingIdx !== -1) {
            if (appStatus === 'completed') rawgGames[existingIdx].appStatus = 'completed'
          } else {
            rawgGames.push({ game, appStatus })
          }
        })
      }

      // 50ms spacing between calls to be safe
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    // 2. Map games instantly using existing cached covers or rawg backgrounds
    rawgGames.forEach(({ game, appStatus }) => {
      const year = game.released ? new Date(game.released).getFullYear() : 0
      const platforms = game.platforms ? game.platforms.map((p: any) => p.platform.name) : []
      const genres = game.genres ? game.genres.map((g: any) => g.name) : []
      const cachedCover = coverCache[game.name] || game.background_image || ''

      gamesMap.set(game.id, {
        id: `games-${game.id}`,
        title: game.name,
        category: 'games',
        year,
        status: appStatus,
        note: 'No thoughts recorded.',
        imageUrl: cachedCover,
        hours: game.playtime || undefined,
        metacritic: game.metacritic || undefined,
        platforms,
        genres,
        slug: game.slug
      })
    })

  } catch (error) {
    console.error('Failed to fetch from RAWG:', error)
    throw error // Re-throw to prevent store.ts from overwriting cache with empty results
  }

  return Array.from(gamesMap.values())
}
