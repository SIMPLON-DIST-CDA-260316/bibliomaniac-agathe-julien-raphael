export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method not allowed' })

  const { q, limit = '10' } = req.query

  if (!q)
    return res.status(400).json({ error: 'Query parameter "q" is required' })

  const url = new URL('https://openlibrary.org/search.json')
  url.searchParams.append('q', q)
  url.searchParams.append('limit', limit)

  const response = await fetch(url.toString())

  if (!response.ok) {
    return res
      .status(502)
      .json({ error: `Open Library API returned ${response.status}` })
  }

  return res.json(await response.json())
}
