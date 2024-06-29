import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { Container } from "../container";
import NestedModal from "../Modals";
import logo from "/src/assets/logo.png"

export default function Header() {
  const [toggleButton, setToggleButton] = useState(false);
  const divRef = useRef<HTMLUListElement>(null);

  const handleToggleButton = () => {
    setToggleButton(!toggleButton);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (divRef.current && !divRef.current.contains(event.target as Node)) {
      setToggleButton(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (this: HTMLAnchorElement, e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href")!) as HTMLElement;

        if (target) {
          window.scrollTo({
            top: target.offsetTop,
            behavior: "smooth",
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
              src={logo}
              alt="Logo Header"
            />
          </Link>

          <div className="block max-md:hidden">
            <ul className="flex justify-between gap-5 font-semibold text-sm">
              <li>
                <Link to="/">PAGINA INICIAL</Link>
              </li>
              <li>
                <a href="#catalogo">CATÁLOGO</a>
              </li>
              <li>
                <a href="#footer">SOBRE</a>
              </li>
              <li>
                <a href="#footer">CONTATO</a>
              </li>
            </ul>
          </div>

          {toggleButton && (
            <div className="none max-w-[90%] w-full md:hidden absolute pt-[18rem] z-10">
              <ul
                ref={divRef}
                className="w-3/4 font-medium flex flex-col p-4 mt-4 rounded-lg bg-wine-light"
              >
                <li>
                  <a href="#" className="block py-2 px-3 text-gray-100 rounded">
                    Pagina Incial
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-3 text-gray-100 rounded">
                    Catálogo
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-3 text-gray-100 rounded">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-3 text-gray-100 rounded">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
          )}

          {toggleButton ? (
            <button
              onClick={handleToggleButton}
              className="flex justify-center items-center absolute z-20 w-10 h-10 md:hidden"
            >
              <div className="w-5 h-5" aria-hidden="true">
                <AiOutlineClose size={19} color="#000" />
              </div>
            </button>
          ) : (
            <button
              onClick={handleToggleButton}
              className="absolute flex justify-center items-center z-20 w-10 h-10 md:hidden"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          )}
          <Link to="/" className="">
            <img
              className="w-10 max-w-10 md:hidden max-md:block"
              src="/src/assets/logo.png"
              alt="Logo Header"
            />
          </Link>

          <button>
            <NestedModal />
          </button>
        </header>
      </Container>
    </div>
  );
}
