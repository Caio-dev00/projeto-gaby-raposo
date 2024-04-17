import { ChangeEvent, useContext, useEffect, useState } from "react";
import { FaListAlt } from "react-icons/fa";

import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidV4 } from 'uuid'

import Title from "../../../../components/titleDahsboard";
import { HeaderDashboard } from "../../../../components/headerDashboard";
import { FiTrash, FiUpload } from "react-icons/fi";
import { AuthContext } from "../../../../contexts/AuthContext";
import { db, storage } from "../../../../services/firebaseConnection";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Input from "../../../../components/input";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { Link, useLocation, useNavigate } from "react-router-dom";


interface BannerProps {
    name: string;
    owner: string;
    status: string;
    id: string;
}

interface ImageItemProps {
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
}

const schema = z.object({
    name: z.string().min(1, "O nome do banner é obrigatorio!"),
})

type FormData = z.infer<typeof schema>

export function CadastrarBanner() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    const location = useLocation()
    const bannerId = new URLSearchParams(location.search).get("id")
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const [status, setStatus] = useState("Ativo")
    const [productImage, setProductImage] = useState<ImageItemProps[]>([])

    const [name, setName] = useState("")
    const [banners, setBanner] = useState<BannerProps>()


    useEffect(() => {
        async function fetchBanner() {
            if (!bannerId) return;
            try {
                const bannerDoc = await getDoc(doc(db, "Banners", bannerId))
                if (bannerDoc.exists()) {
                    const bannerData = bannerDoc.data();
                    if (bannerData) {
                        const bannerCompleta: BannerProps = {
                            id: bannerDoc.id,
                            name: bannerData.name,
                            status: bannerData.status,
                            owner: bannerData.owner,
                        };
                        setBanner(bannerCompleta)
                        setName(bannerCompleta.name)
                        setStatus(bannerCompleta.status)
                    }
                } else {
                    console.log("Banner não encontrado")
                    navigate("/dashboard/banners")
                }
            } catch (error) {
                console.log("Erro ao buscar banners", error)
                navigate("/dashboard/banners")
            }
        }
        fetchBanner()
    }, [bannerId, navigate])

    function onSubmit(data: FormData) {
        addDoc(collection(db, "Banners"), {
            name: data.name.toLowerCase(),
            created: new Date(),
            owner: user?.name,
            uid: user?.uid,
            images: productImage,
            status: status
        })
            .then(() => {
                reset();
                setProductImage([])
                navigate("/dashboard/banners")
                console.log("CADASTRADO COM SUCESSO!")
            })
            .catch((error) => {
                console.log("ERRO AO CADASTRAR BANNER", error)
            })
    }

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0]

            if (image.type === "image/jpeg" || image.type === "image/png") {
                await handleUpload(image)
            } else {
                alert("Envie uma imagem jpeg ou png")
                return;
            }
        }
    }

    async function handleUpload(image: File) {
        if (!user?.uid) {
            return;
        }

        const currentUid = user?.uid;
        const uidImage = uuidV4();

        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

        uploadBytes(uploadRef, image)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadUrl) => {
                    const imageItem = {
                        name: uidImage,
                        uid: currentUid,
                        previewUrl: URL.createObjectURL(image),
                        url: downloadUrl
                    }
                    setProductImage((images) => [...images, imageItem])
                })
            })
    }

    async function handleDeleteImage(item: ImageItemProps) {
        const imagePath = `images/${item.uid}/${item.name}`;
        const imageRef = ref(storage, imagePath)

        try {
            await deleteObject(imageRef)
            setProductImage(productImage.filter((image) => image.url !== item.url))
        } catch (error) {
            console.log("ERRO AO DELETAR", error)
        }
    }

    function handleOptionChange(e: ChangeEvent<HTMLInputElement>) {
        setStatus(e.target.value);
    }

    const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    };

    const editSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await updateDoc(doc(db, "Banners", bannerId!), {
                name: name,
                status: status
            });
            alert("Banner atualizada com sucesso!");
            navigate("/dashboard/banners"); // Redireciona de volta para a lista de categorias
        } catch (error) {
            console.error("Erro ao atualizar categoria:", error);
            navigate("/dashboard/banners");
        }
    };

    return (
        <>
            <HeaderDashboard />

            <div className="ml-[300px] pt-[1px] px-[16px] max-md:ml-0">
                <Title name={banners ? `Editar Banner ${banners.name}` : "Cadastrar Banner"}>
                    <FaListAlt size={25} color="#FFF" />
                </Title>

                <div className='bg-white p-10 rounded-md shadow-md'>
                    {bannerId ? (
                        <div></div>
                    ) : (
                        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                            <button
                                className="border-2 w-full rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                                <div className="absolute cursor-pointer">
                                    <FiUpload size={30} color="#000" />
                                </div>
                                <div className="cursor-pointer">
                                    <input
                                        className="opacity-0 cursor-pointer"
                                        onChange={handleFile}
                                        type="file"
                                        accept="image/*" />
                                </div>
                            </button>

                            {productImage.map(item => (
                                <div className='w-full h-32 flex items-center justify-center relative' key={item.name}>
                                    <button className="absolute" onClick={() => handleDeleteImage(item)}>
                                        <FiTrash size={24} color="#FFF" />
                                    </button>
                                    <img
                                        src={item.previewUrl}
                                        className="rounded-lg w-full h-32 object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    {bannerId ? (
                        <>
                            <form onSubmit={editSubmit} className="flex flex-col ">
                                <input
                                    className='block w-full rounded-md border-2 border-gray-400 py-3 px-2 text-gray-600 md:text-sm'
                                    type="text"
                                    placeholder='Editar banner'
                                    value={name}
                                    onChange={handleBannerChange}
                                />
                                <label className='my-2'>Status</label>
                                <div>
                                    <input
                                        type="radio"
                                        name="radio"
                                        value="Ativo"
                                        onChange={handleOptionChange}
                                        checked={status === 'Ativo'}
                                    />
                                    <span className="ml-1 mr-1">Ativo</span>

                                    <input
                                        type="radio"
                                        name="radio"
                                        value="Inativo"
                                        onChange={handleOptionChange}
                                        checked={status === 'Inativo'}
                                    />
                                    <span className="ml-1">Inativo</span>
                                </div>
                                <button type='submit' className="w-full max-w-[250px] mt-10 bg-wine-light border-2 rounded-2xl p-2 border-wine-light text-white font-semibold hover:bg-opacity-90" >Editar Banner</button>
                            </form>
                            <button className='bg-white border-2 border-wine-light w-48 mt-5 p-2 rounded-md hover:scale-[1.02] duration-300'>
                                <Link to="/dashboard/banners" className='text-wine-black font-bold'>Voltar</Link>
                            </button>
                        </>

                    ) : (
                        <>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                                <Input
                                    name="name"
                                    placeholder="Nome do banner"
                                    register={register}
                                    type="text"
                                    error={errors.name?.message}
                                />
                                <label className='my-2'>Status</label>
                                <div>
                                    <input
                                        type="radio"
                                        name="radio"
                                        value="Ativo"
                                        onChange={handleOptionChange}
                                        checked={status === 'Ativo'}
                                    />
                                    <span className="ml-1 mr-1">Ativo</span>

                                    <input
                                        type="radio"
                                        name="radio"
                                        value="Inativo"
                                        onChange={handleOptionChange}
                                        checked={status === 'Inativo'}
                                    />
                                    <span className="ml-1">Inativo</span>
                                </div>
                                <button className='bg-wine-black w-48 mt-5 p-2 rounded-md hover:bg-wine-light hover:scale-[1.02] duration-300'>
                                    <span className='text-white font-bold'>Cadastrar Banner</span>
                                </button>
                            </form>
                            <button className='bg-white border-2 border-wine-light w-48 mt-5 p-2 rounded-md  hover:scale-[1.02] duration-300'>
                                <Link to="/dashboard/banners" className='text-wine-black font-bold'>Voltar</Link>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>

    )
}
