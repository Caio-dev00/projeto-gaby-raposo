import { AuthContext } from "../../../../contexts/AuthContext";
import { useContext } from "react";
import { HeaderDashboard } from "../../../../components/headerDashboard";
import Title from "../../../../components/titleDahsboard";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../services/firebaseConnection";
import Input from "../../../../components/input";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'

const schema = z.object({
  name: z.string().min(1, "O campo é obrigatório"),
})

type FormData = z.infer<typeof schema>

export function CadastrarCategoria() {
  const { user } = useContext(AuthContext)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  function onSubmit(data: FormData) {
    addDoc(collection(db, "categorias"), {
      name: data.name.toUpperCase(),
      created: new Date(),
      owner: user?.name,
      uid: user?.uid
    })
    .then(() => {
      reset();
      console.log("CATEGORIA CADASTRADA COM SUCESSO!")
    })
    .catch((error) => {
      console.error("ERRO AO CADASTRAR CATEGORIA", error)
    })
  }


  return (
    <div>
      <HeaderDashboard />


      <div className="ml-[300px] pt-[1px] px-[16px] max-md:ml-0">
        <Title name="Cadastrar Categorias" >
          <FaEdit size={25} color="#FFF" />
        </Title>

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
