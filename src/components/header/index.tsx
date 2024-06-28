import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { Container } from "../container";
import NestedModal from "../Modals";

export default function Header() {
    const [toggleButton, setToggleButton] = useState(false)

    const handleToggleButton = () => {
      setToggleButton(toggleButton => !toggleButton)
    }

    useEffect(() => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
              e.preventDefault();

              const target = document.querySelector(this.getAttribute('href'));

              if (target) {
                  window.scrollTo({
                      top: target.offsetTop,
                      behavior: 'smooth'
                  });
              }
          });
      });
  }, []);

    return (
      <div className="w-full flex items-center h-20 bg-salmon">
       <Container>
          <header className="flex w-full max-7xl items-center justify-between">
            
            <Link to="/">
                <img 
                className="w-10 max-w-10 max-md:hidden"
                src="/src/assets/logo.png"
                alt="Logo Header" />
            </Link>

          <div className="block max-md:hidden">
              <li className="flex justify-between gap-5 font-semibold text-sm">
                  <Link to="/">PAGINA INICIAL</Link>
                  <a href="#catalogo">CATÁLOGO</a>
                  <a href="#footer"><ul>SOBRE</ul></a>
                  <a href="#footer"><ul>CONTATO</ul></a>
              </li>
          </div> 
          
          {toggleButton && (
            <div className="none max-w-[90%] w-full md:hidden absolute pt-[18rem] z-10">
              <ul className="w-full font-medium flex flex-col p-4 mt-4 rounded-lg bg-wine-light ">
                <li>
                  <a href="#home" className="block py-2 px-3 text-gray-100 rounded">Pagina Incial</a>
                </li>
                <li>
                  <a href="#catalogo" className="block py-2 px-3 text-gray-100 rounded">Catálogo</a>
                </li>
                <li>
                  <a href="#footer" className="block py-2 px-3 text-gray-100 rounded">Sobre</a>
                </li>
                <li>
                  <a href="#footer" className="block py-2 px-3 text-gray-100 rounded">Contato</a>
                </li>
              </ul>
           </div>
          )}     

        {toggleButton ? (
            <button onClick={handleToggleButton} className="flex justify-center items-center absolute z-20 w-10 h-10 md:hidden">
             <div className="w-5 h-5" aria-hidden="true">
               <AiOutlineClose size={19} color="#000"/>
             </div>
            </button>
         
        ): (
                <button onClick={handleToggleButton} className="absolute flex justify-center items-center z-20 w-10 h-10 md:hidden">  
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        )}
            <Link to="/" className="">
                <img 
                className="w-10 max-w-10 md:hidden max-md:block" 
                src="/src/assets/logo.png" 
                alt="Logo Header" />
            </Link>

          <button>
            <NestedModal/>
          </button>
          
        
      </header>
       </Container>
      </div>
    )
  }