import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"

import { FaListAlt } from "react-icons/fa";

import { HeaderDashboard } from "../../../components/headerDashboard";
import Input from "../../../components/input";
import Title from "../../../components/titleDahsboard";
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../services/firebaseConnection';
import { useParams } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(1,"O campo é obrigatorio!"),
  price: z.string().min(1, "O campo é obrigatorio!"),
  description: z.string().min(1,"O campo é obrigatorio!")
})

type FormData = z.infer<typeof schema>

interface categoryProps {
  name: string
  id: string,
}

const listRef = collection(db, "categorias")

export function New() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
    })

  const { id } = useParams();
  const [category, setCategory] = useState<categoryProps[]>([])
  const [loadCategory, setLoadCategory] = useState(true)
  const [categorySelected, setCategorySelected] = useState(0)


  useEffect(() => {

    async function loadCatagory(){
      const querySnapshot = await getDocs(listRef)
      .then( (snapshot) => {
        const lista =[];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            name: doc.data().name
          })
        })

        if(snapshot.docs.size === 0){
          console.log("NENHUMA CATEGORIA ENCONTRADA");
          setCategory([ {id: '1', name: "FREELA"}])
          setLoadCategory(false)
          return;

        }

        setCategory(lista)
        setLoadCategory(false)
      })
      .catch( (error) => {
        console.log("ERRO AO BUSCAR OS CLIENTES", error);
        setLoadCategory(false);
        setCategory([ {id: '1', name: 'FREELA'} ])
    })
    }
    loadCatagory();
  },[])

  function handleChangeCategory(e){
    setCategorySelected(e.target.value);
}

  return (
    <div>
      <HeaderDashboard/>

      
      <div className="ml-[300px] pt-[1px] px-[16px]">
          <Title name={"Cadastrar Produto"}>
            <FaListAlt size={25} color="#FFF" />
          </Title>

          <div className='bg-white p-10 rounded-md shadow-md'>
            <form className='flex flex-col'>
              <label>Nome do Produto</label>
              <Input
                placeholder=""
                name='name'
                type='text'
                error={errors.name?.message}
                register={register}
              />

              <label className='mt-2'> Categoria </label>
            {
              loadCategory ? (
                <input type="text" disabled={true} value="Carregando..." />
              ): (
                <select 
                className='w-full max-w-44 border border-black py-1 rounded-md mb-2' 
                value={categorySelected} 
                onChange={handleChangeCategory}>
                  {category.map((item, index) => {
                    return(
                      <option key={index} value={index}>
                          {item.name}
                      </option>
                    )
                  })}
                </select>
              )
            }
            </form>
          </div>
        </div>
    </div>
  )
}
