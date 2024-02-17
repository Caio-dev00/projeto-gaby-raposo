import { Container } from "../../components/container"

export function ProductDetail() {
  return (
    <Container>
      <div className="flex flex-row justify-center mt-20">
        <div className="flex w-full h-full">
          <div className="flex flex-col gap-2 justify-between w-24 h-24">
            <img src="/src/assets/produto.png" alt="" className="" />
            <img src="/src/assets/produto.png" alt="" className="" />
            <img src="/src/assets/produto.png" alt="" className="" />
            <img src="/src/assets/produto.png" alt="" className="" />
          </div>
          <img src="/src/assets/produto.png" alt="" className="ml-2 w-full h-full aspect-square object-cover" />
          <div className="flex ml-4 w-full h-full flex-col">
            <div className="uppercase">
              <h1 className="font-semibold font-xl text-black">Produto Modelo</h1>
              <h2 className="text-xl font-bold ">R$99,90</h2>
              <hr className="my-4 w-60 "/>
              <h3>Tamanhos</h3>




            </div>

          </div>

        </div>


      </div>
    </Container>

  )
}
