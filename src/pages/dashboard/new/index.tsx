import { AuthContext } from '../../../contexts/AuthContext';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidV4 } from 'uuid';
import { FaListAlt } from "react-icons/fa";

import { addDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../../services/firebaseConnection';

import { HeaderDashboard } from "../../../components/headerDashboard";
import Input from "../../../components/input";
import Title from "../../../components/titleDahsboard";

import { FiTrash, FiUpload } from 'react-icons/fi';
import { coresProps, tamanhoProps } from '../variacoes';


interface categoryProps {
  name: string;
  id: string;
}

interface colorProps {
  name: string;
  id: string;
}

interface sizeProps {
  name: string;
  id: string;
}

interface ImageItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

const schema = z.object({
  name: z.string().min(1, "O campo é obrigatorio!"),
  price: z.string().min(1, "O campo é obrigatorio!"),
  description: z.string().min(1, "O campo é obrigatorio!"),
  storage: z.string().min(1, "A quantidade é obrigatoria!"),
})

type FormData = z.infer<typeof schema>

const listRef = collection(db, "categorias")
const listCoresRef = collection(db, "Cores")
const listTamanhoRef = collection(db, "Tamanhos")

export function New() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  const { user } = useContext(AuthContext)
  const [category, setCategory] = useState<categoryProps[]>([])
  const [color, setColor] = useState<colorProps[]>([])
  const [size, setSize] = useState<sizeProps[]>([])


  const [loadCategory, setLoadCategory] = useState(true)
  const [loadColor, setLoadColor] = useState(true)
  const [loadSize, setLoadSize] = useState(true)

  const [categoria, setCategoria] = useState<number>(0)
  const [colorSelected, setColorSelected] = useState<number>(0)
  const [sizeSelected, setSizeSelected] = useState<number>(0)
  const [status, setStatus] = useState("Ativo")

  const [productImage, setProductImage] = useState<ImageItemProps[]>([])

  async function onSubmit(data: FormData) {

    await addDoc(collection(db, "Produtos"), {
      name: data.name.toLowerCase(),
      categoria: category[categoria].name,
      color: color[colorSelected].name,
      size: size[sizeSelected].name,
      price: data.price,
      storage: data.storage,
      description: data.description,
      status: status,
      created: new Date(),
      owner: user?.name,
      id: user?.uid,
      images: productImage,
      
    })
      .then(() => {
        reset();
        setProductImage([])
        console.log("PRODUTO CADASTRADO COM SUCESSO!")
      })
      .catch((error) => {
        console.error("ERRO AO CADASTRAR PRODUTO", error)
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
      console.log("ERROR AO DELETAR")
    }
  }


  useEffect(() => {
    async function loadCategory() {
      await getDocs(listRef)
        .then((snapshot) => {
          const lista = [] as categoryProps[];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              name: doc.data().name
            })
          })

          if (snapshot.size === 0) {
            console.log("NENHUMA CATEGORIA ENCONTRADA");
            setCategory([{ id: '1', name: "FREELA" }])
            setLoadCategory(false)
            return;

          }

          setCategory(lista)
          setLoadCategory(false)
        })
        .catch((error) => {
          console.log("ERRO AO BUSCAR OS CLIENTES", error);
          setLoadCategory(false);
          setCategory([{ id: '1', name: 'FREELA' }])
        })
    }

    async function loadCores() {
      await getDocs(listCoresRef)
        .then((snapshot) => {
          const lista = [] as coresProps[];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              name: doc.data().cor,
              owner: doc.data().owner,
              images: doc.data().images
            })
          })

          if (snapshot.size === 0) {
            console.log("NENHUMA CATEGORIA ENCONTRADA");
            setColor([{ id: '1', name: "FREELA" }])
            setLoadColor(false)
            return;

          }

          setColor(lista)
          setLoadColor(false)
        })
        .catch((error) => {
          console.log("ERRO AO BUSCAR OS CLIENTES", error);
          setLoadColor(false);
          setColor([{ id: '1', name: 'FREELA' }])
        })
    }
    async function loadTamanho() {
      await getDocs(listTamanhoRef)
        .then((snapshot) => {
          const lista = [] as tamanhoProps[];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              name: doc.data().tamanho,
              owner: doc.data().owner,
            })
          })

          if (snapshot.size === 0) {
            console.log("NENHUM TAMANHO ENCONTRADO");
            setSize([{ id: '1', name: "FREELA" }])
            setLoadSize(false)
            return;

          }

          setSize(lista)
          setLoadSize(false)
        })
        .catch((error) => {
          console.log("ERRO AO BUSCAR OS CLIENTES", error);
          setLoadSize(false);
          setSize([{ id: '1', name: 'FREELA' }])
        })
    }
    loadCategory();
    loadCores();
    loadTamanho();
  }, [])



// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleChangeCategory(e: any):void{
  setCategoria(e.target.value)
  console.log(categoria)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleChangeColor(e: any):void{
  setColorSelected(e.target.value)
  console.log(colorSelected)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChangeSize(e: any):void{
    setSizeSelected(e.target.value)
    console.log(sizeSelected)
  }
  function handleOptionChange(e: ChangeEvent<HTMLInputElement>) {
    setStatus(e.target.value)
    console.log(status)
  }

  return (
    <div>
      <HeaderDashboard />


      <div className="ml-[300px] pt-[1px] px-[16px] max-md:ml-0">
        <Title name={"Cadastrar Produto"}>
          <FaListAlt size={25} color="#FFF" />
        </Title>

        <div className='bg-white p-10 rounded-md shadow-md'>
          <h1 className='text-red-500'>Maximo: 4 fotos</h1>
          <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
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

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
            <label>Nome do Produto:</label>
            <Input
              placeholder=""
              name='name'
              type='text'
              error={errors.name?.message}
              register={register}
            />
            <div className='flex flex-col w-full'>
              <label className='mt-4'>Selecione a Categoria</label>
              {
                loadCategory ? (
                  <input type="text" disabled={true} value="Carregando..." />
                ) : (
                  <select
                    className='w-full max-w-50 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2'
                    value={categoria}
                    onChange={handleChangeCategory}>
                    {category.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item.name}
                        </option>
                      )
                    })}
                  </select>
                )
              }
              <label>Preço:</label>
              <Input
                placeholder="ex: 99,90"
                name='price'
                type='text'
                error={errors.price?.message}
                register={register}
              />
              <label>Estoque:</label>
              <Input
                placeholder="ex: 14"
                name='storage'
                type='text'
                error={errors.storage?.message}
                register={register}
              />
            </div>

            <h1 className='my-5 text-xl font-semibold'>Variação do Produto:</h1>

            {/* ---SELECIONE A COR--- */}
            <label>Selecione a cor</label>
            {
              loadColor ? (
                <input type="text" disabled={true} value="Carregando..." />
              ) : (
                <select
                  className='w-full max-w-50 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2'
                  value={colorSelected}
                  onChange={handleChangeColor}>
                  {color.map((item, index) => {
                    return (
                      <option key={index} value={index}>
                        {item.name}
                      </option>
                    )
                  })}
                </select>
              )
            }

            {/* ---TAMANHO--- */}

            <label className='mt-4'>Selecione o Tamanho</label>
            {
              loadSize ? (
                <input type="text" disabled={true} value="Carregando..." />
              ) : (
                <select
                  className='w-full max-w-50 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2'
                  value={sizeSelected}
                  onChange={handleChangeSize}>
                  {size.map((item, index) => {
                    return (
                      <option key={index} value={index}>
                        {item.name}
                      </option>
                    )
                  })}
                </select>
              )
            }
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
            <label className='mt-4'>Descrição do produto</label>
            <textarea
              className='w-full border-2 rounded-md h-24 px-2'
              {...register("description")}
              name='description'
              id="description"
              placeholder='Escreva algo sobre o produto...'
            />
            <button type='submit' className='bg-wine-black w-48 mt-5 p-2 rounded-md hover:bg-wine-light hover:scale-[1.02] duration-300'>
              <span className='text-white font-bold'>Cadastrar Produto</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
