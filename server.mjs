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

app.listen(PORT, () => {
  console.log(`✅ API Server running at http://localhost:${PORT}`)
  console.log(
    `📚 Endpoint: GET http://localhost:${PORT}/books?q=science+fiction&limit=50`,
  )
})
