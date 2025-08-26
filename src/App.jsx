// React
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router"
// Pages
import NotFound from "./pages/notFound/NotFound"
import Confirmation from "./pages/confirmation/Confirmation"
// Components
import Index from "./components/index/Index"


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Index />} />
      <Route path="confirmation" element={<Confirmation />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
)

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}