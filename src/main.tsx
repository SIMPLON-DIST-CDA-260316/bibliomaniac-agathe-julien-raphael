import { createRoot } from "react-dom/client"
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"

import "./index.css"

import Home from "./pages/Home.tsx"

import App from "./App.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/search",
        element: <h1>Search</h1>,
      },
      {
        path: "/book/:id",
        element: <h1>Book Details</h1>,
      },
      {
        path: "/library",
        element: <h1>Library</h1>,
      },
      {
        path: "/profile",
        element: <h1>Profile</h1>,
      },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
)
