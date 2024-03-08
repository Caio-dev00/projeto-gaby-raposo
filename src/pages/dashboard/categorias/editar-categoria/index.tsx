import { HeaderDashboard } from "../../../../components/headerDashboard";
import Title from "../../../../components/titleDahsboard";
import { FaEdit, FaListAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export function EditarCategoria() {
  return (
    <div>
      <HeaderDashboard/>

      
      <div className="ml-[300px] pt-[1px] px-[16px] max-md:ml-0">
        <Title name="Cadastrar Categorias" >
          <FaEdit size={25} color="#FFF" />
        </Title>
        
        <div className="mt-12">
          <input
            placeholder="Nome da Categoria"
            className="w-full my-2 p-3 rounded-full border-2 max-sm:p-1"
            type="text" />
        </div>
        <div className="flex w-full justify-around mt-10 p-2">
          <div>
            <button className="bg-inherit border-2 rounded-2xl p-2 border-wine-light text-wine-black font-semibold hover:bg-wine-black hover:bg-opacity-15" >
              <Link to="/dashboard/categorias">
                <span>Voltar e Fechar</span>
              </Link>
            </button>
          </div>
          <div>
            <button className="bg-wine-light border-2 rounded-2xl p-2 border-wine-light text-white font-semibold hover:bg-opacity-90" >Salvar Categoria</button>
          </div>
        </div>
          
      </div>

      

    </div>
  )
}
