import { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from '../../assets/logo.png';
import { FaShoppingBag } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { Container } from "../container";

export default function Header() {
    const [toggleButton, setToggleButton] = useState(false)

    const handleToggleButton = () => {
      setToggleButton(toggleButton => !toggleButton)
    }

    return (
      <div className="w-full flex items-center justify-center h-28 bg-salmon">
       <Container>
       <header className="flex w-full max-7xl items-center justify-between px-4 mx-auto">
            
            <Link to="/">
              <img 
              className="w-20 max-w-20 max-md:justify-center"
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
          
          {toggleButton && (
             <div className="none w-full md:hidden md:w-auto relative top-36 z-10">
             <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
               <li>
                 <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Pagina Incial</a>
               </li>
               <li>
                 <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Catálogo</a>
               </li>
               <li>
                 <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Sobre</a>
               </li>
               <li>
                 <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Contato</a>
               </li>
             </ul>
           </div>
          )}     

        {toggleButton ? (
            <button onClick={handleToggleButton} className="absolute right-2/4 left-2/4 inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
             <div className="w-5 h-5" aria-hidden="true">
               <AiOutlineClose size={19} color="#000"/>
             </div>
            </button>
         
        ): (
          <button onClick={handleToggleButton} className="absolute right-2/4 left-2/4 inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">  
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        )}

          <button>
            <FaShoppingBag size={26} color="#000"/>
          </button>
          
        
      </header>
       </Container>
      </div>
    )
  }