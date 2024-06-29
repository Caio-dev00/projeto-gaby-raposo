import { useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { PiSignOutBold } from "react-icons/pi";

export function HeaderDashboard() {
  const { user, logOut } = useContext(AuthContext)
  const navigate = useNavigate()


  return (
    <aside className="w-[300px] bg-wine-black fixed h-full overflow-auto m-0 p-0 max-md:w-full max-md:h-auto max-md:relative">
      <div className="w-full bg-center bg-repeat bg-cover h-[150px] p-[30px] max-md:hidden">
        <img
          onClick={() => navigate("/")}
          className=" cursor-pointer pb- w-[90px] h-[90px] block m-auto rounded-[50px] object-cover drop-shadow-md"
          src="/src/assets/logo-footer.png"
          alt="logo" />

        <div className="flex justify-center items-center">
          <span className=" text-white font-medium text-nowrap overflow-auto p-2">{user?.name} | Dashboard</span>
        </div>
        <hr className='w-[250px] border-white my-1'></hr>
      </div>

      <div className="flex flex-col justify-center pt-8 pl-2 max-md:items-center max-md:pl-0">
          <span className="font-semibold text-white">PRODUTOS</span>
          <Link to='/dashboard' className="mb-0.5 text-white md:pl-3">
            Lista de produtos
          </Link>
          <Link to='/dashboard/categorias' className="mb-0.5 text-white md:pl-3">
            Categorias
          </Link>
          <Link to="/dashboard/variacoes" className="mb-0.5 text-white md:pl-3">
            Variações
          </Link>
          <span className="font-semibold text-white mt-2">MARKETING</span>
          <Link to='/dashboard/banners' className="mb-0.5 text-white md:pl-3">
            Banners
          </Link>
          <button onClick={() => logOut()} className="mb-0.5 text-white md:pl-3 max-md:relative max-md:mt-5 flex justify-start absolute bottom-1 items-center">
          <span className="mr-1 text-md font-semibold max-md:font-normal ">Sair</span>
          <PiSignOutBold size={20}/>
          </button>
      </div>
    </aside>
  )
}
