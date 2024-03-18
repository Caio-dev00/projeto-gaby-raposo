import { useForm } from 'react-hook-form'
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useParams } from "react-router-dom";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidV4 } from 'uuid';

import { db, storage } from "../../../../services/firebaseConnection";
import {  addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

import { FiUpload, FiTrash } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";

import { HeaderDashboard } from "../../../../components/headerDashboard";
import Title from "../../../../components/titleDahsboard";
import Input from "../../../../components/input";

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
  const { id } = useParams();
  const { user } = useContext(AuthContext)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })
  const [categoryImage, setCategoryImage] = useState<ImageItemProps[]>([])

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

  return (
    <div>
      <HeaderDashboard />


      <div className="ml-[300px] pt-[1px] px-[16px] max-md:ml-0">
        <Title name={id ? "Editar Categoria" : "Cadastrar Categoria"} >
          <FaEdit size={25} color="#FFF" />
        </Title>

      { id ? (
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
          <form onSubmit={handleSubmit(onSubmit)} >
            <Input
              placeholder="Nome da categoria"
              name="name"
              register={register}
              error={errors.name?.message}
              type="text"
            />
            <div className="flex w-full justify-around mt-10 p-2">
              <div>
                <button className="bg-inherit border-2 rounded-2xl p-2 border-wine-light text-wine-black font-semibold hover:bg-wine-black hover:bg-opacity-15" >
                  <Link to="/dashboard/categorias">
                    <span>Voltar e Fechar</span>
                  </Link>
                </button>
              </div>
              <button type="submit" className="bg-wine-light border-2 rounded-2xl p-2 border-wine-light text-white font-semibold hover:bg-opacity-90" >Salvar Categoria</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
