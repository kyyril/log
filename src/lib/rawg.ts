import type { ArchiveItem, Status } from '../types'

const RAWG_KEY = import.meta.env.RAWG_KEY || ''
const USERNAME = 'kyyril'

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

  try {
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
            const existing = gamesMap.get(game.id)
            // If the game is already resolved as completed, don't overwrite it with in-progress/owned status
            if (existing && existing.status === 'completed') {
              return
            }

            const year = game.released ? new Date(game.released).getFullYear() : 0

            gamesMap.set(game.id, {
              id: `games-${game.id}`,
              title: game.name,
              category: 'games',
              year,
              status: appStatus,
              note: 'No thoughts recorded.',
              imageUrl: game.background_image || '',
              hours: game.playtime || undefined
            })
          })
        }
      })
    )
  } catch (error) {
    console.error('Failed to fetch from RAWG:', error)
  }

  return Array.from(gamesMap.values())
}
