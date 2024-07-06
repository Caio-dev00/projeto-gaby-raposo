import { Link } from "react-router-dom";
import {  useContext } from "react";
import { useNavigate } from "react-router-dom"; 

import Input from "../../components/input";
import { useForm } from 'react-hook-form';
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

import { auth } from "../../services/firebaseConnection";
import { createUserWithEmailAndPassword, updateProfile,  } from "firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";

import logo from '../../assets/logo.png'

const schema = z.object({
  name: z.string().min(4, "O Campo nome é obrigatorio!"),
  email: z.string().email("Insira um email valido").min(0, "O campo email é obrigatorio!"),
  password: z.string().min(6, "A senha deve ter no minimo 6 caracteres").min(0, "O campo senha é obrigatorio")
})

type FormData = z.infer<typeof schema>

export function Register() {
    const navigate = useNavigate();
    const { handleInfoUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
      resolver: zodResolver(schema),
      mode: 'onChange'
    })

 

    async function onSubmit(data: FormData){
      createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.name
        })
        handleInfoUser({
          name: data.name,
          email: data.email,
          uid: user.user.uid
        })
        console.log("CADASTRO COM SUCESSO")
        toast.success("Cadastrado com sucesso!")
        navigate("/dashboard", {replace: true})
      })
      .catch((error) => {
        console.error("ERRO AO CADASTRAR")
        toast.error("ERRO AO CADASTRAR")
        console.error(error)
      })
    }

    return (
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto w-12 rounded-full md:w-24  lg:w-36 " src={logo} alt="logo" />
        <h2 className="mt-10 text-center text-sm font-semibold leading-9 tracking-tight text-gray-900 md:text-lg lg:text-xl">Cadastrar Dashboard Gabi Raposo</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl">
        <form 
        onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label htmlFor="email" className="block text-sm font-bold leading-6 text-gray-500">Digite seu Nome Completo</label>
            <div className="mt-2">
              <Input
                placeholder=""
                type="text"
                name="name"
                error={errors.name?.message}
                register={register}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold leading-6 text-gray-500">Digite seu email</label>
            <div className="mt-2">
            <Input
                placeholder=""
                type="email"
                name="email"
                error={errors.email?.message}
                register={register}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mt-2">
              <label htmlFor="pw" className="block text-sm font-bold text-gray-500">Digite sua senha</label>
            </div>
            <div className="mt-2">
            <Input
                placeholder=""
                type="password"
                name="password"
                error={errors.password?.message}
                register={register}
              />
            </div>
          </div>

          <div className="my-5">
            <button type="submit" className="flex w-full justify-center rounded-lg bg-wine-black px-4 py-2 text-sm font-semibold text-white hover:bg-opacity-95 hover:shadow-lg hover:border-black ">Cadastrar</button>
          </div>
        </form>

        <Link to="/login">
          <p className="my-2 flex justify-center">Já possui uma conta? Faça o login!</p>
        </Link>
      </div>
    </div>
    )
  }
  