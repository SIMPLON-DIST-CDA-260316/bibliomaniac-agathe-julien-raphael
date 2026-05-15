export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method not allowed' })

  const { olid } = req.query

  if (!/^OL\w+W$/.test(olid)) {
    return res.status(400).json({ error: 'Invalid Open Library work id' })
  }

  const workRes = await fetch(`https://openlibrary.org/works/${olid}.json`)

  if (!workRes.ok) {
    return res
      .status(workRes.status === 404 ? 404 : 502)
      .json({ error: `Open Library work returned ${workRes.status}` })
  }

  const work = await workRes.json()

  let authorName = null
  let authorKey = null
  const firstAuthorRef = work.authors?.[0]?.author?.key

  if (firstAuthorRef) {
    authorKey = firstAuthorRef.replace('/authors/', '')
    try {
      const authorRes = await fetch(
        `https://openlibrary.org${firstAuthorRef}.json`,
      )
      if (authorRes.ok) {
        const author = await authorRes.json()
        authorName = author.name ?? null
      }
    } catch {
      // Author fetch failed, continue without
    }
  }

  const description =
    typeof work.description === 'string'
      ? work.description
      : (work.description?.value ?? null)

  return res.json({
    key: olid,
    title: work.title ?? null,
    description,
    subjects: work.subjects ?? [],
    covers: work.covers ?? [],
    first_publish_date: work.first_publish_date ?? null,
    author_name: authorName,
    author_key: authorKey,
  })
}
