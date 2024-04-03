import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';

import { productProps } from '../../pages/dashboard/new';
import { Link } from 'react-router-dom';

export default function Catalogo() {

    const [product, setProduct] = useState<productProps[]>([])

    useEffect(() => {
        loadProducts()
    }, [])

    async function loadProducts() {
        const productRef = collection(db, "Produtos")
        const q = query(productRef, orderBy("created", "desc"))

        await getDocs(q)
            .then((snapshot) => {
                const listProduct = [] as productProps[]

                snapshot.forEach(doc => {
                    listProduct.push({
                        id: doc.id,
                        name: doc.data().name,
                        categoria: doc.data().categoria,
                        color: doc.data().color,
                        storage: doc.data().storage,
                        description: doc.data().description,
                        owner: doc.data().owner,
                        price: doc.data().price,
                        size: doc.data().size,
                        status: doc.data().status,
                        image: doc.data().images
                    })
                })
                setProduct(listProduct)
            })
    }

    return (
        <>
            {product.length === 0 && (
                <div>Nenhum produto encontrado</div>
            )}
            {product.map((item, index) => (
                <div key={index} className="flex flex-col mt-5 w-[305px] max-md:w-[170px] cursor-pointer">
                    <div>
                      <Link to={`/product/${item.id}`}>
                        <img className=' max-h-[300px] w-[305px] max-md:h-[170px] rounded-ss-lg rounded-se-lg' src={item.image[0].url} alt="Product photo" />
                      </Link>
                    </div>
                    <span className='text-gray-500 pl-4 pt-2 font-semibold max-md:text-[0.80rem] max-md:pb-1'>{item.name}</span>
                        <span className='text-green-400 pl-4 mt-[-7px] font-medium text-[1.5rem] max-md:text-[1rem]'>R$R${item.price}</span>
                    <div className='flex justify-center bg-wine-light w-full max-md:w-[170px] rounded-ee-lg rounded-es-lg h-10 mb-10 hover:bg-wine-black'>
                        <button className='text-white font-bold hover:scale-105 duration-300 max-md:text-[0.70rem]'>ADICIONAR AO CARRINHO</button>
                    </div>
                </div>
            ))}
        </>
    )
}
