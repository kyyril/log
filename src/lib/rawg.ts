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

  const url = `/api/backloggd?page=1&query=${encodeURIComponent(title)}&type=games`
  try {
    const res = await fetch(url)
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
    console.warn(`Failed to scrape cover from Backloggd for "${title}":`, e)
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
    // 1. Fetch user game list per status from RAWG
    await Promise.all(
      statuses.map(async ({ rawgStatus, appStatus }) => {
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
      })
    )

    // 2. Fetch Backloggd covers (uses cache — only fetches uncached titles)
    await Promise.all(
      rawgGames.map(async ({ game, appStatus }) => {
        const backloggdCover = await fetchBackloggdCover(game.name, coverCache)
        const year = game.released ? new Date(game.released).getFullYear() : 0
        const platforms = game.platforms ? game.platforms.map((p: any) => p.platform.name) : []
        const genres = game.genres ? game.genres.map((g: any) => g.name) : []

        gamesMap.set(game.id, {
          id: `games-${game.id}`,
          title: game.name,
          category: 'games',
          year,
          status: appStatus,
          note: 'No thoughts recorded.',
          imageUrl: backloggdCover || game.background_image || '',
          hours: game.playtime || undefined,
          metacritic: game.metacritic || undefined,
          platforms,
          genres,
          slug: game.slug
        })
      })
    )

    // 3. Persist the updated cover cache (with any new entries)
    saveCoverCache(coverCache)

  } catch (error) {
    console.error('Failed to fetch from RAWG or Backloggd:', error)
  }

  return Array.from(gamesMap.values())
}
