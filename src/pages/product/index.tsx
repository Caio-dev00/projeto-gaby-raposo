import { Container } from "../../components/container"

export function ProductDetail() {
  return (
    <Container>
      <div className="flex flex-row justify-center mt-20">
        <div className="flex flex-col gap-2 w-[100px] pr-2 ">
            <img src="/src/assets/produto.png" alt="" className="" />
            <img src="/src/assets/produto.png" alt="" className="" />
            <img src="/src/assets/produto.png" alt="" className="" />
            <img src="/src/assets/produto.png" alt="" className="" />
        </div>
        <div className="flex w-[600px] h-[600px] aspect-square">
          <img src="/src/assets/produto.png" alt="" className=" h-full w-full" />
        </div>
        <div className="flex ml-10 h-full">
            <div className="uppercase w-full">
              <h1 className="font-semibold text-[20px] text-gray-500">Produto Modelo</h1>
              <h2 className="text-[32px] font-bold text-vinho-principal">R$99,90</h2>
              <hr className="mt-[25px] w-60" />
              <h3 className="font-bold mt-[25px]">Tamanhos</h3>
              <div className="flex flex-row gap-2 uppercase font-semibold">
                <button className="w-8 h-8 rounded-full mt-2 ml-2 bg-salmon">P</button>
                <button className="w-8 h-8 rounded-full mt-2 ml-2 bg-salmon">M</button>
                <button className="w-8 h-8 rounded-full mt-2 ml-2 bg-salmon">G</button>
                <button className="w-8 h-8 rounded-full mt-2 ml-2 bg-salmon">GG</button>
              </div>
              <h4 className="font-bold mt-[25px] ">Cores</h4>
              <div className="flex flex-row gap-2">
                <button className="w-8 h-8 rounded-full mt-2 ml-2 shadow shadow-gray-500 bg-white"></button>
                <button className="w-8 h-8 rounded-full mt-2 ml-2 shadow shadow-gray-500 bg-red-600"></button>
                <button className="w-8 h-8 rounded-full mt-2 ml-2 shadow shadow-gray-500 bg-cyan-500"></button>
                <button className="w-8 h-8 rounded-full mt-2 ml-2 shadow shadow-gray-500 bg-rose-600"></button>
              </div>
              <h5 className="font-bold mt-[25px]">Quantidade</h5>
              <div className="flex flex-row mt-2 ml-2 w-[90px] h-[30px] justify-around rounded-[12px] border-solid border-2 border-black">
                <button className="font-bold">-</button>
                <button className="font-bold">1</button>
                <button className="font-bold">+</button>
              </div>
              <div className="flex mt-[25px]">
                <input className="w-full h-[80px] text-[15px] border-2 rounded-lg border-gray-500 border-opacity-50" placeholder="Observações do Pedido" type="text"/>
              </div>
              <div className="mt-[25px]">
                <button className="uppercase flex flex-row w-full justify-center items-center font-semibold text-white text-[14px] rounded-md h-[32px] bg-wine-black">Adicionar ao Carrinho</button>
              </div>
            </div>
        </div>
      </div>
      <div className="mt-20">
        <p></p>
      </div>
    </Container>

  )
}
