import { Link } from "react-router-dom";
import logoImg from '../../assets/logo.png';
import { FaShoppingBag } from "react-icons/fa";

export default function Header() {
    return (
      <div className="w-full flex items-center justify-center h-16 bg-salmon-light">
        <header className="flex w-full max-7xl items-center justify-between px-4 mx-auto">
          <Link to="/">
            <img 
            className="w-12"
            src={logoImg} 
            alt="Logo Header" />
          </Link>

          
             <li className="flex justify-between gap-5 font-semibold text-sm">
                <a href=""><ul>PAGINA INICIAL</ul></a>
                <a href=""><ul>CATÁLOGO</ul></a>
                <a href=""><ul>SOBRE</ul></a>
                <a href=""><ul>CONTATO</ul></a>
             </li>
          

            <button>
              <FaShoppingBag size={26} color="#000"/>
            </button>
            
          
        </header>
      </div>
    )
  }