import { FiEdit2 } from "react-icons/fi"
import { HeaderDashboard } from "../../../components/headerDashboard"
import Title from "../../../components/titleDahsboard"
import { FaEdit } from "react-icons/fa"
import { Link } from "react-router-dom"
import { FaTrashCan } from "react-icons/fa6"
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore"
import { db, storage } from "../../../services/firebaseConnection"
import { useEffect, useState } from "react"
import { deleteObject, ref } from "firebase/storage"

export interface BannerProps {
    name: string;
    owner: string;
    status: string;
    id: string;
    images: ImageBannerProps[]
}

interface ImageBannerProps {
    name: string;
    url: string;
    uid: string;

}

export function Banners() {
    const [banners, setBanners] = useState<BannerProps[]>([])

    useEffect(() => {
        loadBanner()
        return () => { }
    }, [])

    async function loadBanner(){
        const bannerRef = collection(db, 'Banners')
        const q = query(bannerRef, orderBy('created', 'desc'));

        await getDocs(q)
        .then((snapshot) => {
            const listBanner = [] as BannerProps[]

            snapshot.forEach(doc => {
                listBanner.push({
                    id: doc.id,
                    name: doc.data().name,
                    owner: doc.data().owner,
                    status: doc.data().status,
                    images: doc.data().images
                })
            })
             setBanners(listBanner)
        })
    }

    async function handleDeleteBanner(item: BannerProps){
        const bannerItem = item;

        const docRef = doc(db, "Banners", bannerItem.id)
        await deleteDoc(docRef)
        
        bannerItem.images.map(async(image) => {
            const imagePath = `images/${image.uid}/${image.name}`
            const imageRef = ref(storage, imagePath)

            try{
                await deleteObject(imageRef)
                setBanners(banners.filter(banners => banners.id !== bannerItem.id))
            } catch(error) {
                console.log("ERRO AO DELETAR BANNER", error)
            }
        })

    }

    return (
        <div>
            <HeaderDashboard />
            <div className="ml-[300px] pt-0.5 px-4 max-md:ml-0">
                <Title name="Banners">
                    <FaEdit size={25} color="fff" />
                </Title>

                <button className="flex justify-center mb-4 items-center w-[200px] h-10 float-right bg-wine-black rounded-full hover:scale-105 duration-300 sm:w-48 lg:w-56">
                    <Link to="/dashboard/banners/cadastrar-banner">
                        <span className="text-white text-xs font-semibold">CADASTRAR BANNER</span>
                    </Link>
                </button>

                    <table className="w-full text-center border-solid border m-0 p-0 table-fixed border-collapse max-sm:border-0">
                        <thead className="max-sm:border-none max-sm:m-[-1px] max-sm:h-[1px] max-sm:overflow-hidden max-sm:p-0 max-sm:w-[1px]">
                            <tr className="bg-slate-100 border border-solid border-zinc-500 text-[0.85em] uppercase max-md:text-[0.7rem] max-sm:text-[0.5rem]">
                                <th scope="col">ID</th>
                                <th scope="col">Nome banner</th>
                                <th scope="col">Status</th>
                                <th scope="col">Ações</th>
                            </tr>
                        </thead>
                       {banners.map((item, index) => (
                         <tbody key={index}>
                         <tr className="bg-white border border-solid text-[14px] border-zinc-300 max-sm:text-[12px] max-sm:p-1">
                             <td className="border-0 rounded-[4px] py-2" data-label="id">{index.toFixed()}</td>
                             <td className="border-0 rounded-[4px] py-2" data-label="nome">{item.name}</td>
                             <td className="border-0 p-[3px]" data-label="status">
                                {item.status === "Ativo" ? (
                                     <span className=" p-2 text-[12px] text-white rounded-full bg-green-500 max-sm:text-[10px]">{item.status}</span>
                                ): (
                                    <span className=" p-2 text-[12px] text-white rounded-full bg-red-500 max-sm:text-[10px]">{item.status}</span>
                                )}
                             </td>
                             <td className="border-0 rounded-[4px] py-2" data-label="ações">
                                 <button>
                                     <div className="flex gap-3">
                                         <Link to={`/dashboard/banners/cadastrar-banner?id=${item.id}`}>
                                             <FiEdit2 size={17} color="#000" />
                                         </Link>
                                         <button onClick={() => handleDeleteBanner(item)}>
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






