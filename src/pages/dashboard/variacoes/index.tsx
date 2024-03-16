import { HeaderDashboard } from "../../../components/headerDashboard";
import Title from "../../../components/titleDahsboard";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

export function Variacoes() {
    return (
        <div>
            <HeaderDashboard />

            <div className="ml-[300px] pt-0.5 px-4 max-md:ml-0">
                <Title name="Variações">
                    <FaEdit size={25} color="#FFF" />
                </Title>

                <div className="flex justify-around py-1 px-0">
                    <button className="flex justify-center items-center w-36 h-10 float-right bg-wine-black rounded-full hover:scale-105 duration-300 sm:w-48 lg:w-56">
                        <Link to="/dashboard/variacoes/variacoes-tamanho">
                            <span className="text-white text-[11px] font-semibold">CADASTRAR TAMANHO</span>
                        </Link>
                    </button> 

                    <button className="flex justify-center items-center w-36 h-10 float-right bg-wine-black rounded-full hover:scale-105 duration-300 sm:w-48 lg:w-56">
                        <Link to="#">
                            <span className="text-white text-[11px] font-semibold">CADASTRAR COR</span>
                        </Link>
                    </button>
                </div>
                
                <div>
                    <table className="w-full text-center border-solid border my-2 p-0 table-fixed border-collapse max-sm:border-0">
                        <thead className="max-sm:border-none max-sm:m-[-1px] max-sm:h-[1px] max-sm:overflow-hidden max-sm:p-0 max-sm:w-[1px]">
                            <tr className="bg-slate-100 border border-solid border-zinc-500 text-[0.85em] uppercase max-md:text-[0.7rem] max-sm:text-[0.5rem]">
                                <th scope="col">Nome Variação</th>
                                <th scope="col">Tipo de Variação</th>
                                <th scope="col">Ações</th>
                            </tr>
                        </thead>
                    </table>
                </div>

            </div>








        </div>

    )
}