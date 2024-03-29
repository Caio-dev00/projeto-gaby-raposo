import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"
import { FaUser } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"

import Title from "../../components/titleDahsboard"
import { HeaderDashboard } from "../../components/headerDashboard"
import './dashboard.css'
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore"
import { db, storage } from "../../services/firebaseConnection"
import { FaTrashCan } from "react-icons/fa6"
import { deleteObject, ref } from "firebase/storage"

interface productProps {
    id: string;
    name: string;
    price: string;
    storage: string;
    description: string;
    images: ImageItemProps[];
    category: string;
    size: string;
    color: string;
    status: string;
}

interface ImageItemProps {
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
}

export function Dashboard() {
    const { user } = useContext(AuthContext)
    const [product, setProduct] = useState<productProps[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        loadProducts()
        handleSearch()
        return () => { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, user])

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
                        color: doc.data().color,
                        price: doc.data().price,
                        size: doc.data().size,
                        storage: doc.data().storage,
                        status: doc.data().status,
                        description: doc.data().description,
                        images: doc.data().images
                    })
                })
                setProduct(listProducts)
            })
    }

    async function handleSearch() {
        if (input === "") {
            loadProducts();
            return;
        }

        setProduct([]);


        const q = query(collection(db, "Produtos"),
            where("name", ">=", input.toUpperCase()),
            where("name", "<=", input.toUpperCase() + "\uf8ff"),
            where("uid", "==", user?.uid)
        )
        getDocs(q)
            .then((snapshot) => {
                const listProduct = [] as productProps[];

                snapshot.forEach(doc => {
                    listProduct.push({
                        id: doc.id,
                        name: doc.data().name,
                        category: doc.data().categoria,
                        color: doc.data().color,
                        price: doc.data().price,
                        size: doc.data().size,
                        storage: doc.data().storage,
                        status: doc.data().status,
                        description: doc.data().description,
                        images: doc.data().images
                    })
                })
                setProduct(listProduct)
            })

    }

    async function handleDeleteProduct(item: productProps) {
        const itemProduct = item;

        const docRef = doc(db, "Produtos", itemProduct.id)
        await deleteDoc(docRef)

        itemProduct.images.map(async (image) => {
            const imagePath = `images/${image.uid}/${image.name}`
            const imageRef = ref(storage, imagePath)

            try {
                await deleteObject(imageRef)
                setProduct(product.filter(product => product.id !== itemProduct.id))
            } catch (error) {
                console.log("ERROR AO DELETAR IMAGEM")
                console.log(error)
            }
        })
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
                    {product.length === 0 ? (
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
                            {product.map((item, index) => (
                                <tbody key={index}>
                                    <tr className="bg-white border border-solid text-[14px] border-zinc-300 max-sm:text-[12px] max-sm:p-1">
                                        <td className="border-0 rounded-[4px] py-2" data-label="código">{index.toFixed()}</td>
                                        <td className="border-0 rounded-[4px] py-2" data-label="produto">{item.name}</td>
                                        <td className="border-0 rounded-[4px] py-2" data-label="categoria">{item.category}</td>
                                        <td className="border-0 rounded-[4px] py-2" data-label="tamanho">{item.size}</td>
                                        <td className="border-0 rounded-[4px] py-2" data-label="cor">{item.color}</td>
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
