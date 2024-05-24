import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';

import { productProps } from '../../pages/dashboard/new';
import { Link } from 'react-router-dom';
import Pagination from '../pagination';

export default function Catalogo() {

    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState<productProps[]>([]);
    const [totalPages, setTotalPages] = useState(0); // Estado para armazenar o número total de páginas
    const productsPerPage = 16;

    useEffect(() => {
        fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    async function fetchProducts() {
        const productRef = collection(db, "Produtos");
        const q = query(productRef, orderBy("created", "desc"));

        try {
            const snapshot = await getDocs(q);
            const allProducts: productProps[] = [];

            snapshot.forEach(doc => {
                const productData = doc.data();
                // Verifica se o status do produto é "Ativo"
                if (productData.status === "Ativo") {
                    allProducts.push({
                        id: doc.id,
                        name: productData.name,
                        categoria: productData.categoria,
                        description: productData.description,
                        owner: productData.owner,
                        price: productData.price,
                        status: productData.status,
                        image: productData.images,
                        size: productData.size,
                        variations: productData.variations,
                    });
                }
            });

            const startIndex = (currentPage - 1) * productsPerPage;
            const endIndex = startIndex + productsPerPage;
            const pageProducts = allProducts.slice(startIndex, endIndex);

            setProducts(pageProducts);

            const totalCount = allProducts.length;
            const pageCount = Math.ceil(totalCount / productsPerPage);
            setTotalPages(pageCount);
         
        } catch (error) {
            console.error("Error fetching products: ", error);
        
        }
    }
    
    function handlePageChange(selectedPage: { selected: number }) {
        setCurrentPage(selectedPage.selected + 1);
    }
    

    

    return (
        <div className='flex flex-col'>
            <div className='flex justify-center'>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.length === 0 && (
                <div>Nenhum produto encontrado</div>
            )}
            {products.map((item) => (
                <div key={item.id} className="flex flex-col mt-5 w-full max-w-[305px] max-md:w-[170px] cursor-pointer">
                    <div>
                      <Link to={`/product/details?id=${item.id}`}>
                        <img className='h-[300px] max-h-[300px] w-[305px] max-md:h-[170px] rounded-ss-lg rounded-se-lg' src={item.image[0].url} alt="Product photo" />
                      </Link>
                    </div>
                    <span className='text-gray-500 pl-4 pt-2 font-semibold max-md:text-[0.80rem] max-md:pb-1'>{item.name}</span>
                        <span className='text-wine-light pl-4 mt-[-7px] font-medium text-[1.5rem] max-md:text-[1rem]'>R${item.price}</span>
                    <div className='flex justify-center bg-wine-light w-full max-md:w-[170px] rounded-ee-lg rounded-es-lg h-10 mb-10 hover:bg-wine-black'>
                        <Link to={`/product/details?id=${item.id}`} className='text-white font-bold hover:scale-105 duration-300 max-md:text-[0.70rem] flex items-center'>
                            VER PRODUTO
                        </Link>
                    </div>
                </div>
            ))}
        </div>
        </div>
        <Pagination pageCount={totalPages} onPageChange={handlePageChange} />
        </div>
    )
}
