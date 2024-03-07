import { FaUser } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HeaderDashboard } from "../../../components/headerDashboard"
import Title from "../../../components/titleDahsboard"
import { Link } from "react-router-dom"

import '../dashboard.css'


export function Categorias() {

    return (
        <div>
            <HeaderDashboard />


            <div className="ml-[300px] pt-[1px] px-[16px] max-md:ml-0">
                <Title name="Categorias">
                    <FaUser size={25} color="#FFF" />
                </Title>




                <button className="mb-4 flex justify-center items-center w-[250px] h-[40px] float-right ml-2 bg-wine-black rounded-full hover:scale-105 duration-300 max-sm:w-[180px]">
                    <Link to="/dashboard/new">
                        <span className="text-white text-[0.8rem] p-1 font-semibold max-sm:text-[12px]">CADASTRAR CATEGORIA</span>
                    </Link>
                </button>
                <div className="flex justify-center items-center mb-5 mr-4 w-full max-sm:text-[0.9rem]">
                    <input
                        placeholder="Buscar Categorias"
                        className="w-full p-3 rounded-full border-2 max-sm:p-1"
                        type="text" />
                </div>
                <table className="w-full text-center border-solid border m-0 p-0 table-fixed border-collapse max-sm:border-0">
                    <thead className="max-sm:border-none max-sm:m-[-1px] max-sm:h-[1px] max-sm:overflow-hidden max-sm:p-0 max-sm:w-[1px]">
                        <tr className="bg-slate-100 border border-solid border-zinc-500 text-[0.85em] uppercase max-md:text-[0.7rem] max-sm:text-[0.5rem]">
                            <th scope="col">Código</th>
                            <th scope="col">Produto</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">Preço</th>
                            <th scope="col">Estoque</th>
                            <th scope="col">Status</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white border border-solid text-[14px] border-zinc-300 max-sm:text-[12px] max-sm:p-1">
                            <td className="border-0 rounded-[4px] py-2" data-label="código">01</td>
                            <td className="border-0 rounded-[4px] py-2" data-label="produto">Produto Modelo 01</td>
                            <td className="border-0 rounded-[4px] py-2" data-label="categoria">Conjunto</td>
                            <td className="border-0 rounded-[4px] py-2" data-label="preco">R$ 99,90</td>
                            <td className="border-0 rounded-[4px] py-2" data-label="estoque">54</td>
                            <td className="border-0 p-[3px]" data-label="status">
                                <span className=" p-2 text-[12px] text-white rounded-full bg-green-500 max-sm:text-[10px]">ATIVO</span>
                            </td>
                            <td className="border-0 rounded-[4px] py-2" data-label="ações">
                               <button>
                                    <Link to={`/dashboard/new:id`}>
                                        <FiEdit2 size={15} color="#000" />
                                    </Link>
                               </button>
                            </td>
                        </tr>
                        <tr className="bg-white border border-solid text-[14px] border-zinc-5300 max-sm:text-[12px] max-sm:p-1">
                            <td className="border-0 rounded-[4px] py-2" data-label="código">01</td>
                            <td className="border-0 rounded-[4px] py-2" data-label="produto">Produto Modelo 01</td>
                            <td className="border-0 rounded-[4px] py-2" data-label="categoria">Conjunto</td>
                            <td className="border-0 rounded-[4px] py-2" data-label="preco">R$ 99,90</td>
                            <td className="border-0 rounded-[4px] py-2" data-label="estoque">54</td>
                            <td className="border-0 p-[3px]" data-label="status">
                                <span className=" p-2 text-[12px] text-white rounded-full bg-red-500 max-sm:text-[10px]">INATIVO</span>
                            </td>
                            <td className="border-0 rounded-[4px] py-2" data-label="ações">
                                <button>
                                    <Link to={`/dashboard/new:id`}>
                                        <FiEdit2 size={15} color="#000" />
                                    </Link>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
