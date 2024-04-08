import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"
import { FaUser } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"

import Title from "../../components/titleDahsboard"
import { HeaderDashboard } from "../../components/headerDashboard"
import './dashboard.css'
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore"
import { db, storage } from "../../services/firebaseConnection"
import { FaTrashCan } from "react-icons/fa6"
import { deleteObject, ref } from "firebase/storage"
import { productProps } from "./new"



export function Dashboard() {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState<productProps[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        loadProducts();
    }, [user]);

    async function loadProducts() {
        const productRef = collection(db, 'Produtos');
        const q = query(productRef, orderBy("created", "desc"));

        const snapshot = await getDocs(q);
        const productList: productProps[] = [];

        snapshot.forEach(doc => {
            const productData = doc.data();
            productList.push({
                id: doc.id,
                name: productData.name,
                categoria: productData.categoria,
                colors: productData.colors, // Suponha que isso seja um array de cores
                sizes: productData.sizes, // Suponha que isso seja um array de tamanhos
                price: productData.price,
                storage: productData.storage,
                status: productData.status,
                description: productData.description,
                owner: productData.owner,
                colorImage: productData.colorImage,
                image: productData.image
            });
        });

        setProducts(productList);
    }

    async function handleDeleteProduct(item: productProps) {
        const itemProduct = item;
    
        const docRef = doc(db, "Produtos", itemProduct.id);
    
        try {
            // Exclua o documento do banco de dados
            await deleteDoc(docRef);
    
            // Remova o produto do estado local imediatamente após a exclusão do documento
            setProducts(prevProducts => prevProducts.filter(product => product.id !== itemProduct.id));
    
            // Remova as imagens do armazenamento
            await Promise.all(itemProduct.image.map(async (image) => {
                const imagePath = `images/${image.uid}/${image.name}`;
                const imageRef = ref(storage, imagePath);
                await deleteObject(imageRef);
            }));
        } catch (error) {
            console.log("Erro ao excluir produto:", error);
        }
    }

    return (
        <div>
            <HeaderDashboard />
            <div className="ml-[300px] pt-[1px] px-[16px] max-md:ml-0">
                <Title name="Lista de Produtos">
                    <FaUser size={25} color="#FFF" />
                </Title>

                <button className="mb-4 flex justify-center items-center w-[250px] h-[40px] float-right ml-2 bg-wine-black rounded-full hover:scale-105 duration-300 max-sm:w-[180px]">
                    <Link to="/dashboard/new">
                        <span className="text-white text-[0.8rem] p-1 font-semibold max-sm:text-[12px]">CADASTRAR PRODUTO</span>
                    </Link>
                </button>
                <div className="flex justify-center items-center mb-5 mr-4 w-full max-sm:text-[0.9rem]">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Buscar Produtos"
                        className="w-full p-3 rounded-full border-2 max-sm:p-1"
                        type="text" />
                </div>
                <>
                    {products.length === 0 ? (
                        <div>
                            <span>Nenhum produto encontrado</span>
                        </div>
                    ) : (
                        <table className="w-full text-center border-solid border m-0 p-0 table-fixed border-collapse max-sm:border-0">
                            <thead className="max-sm:border-none max-sm:m-[-1px] max-sm:h-[1px] max-sm:overflow-hidden max-sm:p-0 max-sm:w-[1px]">
                                <tr className="bg-slate-100 border border-solid border-zinc-500 text-[0.85em] uppercase max-md:text-[0.7rem] max-sm:text-[0.5rem]">
                                    <th scope="col">Código</th>
                                    <th scope="col">Produto</th>
                                    <th scope="col">Categoria</th>
                                    <th scope="col">Tamanho</th>
                                    <th scope="col">Cor</th>
                                    <th scope="col">Preço</th>
                                    <th scope="col">Estoque</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Ações</th>
                                </tr>
                            </thead>
                            {products.map((item, index) => (
                                <tbody key={index}>
                                    <tr className="bg-white border border-solid text-[14px] border-zinc-300 max-sm:text-[12px] max-sm:p-1">
                                        <td className="border-0 rounded-[4px] py-2" data-label="código">{index.toFixed()}</td>
                                        <td className="border-0 rounded-[4px] py-2" data-label="produto">{item.name}</td>
                                        <td className="border-0 rounded-[4px] py-2" data-label="categoria">{item.categoria.name}</td>
                                        <td className="border-0 rounded-[4px] py-2" data-label="tamanho">
                                            <select
                                                className='w-full max-w-12 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2'
                                                value={''}
                                            >
                                                {item.sizes.map((size, index) => (
                                                    <option key={index}>{size.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="border-0 rounded-[4px] py-2" data-label="cor">
                                            <select
                                                className='w-full max-w-40 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2'
                                                value={''}
                                            >
                                                {item.colors.map((color, index) => (
                                                    <option key={index}>{color.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="border-0 rounded-[4px] py-2" data-label="preco">R$ {item.price}</td>
                                        <td className="border-0 rounded-[4px] py-2" data-label="estoque">{item.storage}</td>
                                        <td className="border-0 p-[3px]" data-label="status">
                                            {item.status === "Ativo" ? (
                                                <span className=" p-2 text-[12px] text-white rounded-full bg-green-500 max-sm:text-[10px]">{item.status}</span>
                                            ) : (
                                                <span className=" p-2 text-[12px] text-white rounded-full bg-red-500 max-sm:text-[10px]">{item.status}</span>
                                            )}
                                        </td>
                                        <td className="border-0 rounded-[4px] py-2" data-label="ações">
                                            <button>
                                                <div className="flex gap-3">
                                                    <Link to={`/dashboard/new/new?id=${item.id}`}>
                                                        <FiEdit2 size={17} color="#000" />
                                                    </Link>
                                                    <button onClick={() => handleDeleteProduct(item)}>
                                                        <FaTrashCan size={17} color="#000" />
                                                    </button>
                                                </div>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    )}
                </>
            </div>
        </div>
    )
}
