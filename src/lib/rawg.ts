import type { ArchiveItem, Status } from '../types'

const RAWG_KEY = import.meta.env.RAWG_KEY || ''
const USERNAME = 'kyyril'

async function fetchBackloggdCover(title: string): Promise<string | null> {
  const targetUrl = `https://www.backloggd.com/search/results.turbo_stream?page=1&query=${encodeURIComponent(title)}&type=games`
  const url = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const html = await res.text()
    
    // Scrape the first vertical cover image URL
    const match = html.match(/<img\s+class="card-img height"\s+src="([^"]+)"/i)
    return match ? match[0].match(/src="([^"]+)"/)?.[1] || match[1] : null
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

  try {
    // 1. Fetch user game list per status from RAWG API
    await Promise.all(
      statuses.map(async ({ rawgStatus, appStatus }) => {
        const url = import.meta.env.DEV
          ? `/api/rawg/users/${username}/games?key=${RAWG_KEY}&statuses=${rawgStatus}&page_size=100`
          : `https://api.rawg.io/api/users/${username}/games?key=${RAWG_KEY}&statuses=${rawgStatus}&page_size=100`

        const res = await fetch(url)
        if (!res.ok) throw new Error(`RAWG API returned ${res.status}`)
        const json = await res.json()

        if (json.results) {
          json.results.forEach((game: any) => {
            // Keep unique games, prioritize completed status if it exists
            const existingIdx = rawgGames.findIndex(item => item.game.id === game.id)
            if (existingIdx !== -1) {
              if (appStatus === 'completed') {
                rawgGames[existingIdx].appStatus = 'completed'
              }
            } else {
              rawgGames.push({ game, appStatus })
            }
          })
        }
      })
    )

    // 2. Fetch Backloggd vertical cover arts in parallel
    await Promise.all(
      rawgGames.map(async ({ game, appStatus }) => {
        const backloggdCover = await fetchBackloggdCover(game.name)
        const year = game.released ? new Date(game.released).getFullYear() : 0
        
        // Extract genres and platforms
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

  } catch (error) {
    console.error('Failed to fetch from RAWG or Backloggd:', error)
  }

  return Array.from(gamesMap.values())
}
