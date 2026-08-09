// Proxies the public IGDB list page through r.jina.ai (renders JS + bypasses
// Cloudflare) and returns the original server-rendered HTML, which embeds the
// full list data (ListEntry React-on-Rails JSON payloads).
//
// The IGDB API itself has no user-list endpoint, and fetching igdb.com
// directly hits a Cloudflare challenge, hence the reader service.
export const config = { maxDuration: 60 }

const JINA_BASE = 'https://r.jina.ai'

type Req = {
  query: Record<string, string | string[] | undefined>
}

type Res = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => Res
  send: (body: string) => void
}

export default async function handler(req: Req, res: Res) {
  const user = encodeURIComponent(String(req.query.user || 'kyyril1'))
  const list = encodeURIComponent(String(req.query.list || 'played'))
  const page = req.query.page ? `?page=${encodeURIComponent(String(req.query.page))}` : ''
  const target = `https://www.igdb.com/users/${user}/lists/${list}${page}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 60_000)

  try {
    const upstream = await fetch(`${JINA_BASE}/${target}`, {
      headers: { 'X-Return-Format': 'html' },
      signal: controller.signal,
    })
    const html = await upstream.text()
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600')
    res.status(upstream.ok ? 200 : upstream.status).send(html)
  } catch {
    res.status(502).send('igdb-list proxy failed')
  } finally {
    clearTimeout(timer)
  }
}
