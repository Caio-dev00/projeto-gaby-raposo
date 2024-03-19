import { HeaderDashboard } from "../../../../components/headerDashboard";
import Title from "../../../../components/titleDahsboard";
import { FaEdit } from "react-icons/fa";
import Input from "../../../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../services/firebaseConnection";
import { Link } from "react-router-dom";

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
        addDoc(collection(db,"Tamanhos"), {
            tamanho: data.tamanho.toUpperCase(),
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
                        <div className="flex w-full justify-around mt-10 px-32">
                            <button className="bg-inherit border-2 rounded-2xl p-2 border-wine-light text-wine-black font-semibold hover:bg-wine-black hover:bg-opacity-15">
                                <Link to="/dashboard/variacoes">
                                    <span>Voltar e Fechar</span>
                                </Link>
                            </button>
                            <button type="submit" className="bg-wine-light border-2 rounded-2xl p-2 border-wine-light text-white font-semibold hover:bg-opacity-90 hover:drop-shadow-lg">Salvar Variação</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}