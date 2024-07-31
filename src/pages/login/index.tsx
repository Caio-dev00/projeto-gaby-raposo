import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

import Input from "../../components/input";
import { useForm } from 'react-hook-form';
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

import { auth } from "../../services/firebaseConnection";
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-hot-toast";
import logoFooter from '/src/assets/logoFooter.png';

const schema = z.object({
  email: z.string().email("Insira um email valido").min(0, "O campo email é obrigatorio!"),
  password: z.string().min(6, "A senha deve ter no minimo 6 caracteres").min(0, "O campo senha é obrigatorio")
})

type FormaData = z.infer<typeof schema>

export function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<FormaData>({
      resolver: zodResolver(schema),
      mode: 'onChange'
    })

    useEffect(() => {
      async function handleLogOut(){
        await signOut(auth)
      }
      handleLogOut()
    },[])

     async function onSubmit (data: FormaData){
      signInWithEmailAndPassword(auth, data.email, data.password)
      .then(async () => {
        console.log("LOGIN REALIZADO")
        toast.success("Login realizado com sucesso!")
        navigate("/dashboard", {replace: true})
      })
      .catch((error) => {
        toast.error("Erro ao logar")
        console.log(error)
      })
    }
    return (
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto w-12 rounded-full md:w-24 lg:w-36" src={logoFooter} alt="logo" />
        <h2 className="mt-10 text-center text-sm font-semibold leading-9 tracking-tight text-gray-900 md:text-lg lg:text-xl">Login Dashboard Gabi Raposo</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl">
        <form 
        onSubmit={handleSubmit(onSubmit)}>
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
            <button type="submit" className="flex w-full justify-center rounded-lg bg-wine-black px-4 py-2 text-sm font-semibold text-white hover:bg-opacity-95 hover:shadow-lg hover:border-black ">Login</button>
          </div>
        </form>
      </div>
    </div>
    )
  }
  