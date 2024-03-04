import { HeaderDashboard } from "../../../components/headerDashboard";
import Title from "../../../components/titleDahsboard";

import { FaListAlt } from "react-icons/fa";


export function New() {
  return (
    <div>
      <HeaderDashboard/>

      
      <div className="ml-[300px] pt-[1px] px-[16px]">
          <Title name="Lista de Produtos">
            <FaListAlt size={25} color="#FFF" />
          </Title>
        </div>

    </div>
  )
}
