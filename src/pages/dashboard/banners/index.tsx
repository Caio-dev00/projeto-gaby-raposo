import { HeaderDashboard } from "../../../components/headerDashboard"
import Title from "../../../components/titleDahsboard"
import { FaEdit } from "react-icons/fa"
import { Link } from "react-router-dom"

export function Banners() {
    return (
        <div>
            <HeaderDashboard />
            <div className="ml-[300px] pt-0.5 px-4 max-md:ml-0">
                <Title name="Banners">
                    <FaEdit size={25} color="fff" />
                </Title>

                <button className="flex justify-center mb-4 items-center w-[200px] h-10 float-right bg-wine-black rounded-full hover:scale-105 duration-300 sm:w-48 lg:w-56">
                    <Link to="#">
                        <span className="text-white text-xs font-semibold">CADASTRAR BANNER</span>
                    </Link>
                </button>

                <div>
                    <table className="w-full text-center border-solid border m-0 p-0 table-fixed border-collapse max-sm:border-0">
                        <thead className="max-sm:border-none max-sm:m-[-1px] max-sm:h-[1px] max-sm:overflow-hidden max-sm:p-0 max-sm:w-[1px]">
                            <tr className="bg-slate-100 border border-solid border-zinc-500 text-[0.85em] uppercase max-md:text-[0.7rem] max-sm:text-[0.5rem]">
                                <th scope="col">ID</th>
                                <th scope="col">Nome banner</th>
                                <th scope="col">Status</th>
                                <th scope="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>











            </div>
        </div>



    )
}






