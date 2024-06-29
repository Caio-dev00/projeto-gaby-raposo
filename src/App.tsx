import { createBrowserRouter } from "react-router-dom";

import { Home } from "./pages/home";
import { ProductDetail } from "./pages/product";
import { Dashboard } from "./pages/dashboard";
import { New } from "./pages/dashboard/new";
import { Categorias } from "./pages/dashboard/categorias"
import { Login } from "./pages/login"; 
import { Register } from "./pages/register";
import { CadastrarCategoria } from "./pages/dashboard/categorias/cadastrar-categoria";
import { Variacoes } from "./pages/dashboard/variacoes";
import { CadastrarTamanho } from "./pages/dashboard/variacoes/variacoes-tamanho";
import { CadastrarCor } from "./pages/dashboard/variacoes/variacoes-cor";
import { Banners } from "./pages/dashboard/banners";
import { CadastrarBanner } from "./pages/dashboard/banners/cadastrar-banner";

import { Layout } from "./components/layout";
import { Private } from "./routes/Private";
import Produtos from "./pages/produtos/produtos";
import ProtectedRegister from "./pages/register/RegisterProtected";


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
      {
        path: "/produtos/:categoria/:tamanho",
        element: <Produtos />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/adm-2024",
        element: <ProtectedRegister /> // Usar o novo componente para proteger o registro
      },
      {
        path: "/adm-2024/admin",
        element: <Register />
      },
      
    ]
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
    path: "/dashboard/new/:id",
    element: <Private><New /></Private>
  },
  {
    path: "/dashboard/categorias",
    element: <Private><Categorias /></Private>
  },
  {
    path: "/dashboard/categorias/cadastrar-categoria",
    element: <Private><CadastrarCategoria /></Private>
  },
  {
    path: "/dashboard/categorias/cadastrar-categoria/:id",
    element: <Private><CadastrarCategoria /></Private>
  },
  {
    path: "/dashboard/variacoes",
    element: <Private><Variacoes/></Private>
  },
  {
    path: "/dashboard/variacoes/variacoes-tamanho",
    element: <Private><CadastrarTamanho/></Private>
  },
  {
    path: "/dashboard/variacoes/variacoes-tamanho/:id",
    element: <Private><CadastrarTamanho/></Private>
  },
  {
    path: "/dashboard/variacoes/variacoes-cor",
    element: <Private><CadastrarCor/></Private>
  },
  {
    path: "/dashboard/variacoes/variacoes-cor/:id",
    element: <Private><CadastrarCor/></Private>
  },
  {
    path: "/dashboard/banners",
    element: <Private><Banners/></Private>
  },
  {
    path: "/dashboard/banners/cadastrar-banner",
    element: <Private><CadastrarBanner/></Private>
  },
  {
    path:  "/dashboard/banners/cadastrar-banner/:id",
    element: <Private><CadastrarBanner/></Private>
  },
])

export { router }