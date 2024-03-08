import { createBrowserRouter } from "react-router-dom";

import { Home } from "./pages/home";
import { ProductDetail } from "./pages/product";
import { Dashboard } from "./pages/dashboard";
import { New } from "./pages/dashboard/new";
import { Categorias } from "./pages/dashboard/categorias"
import { Login } from "./pages/login"; 
import { Register } from "./pages/register";
import { EditarCategoria } from "./pages/dashboard/categorias/editar-categoria";

import { Layout } from "./components/layout";
import { Private } from "./routes/Private";


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/product/:id",
        element: <ProductDetail />
      },
      
    ]
  },
  {
    path: "/login",
    element: <Private><Login /></Private>
  },
  {
    path: "/register",
    element: <Private><Register /></Private>
  },
  {
    path: "/dashboard",
    element: <Private><Dashboard /></Private>
  },
  {
    path: "/dashboard/new",
    element: <Private><New /></Private>
  },
  {
    path: "/dashboard/new:id",
    element: <Private><New /></Private>
  },
  {
    path: "/dashboard/categorias",
    element: <Private><Categorias /></Private>
  },
  {
    path: "/dashboard/categoria/editar-categoria",
    element: <Private><EditarCategoria /></Private>
  }
])

export { router }