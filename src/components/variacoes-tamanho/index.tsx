import { HeaderDashboard } from "../headerDashboard";
import Title from "../titleDahsboard";
import { FaEdit } from "react-icons/fa";
import Input from "../input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

const schema = z.object({
    tamanho: z.string().min(0, "Digite o tamanho corretamente !")
})

type FormData = z.infer<typeof  schema>




export function CadastrarTamanho() {
    const { user } = useContext (AuthContext)
    const { register, handleSubmit, formState: { errors}, reset} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    function onSubmit(data: FormData) {
        addDoc(collection(db,"Tamanho"), {
            tamanho: data.tamanho.toLowerCase(),
            created: new Date (),
            owner: user?.name,
            uid: user?.uid,
        })
        .then(() => {
            reset();
            console.log("TAMANHA CADASTRADO COM SUCESSO")
        })
        .catch((error) => {
            console.error("ERRO AO CADASTRAR VARIAÇÃO", error)
        })
    }
    return (
        <div>
            <HeaderDashboard />

            <div className="ml-[300px] pt-0.5 px-4 max-md:ml-0">
                <Title name="Cadastrar tamanho">
                    <FaEdit size={25} color="#FFF" />
                </Title>

                <div className="mt-12">
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <Input
                            placeholder= "Digite a variação do tamanho"
                            name="tamanho"
                            register={register}
                            error={errors.tamanho?.message}
                            type="text"
                        />
                    </form>
                
                </div>

                
            </div>
        </div>
    )
}