import { useEffect, useState, useContext } from "react"
import { db, storage } from "../../../services/firebaseConnection"
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"

import { HeaderDashboard } from "../../../components/headerDashboard"
import Title from "../../../components/titleDahsboard"
import { Link } from "react-router-dom"

import { FaUser } from "react-icons/fa"
import { FaTrashCan } from "react-icons/fa6";
import { AuthContext } from "../../../contexts/AuthContext"



import '../dashboard.css'
import { FiEdit2 } from "react-icons/fi"

export interface categoryProp {
    name: string,
    owner: string,
    id: string,
    images: categoryImageProps[],
}

interface categoryImageProps {
    uid: string,
    name: string,
    url: string,
}

export function Categorias() {
    const { user } = useContext(AuthContext)
    const [category, setCategory] = useState<categoryProp[]>([]);

    useEffect(() => {
        loadCategories();
        return () => { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    async function loadCategories() {
        const categoriesRef = collection(db, 'categorias')
        const q = query(categoriesRef, orderBy('created', 'desc'));

        await getDocs(q)
            .then((snapshot) => {
                const listCategories = [] as categoryProp[]

                snapshot.forEach(doc => {
                    listCategories.push({
                        id: doc.id,
                        name: doc.data().name,
                        owner: doc.data().owner,
                        images: doc.data().images
                    })
                })
                setCategory(listCategories)
            })
    }

    async function handleDeleteCategory(item: categoryProp) {
        const itemCategory = item;

        const docRef = doc(db, "categorias", itemCategory.id)
        await deleteDoc(docRef)

        itemCategory.images.map(async (image) => {
            const imagePath = `images/${image.uid}/${image.name}`
            const imageRef = ref(storage, imagePath)

            try {
                await deleteObject(imageRef)
                setCategory(category.filter(category => category.id !== itemCategory.id))
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
                <Title name="Categorias">
                    <FaUser size={25} color="#FFF" />
                </Title>

                <button className="mb-4 flex justify-center items-center w-[250px] h-[40px] float-right ml-2 bg-wine-black rounded-full hover:scale-105 duration-300 max-sm:w-[180px]">
                    <Link to="/dashboard/categorias/cadastrar-categoria">
                        <span className="text-white text-xs p-1 font-semibold max-sm:text-[12px]">CADASTRAR CATEGORIA</span>
                    </Link>
                </button>
                <>
                    {category.length === 0 ? (
                        <div className="flex justify-center">
                            <span>Nehuma categoria encontrada...</span>
                        </div>
                    ) : (
                        <table className="w-full text-center border-solid border m-0 p-0 table-fixed border-collapse max-sm:border-0">
                            <thead className="max-sm:border-none max-sm:m-[-1px] max-sm:h-[1px] max-sm:overflow-hidden max-sm:p-0 max-sm:w-[1px]">
                                <tr className="bg-slate-100 border border-solid border-zinc-500 text-[0.85em] uppercase max-md:text-[0.7rem] max-sm:text-[0.5rem]">
                                    <th scope="col">Código</th>
                                    <th scope="col">Categoria</th>
                                    <th scope="col">Ações</th>
                                </tr>
                            </thead>

                            {category.map((item, index) => (
                                <tbody key={index}>
                                    <tr className="bg-white border border-solid text-[14px] border-zinc-300 max-sm:text-[12px] max-sm:p-1">
                                        <td className="border-0 rounded-[4px] py-2" data-label="código">{index.toFixed()}</td>
                                        <td className="border-0 rounded-[4px] py-2" data-label="categoria">{item.name}</td>

                                        <td className="border-0 rounded-[4px] py-2" data-label="ações">
                                            <button>
                                                <div className="flex gap-3">
                                                    <Link to={`/dashboard/categorias/cadastrar-categoria?id=${item.id}`}>
                                                        <FiEdit2 size={17} color="#000" />
                                                    </Link>
                                                    <button onClick={() => handleDeleteCategory(item)}>
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
