import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./pages/home";
import { ProductDetail } from "./pages/product";
import { Dashboard } from "./pages/dashboard";
import { New } from "./pages/dashboard/new";
import { Categorias } from "./pages/dashboard/categorias";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { CadastrarCategoria } from "./pages/dashboard/categorias/cadastrar-categoria";
import { Variacoes } from "./pages/dashboard/variacoes";
import { Banners } from "./pages/dashboard/banners";
import { CadastrarBanner } from "./pages/dashboard/banners/cadastrar-banner";

import { Layout } from "./components/layout";
import Produtos from "./pages/produtos/produtos";
import ProtectedRegister from "./pages/register/RegisterProtected";
import { Private } from "./routes/Private";
import { CadastrarTamanho } from "./pages/dashboard/variacoes/variacoes-tamanho";
import { CadastrarCor } from "./pages/dashboard/variacoes/variacoes-cor";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="produtos/:categoria/:tamanho" element={<Produtos />} />
          <Route path="login" element={<Login />} />
          <Route path="adm-2024" element={<ProtectedRegister />} />
          <Route path="adm-2024/admin" element={<Register />} />
        </Route>

        <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
        <Route path="/dashboard/new" element={<Private><New /></Private>} />
        <Route path="/dashboard/new/:id" element={<Private><New /></Private>} />
        <Route path="/dashboard/categorias" element={<Private><Categorias /></Private>} />
        <Route path="/dashboard/categorias/cadastrar-categoria" element={<Private><CadastrarCategoria /></Private>} />
        <Route path="/dashboard/categorias/cadastrar-categoria/:id" element={<Private><CadastrarCategoria /></Private>} />
        <Route path="/dashboard/variacoes" element={<Private><Variacoes /></Private>} />
        <Route path="/dashboard/variacoes/variacoes-tamanho" element={<Private><CadastrarTamanho /></Private>} />
        <Route path="/dashboard/variacoes/variacoes-tamanho/:id" element={<Private><CadastrarTamanho /></Private>} />
        <Route path="/dashboard/variacoes/variacoes-cor" element={<Private><CadastrarCor /></Private>} />
        <Route path="/dashboard/variacoes/variacoes-cor/:id" element={<Private><CadastrarCor /></Private>} />
        <Route path="/dashboard/banners" element={<Private><Banners /></Private>} />
        <Route path="/dashboard/banners/cadastrar-banner" element={<Private><CadastrarBanner /></Private>} />
        <Route path="/dashboard/banners/cadastrar-banner/:id" element={<Private><CadastrarBanner /></Private>} />
      </Routes>
    </Router>
  );
}

export default App;