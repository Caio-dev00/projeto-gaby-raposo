import { useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext";
import logo from '../../assets/logo.png'
import { Link } from "react-router-dom";

export function HeaderDashboard() {
  const { user } = useContext(AuthContext)
  return (
    <aside className="w-[300px] bg-wine-black fixed h-full overflow-auto m-0 p-0 max-md:w-full max-md:h-auto max-md:relative">
      <div className="w-full bg-center bg-repeat bg-cover h-[150px] p-[30px] max-md:hidden">
        <img
          className=" pb- w-[90px] h-[90px] block m-auto rounded-[50px] object-cover drop-shadow-md"
          src={logo}
          alt="logo" />

        <div className="flex justify-center items-center">
          <span className=" text-white font-medium text-nowrap overflow-auto p-2">{user?.name} | Dashboard</span>
        </div>
        <hr className='w-[250px] border-white my-1'></hr>
      </div>

      <div className="flex flex-col justify-start pt-8 pl-2 max-md:items-center max-md:pl-0">
          <span className="font-semibold text-white">PRODUTOS</span>
          <Link to='/dashboard' className="mb-0.5 pl-4 text-white">
            Lista de produtos
          </Link>
          <Link to='/dashboard/categorias' className="mb-0.5 pl-4 text-white">
            Categorias
          </Link>
          <Link to="/dashboard/variacoes" className="mb-0.5 pl-4 text-white">
            Variações
          </Link>
          <span className="font-semibold text-white mt-2">MARKETING</span>
          <Link to='/dashboard/banners' className="mb-0.5 pl-4 text-white">
            Banners
          </Link>
      </div>
    </aside>
  )
}
