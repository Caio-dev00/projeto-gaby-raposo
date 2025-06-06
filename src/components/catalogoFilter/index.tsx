import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { productProps } from "../../pages/dashboard/new";
import { Container } from "../container";


function CatalogoFilter() {
  const { categoria, tamanho } = useParams();

  const [produtos, setProdutos] = useState<productProps[]>([]);

  useEffect(() => {
    async function fetchProdutos() {
      const produtosRef = collection(db, "Produtos");

      const q = query(produtosRef, where("categoria", "==", categoria), where("size", "array-contains", tamanho));

      const querySnapshot = await getDocs(q);
      const produtosData: productProps[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        produtosData.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          categoria: data.categoria,
          image: data.images,
          owner: data.owner,
          price: data.price,
          status: data.status,
          variations: data.variations,
          size: data.size,
        });
      });

      console.log("Produtos encontrados:", produtosData);
      setProdutos(produtosData);
    }

    fetchProdutos();
  }, [categoria, tamanho]);

  return (
    <>
      <Container>
        <div>
         
          <>
            <div className="flex-col justify-center items-center mt-10 w-full rounded-md p-2 bg-wine-light">
              <h1 className="text-center text-xl pr-2 text-white">Categoria:
                <span className="uppercase font-bold text-center text-white"> {categoria}</span>
              </h1>
              <h1 className="text-center text-xl pr-2 text-white">Tamanho:
                <span className="uppercase font-bold text-center text-white"> {tamanho}</span>
              </h1>
            </div>
            {produtos.length === 0 && (
            <div>Nenhum produto encontrado</div>
          )}
            <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {produtos.map((item, index) => {
                console.log("Dados da imagem:", item.image);
                return (
                  <div className="flex flex-col mt-5 w-[305px] max-md:w-[250px] cursor-pointer">
                    <div>
                      <Link key={index} to={`/product/details?id=${item.id}`}>
                        <img
                          className=' max-h-[300px] w-[305px] max-md:w-full max-md:h-[250px] rounded-ss-lg rounded-se-lg'
                          src={item.image[0].url} // Usando o operador opcional de encadeamento
                          alt="Product photo"
                        />
                      </Link>
                    </div>
                    <span className='text-gray-500 pl-4 pt-2 font-semibold max-md:text-[0.80rem] max-md:pb-1'>{item.name}</span>
                    <span className='text-wine-black pl-4 mt-[-7px] font-medium text-[1.5rem] max-md:text-[1rem]'>R${item.price}</span>
                    <div className='flex justify-center bg-wine-light w-full max-md:w-full rounded-ee-lg rounded-es-lg h-10 mb-10 hover:bg-wine-black'>
                      <button className='text-white font-bold hover:scale-105 duration-300 max-md:text-[0.70rem]'>Ver Produto</button>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          </>
        </div>
      </Container>
    </>
  );
}

export default CatalogoFilter;
