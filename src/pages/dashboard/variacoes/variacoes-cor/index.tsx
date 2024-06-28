import { useForm } from "react-hook-form";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidV4 } from "uuid";

import { db, storage } from "../../../../services/firebaseConnection";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import { FiUpload, FiTrash, FiTrash2 } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";

import { HeaderDashboard } from "../../../../components/headerDashboard";
import Title from "../../../../components/titleDahsboard";
import Input from "../../../../components/input";
import { coresProps } from "..";
import toast from "react-hot-toast";

const schema = z.object({
    cor: z.string().min(1, "Digite a cor corretamente !")
})

type FormData = z.infer<typeof schema>

interface ImageItemProps {
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
}

export function CadastrarCor() {
    const location = useLocation();
    const navigate = useNavigate();
    const corId = new URLSearchParams(location.search).get("id")

    const [colorImagesFromDB, setColorImagesFromDB] = useState<ImageItemProps[]>([]);
    const [deletedImages, setDeletedImages] = useState<ImageItemProps[]>([]);
    const [cor, setCor] = useState<coresProps | null>(null)
    const [name, setName] = useState("");

    const { user } = useContext(AuthContext)
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    const [corImage, setCorImage] = useState<ImageItemProps | null>(null)


    function onSubmit(data: FormData) {
        addDoc(collection(db, "Cores"), {
            cor: data.cor.toUpperCase(),
            created: new Date(),
            owner: user?.name,
            uid: user?.uid,
            images: corImage ? [corImage] : [],
        })
            .then(() => {
                reset();
                setCorImage(null)
                toast.success("COR CADASTRADA COM SUCESSO")
            })
            .catch((error) => {
                toast.error("ERRO AO CADASTRAR COR")
                console.error("ERRO AO CADASTRAR VARIAÇÃO", error)
            })
    }

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0]

            if (image.type === "image/jpeg" || image.type === "image/png") {
                await handleUpload(image)
            } else {
                alert("Envie uma imagem no formato .jpeg ou .png")
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
                getDownloadURL(snapshot.ref).then((getDownloadUrl) => {
                    const imageItem = {
                        name: uidImage,
                        uid: currentUid,
                        previewUrl: URL.createObjectURL(image),
                        url: getDownloadUrl
                    }
                    setCorImage(imageItem)
                })
            })
    }
    async function handleDeleteImage(item: ImageItemProps) {
        const imagePath = `images/${item.uid}/${item.name}`;
        const imageRef = ref(storage, imagePath)

        try {
            await deleteObject(imageRef)
            setCorImage(null)
        } catch (error) {
            console.log("ERRO AO DELETAR", error)
        }
    }

    /* FUNÇÕES PARA EDIÇAO DE IMAGEM */

    useEffect(() => {
        async function fetchColorImages() {
          if (!corId) return;
    
          try {
            const colorDoc = await getDoc(doc(db, "Cores", corId));
            if (colorDoc.exists()) {
              const colorData = colorDoc.data();
              if (colorData && colorData.images) {
                setColorImagesFromDB(colorData.images);
                
              }
            } else {
              console.log("Cor não encontrada");
              toast.error("Cor não encontrada!");
            }
          } catch (error) {
            console.error("Erro ao buscar variação de cor:", error);
            toast.error("Erro ao buscar variação de cor!");
          }
        }
    
        fetchColorImages();
      }, [corId]);

      async function handleFileEdit(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
          const image = e.target.files[0];
    
          if (image.type === "image/jpeg" || image.type === "image/png") {
            await handleUploadEdit(image);
          } else {
            alert("Envie apenas imagens jpeg ou png");
            return;
          }
        }
      }

      async function handleUploadEdit(image: File) {
        if (!user?.uid) {
          return;
        }
    
        const currentUid = user?.uid;
        const uidImage = uuidV4();
    
        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);
    
        try {
          const snapshot = await uploadBytes(uploadRef, image);
          const downloadUrl = await getDownloadURL(snapshot.ref);
    
          const imageItem = {
            name: uidImage,
            uid: currentUid,
            previewUrl: URL.createObjectURL(image),
            url: downloadUrl,
          };
          
          // Delete the existing image from storage
          if (corImage) {
            await handleDeleteImage(corImage);
          }

          setCorImage(imageItem);
        } catch (error) {
          console.error("Erro ao fazer upload da imagem:", error);
        }
      }

      const handleDeleteImageFromDB = async (item: ImageItemProps) => {
        try {
          const updatedImages = colorImagesFromDB.filter(image => image.name !== item.name);
          setColorImagesFromDB(updatedImages);
    
          // Update the state to track deleted images
          setDeletedImages([...deletedImages, item]);
    
          toast.success("Imagem excluída com sucesso!");
        } catch (error) {
          console.error("Erro ao excluir imagem:", error);
          toast.error("Erro ao excluir imagem!");
        }
      };


    useEffect(() => {
        async function fetchCores() {
            if (!corId) return;

            try {
                const corDoc = await getDoc(doc(db, "Cores", corId))
                if (corDoc.exists()) {
                    const corData = corDoc.data();
                    if (corData) {
                        const corCompleta: coresProps = {
                            id: corDoc.id,
                            name: corData.cor,
                            owner: corData.owner,
                            images: corData.images
                        };
                        setCor(corCompleta);
                        setName(corCompleta.name)
                    }
                } else {
                    console.log("Cor não encontrada...")
                    navigate("/dashboard/variacoes")
                }
            } catch (error) {
                console.log("Erro ao buscar cor: ", error)
                navigate("/dashboard/variacoes")
            }
        }
        fetchCores()
    }, [corId, navigate])

    const handleNomeCorChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const editSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
          await updateDoc(doc(db, "Cores", corId!), {
              cor: name,
              images: corImage ? [corImage] : []
          });
          setDeletedImages([])

          alert("Cor atualizada com sucesso!");
          navigate("/dashboard/variacoes")
      } catch (error) {
          console.log("Erro ao atualizar categoria: ", error)
          navigate("/dashboard/variacoes")
      }
  }

    

    return (
        <div>
            <HeaderDashboard />

            <div className="ml-[300px] pt-0.5 px-4 max-md:ml-0">
                {corId ? (
                    <Title name={`Editar cor "${cor?.name}"`}>
                        <FaEdit size={25} color="#FFF" />
                    </Title>
                ) : (
                    <Title name="Cadastrar Cor">
                        <FaEdit size={25} color="#FFF" />
                    </Title>
                )}

                {corId ? (
                    <div>
                    <div className='flex justify-center'>
                      <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                        <div className="absolute cursor-pointer ">
                          <FiUpload size={30} color="#000" />
                        </div>
                        <div className="cursor-pointer ">
                          <input
                            className="opacity-0 cursor-pointer"
                            onChange={handleFileEdit}
                            type="file"
                            accept="image/*"
                            multiple
                          />
                        </div>
                      </button>
        
                      {corImage && (
                                <div className='h-32 flex items-center justify-center relative ' key={corImage.name}>
                                    <button className="absolute flex text-black" onClick={() => handleDeleteImage(corImage)}>
                                        <FiTrash2 size={24} color="#FFF" />
                                    </button>
                                    <img
                                        src={corImage.previewUrl}
                                        className="rounded-lg w-40 h-32 object-cover ml-2 "
                                    />
                                </div>
                            )}
                    </div>
        
        
        
                    <h1 className='text-xl font-semibold my-8'>Imagem da categoria:</h1>
                    <div className='flex items-center my-3'>
                      {colorImagesFromDB.map(item => (
                        <div key={item.uid} className="flex items-center">
                          <div className='flex flex-col'>
                            <img src={item.url} alt={item.name} className="w-24 h-24 object-cover mr-4 rounded-lg" />
                            <button className='flex items-center' onClick={() => handleDeleteImageFromDB(item)}>Excluir<FiTrash2 /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                    <div className="w-full justify-center p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                        <button
                            className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
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

                        {corImage && (
                            <div className='w-[60px] h-[60px] flex items-center justify-center relative' key={corImage.name}>
                                <button className="flex absolute mt-24" onClick={() => handleDeleteImage(corImage)}>

                                    <FiTrash size={15} color="#000" />
                                </button>
                                <img
                                    src={corImage.previewUrl}
                                    className="rounded-lg w-full h-[60px] object-fill"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-12">
                    {corId ? (
                        <>
                            <form onSubmit={editSubmit} className="flex flex-col justify-center items-center">
                                <input
                                    className='block w-full rounded-md border-2 border-gray-400 py-3 px-2 text-gray-600 md:text-sm'
                                    type="text"
                                    placeholder='Editar cor'
                                    value={name}
                                    onChange={handleNomeCorChange}
                                />
                                <button type='submit' className=" w-full max-w-[250px] mt-10 bg-wine-light border-2 rounded-2xl p-2 border-wine-light text-white font-semibold hover:bg-opacity-90" >Salvar alteração</button>
                            </form>
                            <div className="flex w-full justify-around mt-2 p-2">
                                <div>
                                    <button className="bg-inherit border-2 rounded-2xl p-2 border-wine-light text-wine-black font-semibold hover:bg-wine-black hover:bg-opacity-15" >
                                        <Link to="/dashboard/variacoes">
                                            <span>Voltar e Fechar</span>
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center">
                                <Input
                                    placeholder="Digite a variação da cor"
                                    name="cor"
                                    register={register}
                                    error={errors.cor?.message}
                                    type="text"
                                />

                                <button type="submit" className=" w-full self-center max-w-[250px] mt-10 bg-wine-light border-2 rounded-2xl p-2 border-wine-light text-white font-semibold hover:bg-opacity-90 hover:drop-shadow-lg">Salvar Variação</button>
                            </form>
                            <div className="flex w-full justify-around mt-5 px-32">
                                <button className="bg-inherit border-2 rounded-2xl p-2 border-wine-light text-wine-black font-semibold hover:bg-wine-black hover:bg-opacity-15">
                                    <Link to="/dashboard/variacoes">
                                        <span>Voltar e Fechar</span>
                                    </Link>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}