import { Outlet, ScrollRestoration } from "react-router"

import Navbar from "./components/Navbar.tsx"

export default function App() {
  return (
    <div className="bg-background text-text min-h-screen">
      <ScrollRestoration />
      <nav className="z-30">
        <Navbar />
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
