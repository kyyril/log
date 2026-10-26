import type { ArchiveItem } from '../types'

const USERNAME = 'kyyril1'
const LIST_SLUG = 'played'

// The IGDB site is behind Cloudflare and the IGDB API has no user-list
// endpoint, so the list page is fetched through api/igdb-list/[user]/[list].ts
// (a Vercel function proxying via r.jina.ai), which returns the original
// server-rendered HTML. The list entries are embedded as React-on-Rails JSON
// payloads inside script tags.
const LIST_ENTRY_RE = /data-component-name="ListEntry"[^>]*>(.*?)<\/script>/gs
const PAGINATION_RE = /data-component-name="Pagination"[^>]*>(.*?)<\/script>/s

function parseListHtml(html: string): ArchiveItem[] {
  const items: ArchiveItem[] = []
  for (const match of html.matchAll(LIST_ENTRY_RE)) {
    let data: any
    try {
      data = JSON.parse(match[1])
    } catch {
      continue
    }
    const game = data?.game
    if (!game) continue

    const platforms: string[] = []
    for (const p of data.listEntryData?.platforms ?? []) {
      const name = p.platform?.name
      if (name && !platforms.includes(name)) platforms.push(name)
    }

    items.push({
      id: `games-${game.id}`,
      title: game.title,
      category: 'games',
      year: game.year ?? 0,
      status: 'completed',
      note: 'No thoughts recorded.',
      imageUrl: game.coverSrc ? `https:${game.coverSrc}` : '',
      platforms,
      slug: (game.url ?? '').split('/').filter(Boolean).pop() ?? '',
      link: game.url,
    })
  }
  return items
}

function getTotalPages(html: string): number {
  const match = PAGINATION_RE.exec(html)
  if (!match) return 1
  try {
    return JSON.parse(match[1])?.totalPages ?? 1
  } catch {
    return 1
  }
}

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastError: Error | null = null
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url)
      if (res.ok) return res
      lastError = new Error(`IGDB list returned ${res.status}`)
      // 403/429 are usually transient rate limits — back off and retry
      if (res.status !== 403 && res.status !== 429) break
    } catch (e) {
      lastError = e as Error
    }
    await new Promise(resolve => setTimeout(resolve, 3000 * (i + 1)))
  }
  throw lastError ?? new Error('IGDB list fetch failed')
}

async function fetchPageHtml(page: number, username: string, list: string): Promise<string> {
  const query = page > 1 ? `?page=${page}` : ''
  const apiPath = `/api/igdb-list/${encodeURIComponent(username)}/${encodeURIComponent(list)}${query}`

  try {
    const res = await fetch(apiPath)
    if (res.ok) {
      const text = await res.text()
      if (!text.includes('<title>Just a moment...</title>')) {
        return text
      }
    }
  } catch {
    // server-side proxy failed or unreachable, fall through to direct reader fallback
  }

  // Fallback: Fetch via r.jina.ai directly from the user's browser.
  // r.jina.ai has CORS enabled (Access-Control-Allow-Origin: *) and succeeds
  // when client geolocations (e.g. Asia/ID) query without hitting datacenter IP blocks.
  const target = `https://www.igdb.com/users/${encodeURIComponent(username)}/lists/${encodeURIComponent(list)}${query}`
  const directRes = await fetch(`https://r.jina.ai/${target}`, {
    headers: { 'X-Return-Format': 'html' },
  })
  if (!directRes.ok) throw new Error(`IGDB fetch failed: ${directRes.status}`)
  const directHtml = await directRes.text()
  if (directHtml.includes('<title>Just a moment...</title>')) {
    throw new Error('Cloudflare challenge received from IGDB')
  }
  return directHtml
}

export async function fetchGameList(username: string = USERNAME, list: string = LIST_SLUG): Promise<ArchiveItem[]> {
  const firstHtml = await fetchPageHtml(1, username, list)
  const totalPages = Math.min(getTotalPages(firstHtml), 10)

  const pages = [firstHtml]
  for (let page = 2; page <= totalPages; page++) {
    const html = await fetchPageHtml(page, username, list)
    pages.push(html)
  }

  const items: ArchiveItem[] = []
  const seen = new Set<string>()
  for (const html of pages) {
    for (const item of parseListHtml(html)) {
      if (!seen.has(item.id)) {
        seen.add(item.id)
        items.push(item)
      }
    }
  }

  if (!items.length) throw new Error('No games parsed from IGDB list')
  return items
}
