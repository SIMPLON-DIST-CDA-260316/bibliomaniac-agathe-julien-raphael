import path from 'path'
import { pathToFileURL } from 'url'
import type { IncomingMessage, ServerResponse } from 'http'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

type VercelHandler = (
  req: IncomingMessage & { query: Record<string, string> },
  res: ServerResponse & {
    status: (code: number) => ServerResponse
    json: (data: unknown) => ServerResponse
  },
) => void | Promise<void>

interface HandlerModule {
  default: VercelHandler
}

function devApiRoutes(): Plugin {
  return {
    name: 'dev-api-routes',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        void (async () => {
          const url = req.url ?? ''
          if (!url.startsWith('/api/')) return next()

          const parsed = new URL(url, 'http://localhost')
          const query: Record<string, string> = {}
          parsed.searchParams.forEach((v, k) => (query[k] = v))

          let handlerFile: string | null = null
          if (parsed.pathname === '/api/books') {
            handlerFile = path.resolve(__dirname, 'api/books.js')
          } else if (parsed.pathname.startsWith('/api/books/')) {
            query.olid = parsed.pathname.slice('/api/books/'.length)
            handlerFile = path.resolve(__dirname, 'api/books/[olid].js')
          }

          if (!handlerFile) return next()

          try {
            const mod = (await import(
              pathToFileURL(handlerFile).href + `?t=${Date.now()}`
            )) as HandlerModule
            const vercelRes = res as ServerResponse & {
              status: (code: number) => ServerResponse
              json: (data: unknown) => ServerResponse
            }
            vercelRes.status = (code) => {
              res.statusCode = code
              return vercelRes
            }
            vercelRes.json = (data) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
              return vercelRes
            }
            const vercelReq = Object.assign(req, { query })
            await mod.default(vercelReq, vercelRes)
          } catch (err) {
            console.error('[dev-api-routes] error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: (err as Error).message }))
          }
        })()
      })
    },
  }
}

export default defineConfig({
  plugins: [devApiRoutes(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
