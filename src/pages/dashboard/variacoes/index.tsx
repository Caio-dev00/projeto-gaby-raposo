import { HeaderDashboard } from "../../../components/headerDashboard";
import Title from "../../../components/titleDahsboard";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { collection, deleteDoc, doc,  getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, storage } from "../../../services/firebaseConnection";
import { FaTrashCan } from "react-icons/fa6";
import { FiEdit2 } from "react-icons/fi";
import { deleteObject, ref } from "firebase/storage";

interface tamanhoProps {
    id: string,
    name: string,
    owner: string,
    images: imageProps[]
}

interface coresProps {
    id: string,
    name: string,
    owner: string,
    images: imageProps[]
}

interface imageProps {
    uid: string,
    name: string,
    url: string,
}

export function Variacoes() {

    const { user } = useContext(AuthContext)
    const [tamanho, setTamanho] = useState<tamanhoProps[]>([])
    const [cores, setCores] = useState<coresProps[]>([])

    useEffect(() => {
        loadTamanhos()
        loadCores()
    }, [user])

    async function loadTamanhos() {
        const tamanhosRef = collection(db, "Tamanhos")
        const q = query(tamanhosRef, orderBy("created", "desc"))

        await getDocs(q)
            onSnapshot(q, (snapshot) => {
                const lista = [] as tamanhoProps[]
                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        name: doc.data().tamanho,
                        owner: doc.data().owner,
                        images: doc.data().images
                    })
                    setTamanho(lista)
                })
            })
    }

    async function loadCores() {
        const coresRef = collection(db, "Cores")
        const q = query(coresRef, orderBy("created", "desc"))

        await getDocs(q)
            onSnapshot(q, (snapshot) => {
                const lista = [] as coresProps[]
                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        name: doc.data().cor,
                        owner: doc.data().owner,
                        images: doc.data().images
                    })
                    setCores(lista)
                })
            })
    }

    async function handleDeleteCor(item: coresProps){
        const corItem = item;

        const docRef = doc(db, "Cores", corItem.id)
        await deleteDoc(docRef)

        corItem.images.map( async (image) => {
        const imagePath = `images/${image.uid}/${image.name}`
        const imageRef = ref(storage, imagePath)

        try{
            await deleteObject(imageRef)
            setCores(cores.filter(cores => cores.id !== corItem.id))
        }catch(error){
            console.error("ERRO AO DELETAR IMAGEM", error)
        }
        })
    }

    async function handleDeleteTamanho(item: tamanhoProps){
        const tamanhoItem = item;

        const docRef = doc(db, "Tamanhos", tamanhoItem.id)
        await deleteDoc(docRef)

        tamanhoItem.images.map( async (image) => {
        const imagePath = `images/${image.uid}/${image.name}`
        const imageRef = ref(storage, imagePath)

        try{
            await deleteObject(imageRef)
            setTamanho(tamanho.filter(tamanho => tamanho.id !== tamanhoItem.id))
        }catch(error){
            console.error("ERRO AO DELETAR IMAGEM", error)
        }
        })
    }

    return (
        <div>
            <HeaderDashboard />

            <div className="ml-[300px] pt-0.5 px-4 max-md:ml-0">
                <Title name="Variações">
                    <FaEdit size={25} color="#FFF" />
                </Title>

                <div className="flex justify-around py-1 px-0">
                    <button className="flex justify-center items-center w-36 h-10 float-right bg-wine-black rounded-full hover:scale-105 duration-300 sm:w-48 lg:w-56">
                        <Link to="/dashboard/variacoes/variacoes-tamanho">
                            <span className="text-white text-[11px] font-semibold">CADASTRAR TAMANHO</span>
                        </Link>
                    </button>

                    <button className="flex justify-center items-center w-36 h-10 float-right bg-wine-black rounded-full hover:scale-105 duration-300 sm:w-48 lg:w-56">
                        <Link to="/dashboard/variacoes/variacoes-cor">
                            <span className="text-white text-[11px] font-semibold">CADASTRAR COR</span>
                        </Link>
                    </button>
                </div>

                <div className="mt-10 flex flex-col justify-center items-center">
                    <span className="text-wblack text-lg font-bold my-5">TABELA DE TAMANHOS</span>         
                   {tamanho.length === 0 ? (
                    <h1 className="mt-10">Nenhum tamanho encontrada</h1>
                   ):(
                    <table className="w-full text-center border-solid border my-2 p-0 table-fixed border-collapse max-sm:border-0">
                        <thead className="max-sm:border-none max-sm:m-[-1px] max-sm:h-[1px] max-sm:overflow-hidden max-sm:p-0 max-sm:w-[1px]">
                            <tr className="bg-slate-100 border border-solid border-zinc-500 text-[0.85em] uppercase max-md:text-[0.7rem] max-sm:text-[0.5rem]">
                                <th scope="col">Nome Variação</th>
                                <th scope="col">Tipo de Variação</th>
                                <th scope="col">Ações</th>
                            </tr>
                        </thead>
                        {tamanho.map(item => (
                            <tbody key={item.id}>
                                <tr className="bg-white border border-solid text-[14px] border-zinc-300 max-sm:text-[12px] max-sm:p-1">
                                    <td className="border-0 rounded-[4px] py-2" data-label="nome">{item.name}</td>
                                    <td className="border-0 rounded-[4px] py-2" data-label="tipo da variacao">Tamanho</td>

                                    <td className="border-0 rounded-[4px] py-2" data-label="ações">
                                        <button>
                                            <div className="flex gap-3">
                                                <Link to={`/dashboard/new:id`}>
                                                    <FiEdit2 size={17} color="#000" />
                                                </Link>
                                                <button onClick={() => handleDeleteTamanho(item)}>
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
                </div>

                <div className="mt-10 flex flex-col justify-center items-center">
                <span className="text-wblack text-lg font-bold my-5">TABELA DE CORES</span> 
                   {cores.length === 0 ? (
                        <h1 className="mt-10">Nenhuma cor encontrada...</h1>
                   ):(       
                    <table className="w-full text-center border-solid border my-2 p-0 table-fixed border-collapse max-sm:border-0">
                        <thead className="max-sm:border-none max-sm:m-[-1px] max-sm:h-[1px] max-sm:overflow-hidden max-sm:p-0 max-sm:w-[1px]">
                            <tr className="bg-slate-100 border border-solid border-zinc-500 text-[0.85em] uppercase max-md:text-[0.7rem] max-sm:text-[0.5rem]">
                                <th scope="col">Nome Variação</th>
                                <th scope="col">Tipo de Variação</th>
                                <th scope="col">Ações</th>
                            </tr>
                        </thead>
                        {cores.map(item => (
                            <tbody key={item.id}>
                                <tr className="bg-white border border-solid text-[14px] border-zinc-300 max-sm:text-[12px] max-sm:p-1">
                                    <td className="border-0 rounded-[4px] py-2" data-label="nome">{item.name}</td>
                                    <td className="border-0 rounded-[4px] py-2" data-label="tipo da variacao">Cor</td>
                                    <td className="border-0 rounded-[4px] py-2" data-label="ações">
                                        <button>
                                            <div className="flex gap-3">
                                                <Link to={`/dashboard/new:id`}>
                                                    <FiEdit2 size={17} color="#000" />
                                                </Link>
                                                <button onClick={() => handleDeleteCor(item)}>
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
                </div>

            </div>
        </div>

    )
}