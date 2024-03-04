import { FaUser } from "react-icons/fa"
import { HeaderDashboard } from "../../components/headerDashboard"
import Title from "../../components/titleDahsboard"



export function Dashboard() {
  
  return (
    <div>
      <HeaderDashboard/>

      
        <div className="ml-[300px] pt-[1px] px-[16px]">
          <Title name="Dashboard">
            <FaUser size={25} color="#FFF" />
          </Title>
        </div>
      
    </div>
  )
}
