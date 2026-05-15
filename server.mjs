import express from 'express'
import fetch from 'node-fetch'

const app = express()
const PORT = 3001

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Route pour récupérer les livres
app.get('/books', async (req, res) => {
  try {
    const { q, limit = '10' } = req.query

    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' })
    }

    const url = new URL('https://openlibrary.org/search.json')
    url.searchParams.append('q', q)
    url.searchParams.append('limit', limit)

    console.log(`📚 Fetching: ${url}`)

    const response = await fetch(url.toString())

    if (!response.ok) {
      console.error(`❌ Open Library API returned ${response.status}`)
      res
        .status(502)
        .json({ error: `Open Library API returned ${response.status}` })
      return
    }

    const data = await response.json()
    console.log(`✅ Retrieved ${data.docs?.length || 0} books`)
    res.json(data)
  } catch (error) {
    console.error('❌ Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Route pour récupérer un livre par son Open Library work id (ex: OL12345W)
app.get('/books/:olid', async (req, res) => {
  try {
    const { olid } = req.params

    if (!/^OL\w+W$/.test(olid)) {
      return res.status(400).json({ error: 'Invalid Open Library work id' })
    }

    const workUrl = `https://openlibrary.org/works/${olid}.json`
    console.log(`📖 Fetching work: ${workUrl}`)

    const workRes = await fetch(workUrl)
    if (!workRes.ok) {
      console.error(`❌ Open Library work returned ${workRes.status}`)
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
      } catch (err) {
        console.warn(`⚠️ Author fetch failed: ${err.message}`)
      }
    }

    const description =
      typeof work.description === 'string'
        ? work.description
        : (work.description?.value ?? null)

    res.json({
      key: olid,
      title: work.title ?? null,
      description,
      subjects: work.subjects ?? [],
      covers: work.covers ?? [],
      first_publish_date: work.first_publish_date ?? null,
      author_name: authorName,
      author_key: authorKey,
    })
  } catch (error) {
    console.error('❌ Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`✅ API Server running at http://localhost:${PORT}`)
  console.log(
    `📚 Endpoint: GET http://localhost:${PORT}/books?q=science+fiction&limit=50`,
  )
})
