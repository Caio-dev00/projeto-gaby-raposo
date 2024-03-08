import { HeaderDashboard } from "../../../components/headerDashboard";
import Title from "../../../components/titleDahsboard";

import { FaListAlt } from "react-icons/fa";

const id = false

export function New() {
  return (
    <div>
      <HeaderDashboard/>

      
      <div className="ml-[300px] pt-[1px] px-[16px]">
          <Title name={id ? "Editando produto" : "Cadastrar Produto"}>
            <FaListAlt size={25} color="#FFF" />
          </Title>
        </div>

    </div>
  )
}
