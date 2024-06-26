import { useForm } from 'react-hook-form'
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidV4 } from 'uuid';

import { db, storage } from "../../../../services/firebaseConnection";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

import { FiUpload, FiTrash, FiTrash2 } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";

import { HeaderDashboard } from "../../../../components/headerDashboard";
import Title from "../../../../components/titleDahsboard";
import Input from "../../../../components/input";

import { categoryProp } from '..';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(1, "O campo é obrigatório"),
})

type FormData = z.infer<typeof schema>

interface ImageItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function CadastrarCategoria() {
  const location = useLocation();
  const navigate = useNavigate();
  const categoryId = new URLSearchParams(location.search).get("id")

  const [category, setCategory] = useState<categoryProp | null>(null)
  const [categoryImagesFromDB, setCategoryImagesFromDB] = useState<ImageItemProps[]>([]);
  const [existingImages, setExistingImages] = useState<ImageItemProps[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<ImageItemProps[]>([]);
  const [name, setName] = useState("")


  const { user } = useContext(AuthContext)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })
  const [categoryImage, setCategoryImage] = useState<ImageItemProps[]>([])

  useEffect(() => {
    async function fetchCategory() {
      if (!categoryId) return;
      try {
        const categoryDoc = await getDoc(doc(db, "categorias", categoryId))
        if (categoryDoc.exists()) {
          const categoriaData = categoryDoc.data();
          if (categoriaData) {
            const categoriaCompleta: categoryProp = {
              id: categoryDoc.id,
              name: categoriaData.name,
              owner: categoriaData.owner,
              images: categoriaData.images,
            };
            setCategory(categoriaCompleta);
            setName(categoriaCompleta.name)
          }
        } else {
          console.log("Categoria não encontrada")
          navigate("/dashboard/categorias")
        }
      } catch (error) {
        console.log("Erro ao buscar categoria:", error)
        navigate("/dashboard/categorias")
      }
    }
    fetchCategory();
  }, [categoryId, navigate])

  function onSubmit(data: FormData) {
    addDoc(collection(db, "categorias"), {
      name: data.name.toLowerCase(),
      created: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: categoryImage,
    })
      .then(() => {
        reset();
        setCategoryImage([])
        toast.success("CATEGORIA CADASTRADA COM SUCESSO!")
      })
      .catch((error) => {
        toast.error("ERRO AO CADASTRAR CATEGORIA")
        console.error("ERRO AO CADASTRAR CATEGORIA", error)
      })
  }

  useEffect(() => {
    async function fetchProductImages() {
      if (!categoryId) return;

      try {
        const categoryDoc = await getDoc(doc(db, "categorias", categoryId));
        if (categoryDoc.exists()) {
          const categoryData = categoryDoc.data();
          if (categoryData && categoryData.images) {
            setCategoryImagesFromDB(categoryData.images);
            setExistingImages(categoryData.images);
          }
        } else {
          console.log("Produto não encontrado");
          toast.error("Produto não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar imagens do produto:", error);
        toast.error("Erro ao buscar imagens do produto!");
      }
    }

    fetchProductImages();
  }, [categoryId]);

  const handleDeleteImageFromDB = async (item: ImageItemProps) => {
    try {
      const updatedImages = categoryImagesFromDB.filter(image => image.name !== item.name);
      setCategoryImagesFromDB(updatedImages);

      // Update the state to track deleted images
      setDeletedImages([...deletedImages, item]);

      toast.success("Imagem excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir imagem da categoria:", error);
      toast.error("Erro ao excluir imagem da categoria!");
    }
  };

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

      setCategoryImage((images) => [...images, {
        name: uidImage,
        uid: currentUid,
        previewUrl: URL.createObjectURL(image),
        url: downloadUrl,
      }]);
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
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
          setCategoryImage((images) => [...images, imageItem])
        })
      })
  }

  async function handleDeleteImage(item: ImageItemProps) {
    const imagePath = `images/${item.uid}/${item.name}`;
    const imageRef = ref(storage, imagePath)

    try {
      await deleteObject(imageRef)
      setCategoryImage(categoryImage.filter((image) => image.url !== item.url))
    } catch (error) {
      console.log("ERROR AO DELETAR")
    }
  }

  const handleNomeCategoriaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  };

  const editSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "categorias", categoryId!), {
        name: name,
      });

      const updatedImages = [...existingImages, ...categoryImage].filter(image => !deletedImages.some(deletedImage => deletedImage.name === image.name));
      await updateDoc(doc(db, "categorias", categoryId!), {
        images: updatedImages,
      });

      setDeletedImages([]);

      toast.success("Categoria atualizada com sucesso!");
      navigate("/dashboard/categorias");
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast.error("Erro ao atualizar categoria");
      navigate("/dashboard/categorias");
    }
  };

  async function handleFileEdit(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImages = Array.from(e.target.files);

      // Filtrar apenas as novas imagens
      const newImagesArray = selectedImages.filter(image => !existingImages.some(existingImage => existingImage.name === image.name));

      // Adicionar novas imagens ao estado
      setNewImages([...newImages, ...newImagesArray]);

      // Realizar o upload das novas imagens
      for (const image of newImagesArray) {
        if (image.type === "image/jpeg" || image.type === "image/png") {
          await handleUploadEdit(image);
        } else {
          alert("Envie apenas imagens jpeg ou png");
          return;
        }
      }
    }
  }


  return (
    <div>
      <HeaderDashboard />
      <div className="ml-[300px] pt-[1px] px-[16px] max-md:ml-0">
        <Title name={category ? `Editar categoria ${category.name}` : "Cadastrar Categoria"} >
          <FaEdit size={25} color="#FFF" />
        </Title>

        {categoryId ? (
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

          {categoryImage.map(item => (
              <div className='h-32 flex items-center justify-center relative ' key={item.name}>
                <button className="absolute flex text-black" onClick={() => handleDeleteImage(item)}>
                  <FiTrash2 size={24} color="#FFF" />
                </button>
                <img
                  src={item.previewUrl}
                  className="rounded-lg w-40 h-32 object-cover ml-2 "
                />
              </div>
            ))}
          </div>

            
            
            <h1 className='text-xl font-semibold my-8'>Imagem da categoria:</h1>
            <div className='flex items-center my-3'>
              {categoryImagesFromDB.map(item => (
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

            {categoryImage.map(item => (
              <div className='w-[60px] h-[60px] flex items-center justify-center relative' key={item.name}>
                <button className="flex absolute mt-24" onClick={() => handleDeleteImage(item)}>
                  <FiTrash size={15} color="#000" />
                </button>
                <img
                  src={item.previewUrl}
                  className="rounded-lg w-full h-[60px] object-fill"
                />
              </div>
            ))}
          </div>
        )}


        <div className="mt-12">
          {categoryId ? (
            <>
              <form onSubmit={editSubmit} className="flex flex-col justify-center items-center">
                <input
                  className='block w-full rounded-md border-2 border-gray-400 py-3 px-2 text-gray-600 md:text-sm'
                  type="text"
                  placeholder='Editar a categoria'
                  value={name}
                  onChange={handleNomeCategoriaChange}
                />
                <button type='submit' className="w-full max-w-[250px] mt-10 bg-wine-light border-2 rounded-2xl p-2 border-wine-light text-white font-semibold hover:bg-opacity-90" >Salvar alterações</button>
              </form>
              <div className="flex w-full justify-around mt-5 p-2">
                <div>
                  <button className="bg-inherit border-2 rounded-2xl p-2 border-wine-light text-wine-black font-semibold hover:bg-wine-black hover:bg-opacity-15" >
                    <Link to="/dashboard/categorias">
                      <span>Voltar e Fechar</span>
                    </Link>
                  </button>
                </div>
              </div>
            </>

          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center" >
                <Input
                  placeholder="Nome da categoria"
                  name="name"
                  register={register}
                  error={errors.name?.message}
                  type="text"
                />
                  <button type='submit' className="w-full max-w-[250px] mt-10 self-center bg-wine-light border-2 rounded-2xl p-2 border-wine-light text-white font-semibold hover:bg-opacity-90" >Salvar Categoria</button>
              </form>
                <div className="flex w-full justify-around mt-5 p-2">
                  <div>
                    <button className=" bg-inherit border-2 rounded-2xl p-2 border-wine-light text-wine-black font-semibold hover:bg-wine-black hover:bg-opacity-15" >
                      <Link to="/dashboard/categorias">
                        <span>Voltar e Fechar</span>
                      </Link>
                    </button>
                  </div>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
