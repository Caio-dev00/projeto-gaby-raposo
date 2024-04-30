import Header from "../header"
import Footer from "../Footer"
import { Outlet } from "react-router-dom"


export function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
