import { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from '../../assets/logo.png';
import { FaShoppingBag, FaBars  } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

export default function Header() {
    const [toggleButton, setToggleButton] = useState(false)

    const handleToggleButton = () => {
      setToggleButton(toggleButton => !toggleButton)
    }

    return (
      <div className="w-full flex items-center justify-center h-28 bg-salmon">
        <header className="flex w-full max-7xl items-center justify-between px-4 mx-auto">
            
              <Link to="/">
                <img 
                className="w-14"
                src={logoImg} 
                alt="Logo Header" />
              </Link>
            
            <div className="block max-md:hidden">
              <li className="flex justify-between gap-5 font-semibold text-sm">
                    <a href=""><ul>PAGINA INICIAL</ul></a>
                    <a href=""><ul>CATÁLOGO</ul></a>
                    <a href=""><ul>SOBRE</ul></a>
                    <a href=""><ul>CONTATO</ul></a>
                </li>
            </div>       

            <button onClick={handleToggleButton} className="cursor-pointer md:hidden hover:bg-slate-300 p-2 rounded-lg">
              {!toggleButton ? (
                <FaBars size={26} color="#000"/>
              ): (
                <AiOutlineClose size={26} color="#000" />
              )}
            </button>   

            <button>
              <FaShoppingBag size={26} color="#000"/>
            </button>
            
          
        </header>
      </div>
    )
  }