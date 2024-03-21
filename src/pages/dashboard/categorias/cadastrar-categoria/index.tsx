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

import { FiUpload, FiTrash } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";

import { HeaderDashboard } from "../../../../components/headerDashboard";
import Title from "../../../../components/titleDahsboard";
import Input from "../../../../components/input";

import { categoryProp } from '..';

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
        console.log("CATEGORIA CADASTRADA COM SUCESSO!")
      })
      .catch((error) => {
        console.error("ERRO AO CADASTRAR CATEGORIA", error)
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
        name: name
      });
      alert("Categoria atualizada com sucesso!");
      navigate("/dashboard/categorias"); // Redireciona de volta para a lista de categorias
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      navigate("/dashboard/categorias");
    }
  };


  return (
    <div>
      <HeaderDashboard />


      <div className="ml-[300px] pt-[1px] px-[16px] max-md:ml-0">
        <Title name={category ? `Editar categoria ${category.name}` : "Cadastrar Categoria"} >
          <FaEdit size={25} color="#FFF" />
        </Title>


        {categoryId ? (
          <div></div>
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
                <button type='submit' className="w-full max-w-[250px] mt-10 bg-wine-light border-2 rounded-2xl p-2 border-wine-light text-white font-semibold hover:bg-opacity-90" >Editar Categoria</button>
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
