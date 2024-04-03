import { useContext, useEffect, useState } from "react"

import { Container } from "../../components/container"
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { productProps } from "../dashboard";
import { AuthContext } from "../../contexts/AuthContext";


export function ProductDetail() {
  const { user } = useContext(AuthContext)
  const [product, setProduct] = useState<productProps[]>([]);

  useEffect(() => {
    loadProducts()
    return () => { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function loadProducts() {
    const productRef = collection(db, 'Produtos')
    const q = query(productRef, orderBy("created", "desc"))

    await getDocs(q)
      .then((snapshot) => {
        const listProducts = [] as productProps[];

        snapshot.forEach(doc => {
          listProducts.push({
            id: doc.id,
            name: doc.data().name,
            category: doc.data().categoria,
            color: doc.data().colors,
            price: doc.data().price,
            size: doc.data().sizes,
            storage: doc.data().storage,
            status: doc.data().status,
            description: doc.data().description,
            images: doc.data().images
          })
        })
        setProduct(listProducts)
      })
  }

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
        <div className="flex ml-8 w-80 h-full">
          <div className="uppercase w-full h-full">
            <h1 className="font-semibold text-[20px] text-gray-500">Produto Modelo</h1>
            <h2 className="text-[32px] font-bold text-vinho-principal">R$99,90</h2>
            <hr className="mt-[25px] w-60" />
            <h3 className="font-bold mt-6">Tamanhos</h3>
            <div className="flex flex-row gap-2 uppercase font-semibold">
             {product.map((item) => (
               <select
               className='w-full max-w-50 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2'
               value={item.size}
               >
              {item.size.map((size, sizeIndex) => (
                <option key={sizeIndex} value={size}>
                 {size}
               </option>
              ))}
             </select>
             ))}
            </div>
            <h4 className="font-bold mt-6 ">Cores</h4>
            <div className="flex flex-row gap-2">
              <button className="w-8 h-8 rounded-full mt-2 ml-2 shadow shadow-gray-500 bg-white"></button>
              <button className="w-8 h-8 rounded-full mt-2 ml-2 shadow shadow-gray-500 bg-red-600"></button>
              <button className="w-8 h-8 rounded-full mt-2 ml-2 shadow shadow-gray-500 bg-cyan-500"></button>
              <button className="w-8 h-8 rounded-full mt-2 ml-2 shadow shadow-gray-500 bg-rose-600"></button>
            </div>
            <h5 className="font-bold mt-6">Quantidade</h5>
            <div className="flex flex-row mt-2 ml-2 w-[90px] h-[30px] justify-around rounded-[12px] border-solid border-2 border-black">
              <button className="font-bold">-</button>
              <button className="font-bold">1</button>
              <button className="font-bold">+</button>
            </div>
            <div className="flex flex-col my-6">
              <span className="uppercase text-sm font-bold"> Observações do Pedido</span>
              <textarea className="w-full h-20 bg-salmon border-[1px] rounded-lg pb-12 pl-1 text-sm font-medium" />
            </div>
            <div className="my-6">
              <button className="uppercase w-full justify-center items-center mb-0 mt font-semibold text-white text-[14px] rounded-md h-[32px] bg-wine-black">Adicionar ao Carrinho</button>
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
