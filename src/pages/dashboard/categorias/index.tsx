import { HeaderDashboard } from "../../../components/headerDashboard"
import Title from "../../../components/titleDahsboard"
import { CgDetailsMore } from "react-icons/cg";



export function Categorias() {
    return (
      <div>
        <HeaderDashboard/>
  
        
        <div className="ml-[300px] pt-[1px] px-[16px]">
            <Title name="Categorias">
                <CgDetailsMore size={25} color="#fff" />
            </Title>
            
            <div className="flex flex-row justify-end">
                <button className="flex flex-row justify-end px-4 py-2 rounded-md bg-wine-light text-white text-sm font-semibold ">Cadastrar Categoria</button>
            </div> 

            <div className="mt-4">
                
                <table className="w-full h-auto border-collapse border border-gray-500">
                    <thead>
                        <tr className="font-semibold bg-slate-300">
                            <td>Código</td>
                            <td>Categorias</td>
                            <td>Status</td>
                            <td>Ações</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="font-normal bg-slate-200">
                            <td>01</td>
                            <td>Pijama</td>
                            <td>Ativo</td>
                            <td>icon edit</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    )
  }