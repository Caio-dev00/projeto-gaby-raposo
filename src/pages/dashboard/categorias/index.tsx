import { useEffect, useState } from "react"
import { db } from "../../../services/firebaseConnection"
import { collection, doc, getDocs, limit, orderBy, query, where } from "firebase/firestore"

import { HeaderDashboard } from "../../../components/headerDashboard"
import Title from "../../../components/titleDahsboard"
import { Link } from "react-router-dom"

import { FaUser } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { FaTrashCan } from "react-icons/fa6";

import '../dashboard.css'

interface categoryProp {
    name: string
    owner: string,
    id: string
}

export function Categorias() {
    const [category, setCategory] = useState<categoryProp[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        loadCategories();
        handleSearch();
        return () => {}
    }, [input])

    async function loadCategories() {
        const categoriesRef = collection(db, 'categorias')
        const q = query(categoriesRef, orderBy('created', 'desc'), limit(5));

        await getDocs(q)
       .then((snapshot) => {
           const listCategories = [] as categoryProp[]
           
           snapshot.forEach(doc => {
               listCategories.push({
                   id: doc.id,
                   name: doc.data().name,
                   owner: doc.data().owner
                })
            })
            setLoading(false)
            setCategory(listCategories)
        })
    }

    async function handleSearch(){
        if(input === ""){
            loadCategories();
            return;
        }

        setCategory([]);

        const q = query(collection(db, "categorias"),
        where("name", ">=", input.toUpperCase()),
        where("name", "<=", input.toUpperCase() + "\uf8ff")
        )

        const querySnapShot = await getDocs(q)

        const listCategory= [] as categoryProp[];

        querySnapShot.forEach((doc) => {
            listCategory.push({
                id: doc.id,
                name: doc.data().name,
                owner: doc.data().owner
            })
        })
        setCategory(listCategory)
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
                        <span className="text-white text-[0.8rem] p-1 font-semibold max-sm:text-[12px]">CADASTRAR CATEGORIA</span>
                    </Link>
                </button>
                <div className="flex justify-center items-center mb-5 mr-4 w-full max-sm:text-[0.9rem]">
                    <input
                        placeholder="Buscar Categorias"
                        className="w-full p-3 rounded-full border-2 max-sm:p-1"
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        />
                     
                </div>
                <table className="w-full text-center border-solid border m-0 p-0 table-fixed border-collapse max-sm:border-0">
                    <thead className="max-sm:border-none max-sm:m-[-1px] max-sm:h-[1px] max-sm:overflow-hidden max-sm:p-0 max-sm:w-[1px]">
                        <tr className="bg-slate-100 border border-solid border-zinc-500 text-[0.85em] uppercase max-md:text-[0.7rem] max-sm:text-[0.5rem]">
                            <th scope="col">Código</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>

                    {category.map(item => (
                        <tbody key={item.id}>
                            <tr className="bg-white border border-solid text-[14px] border-zinc-300 max-sm:text-[12px] max-sm:p-1">
                                <td className="border-0 rounded-[4px] py-2" data-label="código">{item.id}</td>
                                <td className="border-0 rounded-[4px] py-2" data-label="categoria">{item.name}</td>

                                <td className="border-0 rounded-[4px] py-2" data-label="ações">
                                    <button>
                                        <div className="flex gap-3">
                                            <Link to={`/dashboard/new:id`}>
                                                <FiEdit2 size={17} color="#000" />
                                            </Link>
                                            <button>
                                                <FaTrashCan size={17} color="#000" />
                                            </button>
                                        </div>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>
        </div>
    )
}
