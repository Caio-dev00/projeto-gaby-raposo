import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../services/firebaseConnection";

import { tamanhoProps } from "..";
import Input from "../../../../components/input";
import Title from "../../../../components/titleDahsboard";
import { HeaderDashboard } from "../../../../components/headerDashboard";
import toast from "react-hot-toast";

const schema = z.object({
    tamanho: z.string().min(1, "Digite o tamanho corretamente !")
})

type FormData = z.infer<typeof schema>

export function CadastrarTamanho() {
    const { user } = useContext(AuthContext)
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    const location = useLocation();
    const navigate = useNavigate();
    const tamanhoId = new URLSearchParams(location.search).get("id");
    const [tamanho, setTamanho] = useState<tamanhoProps | null>(null);
    const [name, setName] = useState("");

    useEffect(() => {
        async function fetchTamanho() {
            if (!tamanhoId) return;
            try {
                const tamanhoDoc = await getDoc(doc(db, "Tamanhos", tamanhoId))
                if (tamanhoDoc.exists()) {
                    const tamanhoData = tamanhoDoc.data();
                    if (tamanhoData) {
                        const tamanhoCompleto: tamanhoProps = {
                            id: tamanhoDoc.id,
                            name: tamanhoData.tamanho,
                            owner: tamanhoData.owner,
                        };
                        setTamanho(tamanhoCompleto)
                        setName(tamanhoCompleto.name)
                    }
                } else {
                    console.log("Tamanho não encontrado...")
                    navigate("variacoes")
                }
            } catch (error) {
                console.log("Erro ao buscar tamanhos", error)
                navigate("variacoes")
            }
        }
        fetchTamanho();
    }, [tamanhoId, navigate])

    function onSubmit(data: FormData) {
        addDoc(collection(db, "Tamanhos"), {
            tamanho: data.tamanho.toUpperCase(),
            created: new Date(),
            owner: user?.name,
            uid: user?.uid,
        })
            .then(() => {
                reset();
                toast.success("TAMANHO CADASTRADO COM SUCESSO")
            })
            .catch((error) => {
                toast.error("ERRO AO CADASTRAR TAMANHO")
                console.error("ERRO AO CADASTRAR VARIAÇÃO", error)
            })
    }

    const editSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await updateDoc(doc(db, "Tamanhos", tamanhoId!), {
                tamanho: name
            });
            alert("Tamanho atualizado com sucesso!")
            navigate("/dashboard/variacoes")
        } catch (error) {
            console.log("Erro ao atualizar tamanho:", error)
            navigate("/dashboard/variacoes")
        }
    }

    const handleTamanhoChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    };

    return (
        <div>
            <HeaderDashboard />

            <div className="ml-[300px] pt-0.5 px-4 max-md:ml-0">
                {tamanhoId ? (
                    <Title name={`Editar tamanho "${tamanho?.name}"`}>
                        <FaEdit size={25} color="#FFF" />
                    </Title>
                ) : (
                    <Title name="Cadastrar tamanho">
                        <FaEdit size={25} color="#FFF" />
                    </Title>
                )}

                <div className="mt-12">
                    {tamanhoId ? (
                        <>

                            <form onSubmit={editSubmit} className="flex flex-col justify-center items-center">
                                <input
                                    className='block w-full rounded-md border-2 border-gray-400 py-3 px-2 text-gray-600 md:text-sm'
                                    type="text"
                                    placeholder='Editar tamanho'
                                    value={name}
                                    onChange={handleTamanhoChange}
                                />
                                <button type='submit' className="w-full max-w-[250px] mt-10 bg-wine-light border-2 rounded-2xl p-2 border-wine-light text-white font-semibold hover:bg-opacity-90" >Editar Variação</button>
                            </form>
                            <div className="flex w-full justify-around mt-5 p-2">
                                <div>
                                    <button className="bg-inherit border-2 rounded-2xl p-2 border-wine-light text-wine-black font-semibold hover:bg-wine-black hover:bg-opacity-15" >
                                        <Link to="/dashboard/variacoes">
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
                                    placeholder="Digite a variação do tamanho"
                                    name="tamanho"
                                    register={register}
                                    error={errors.tamanho?.message}
                                    type="text"
                                />
                                <button type="submit" className="w-full max-w-[250px] mt-10 self-center bg-wine-light border-2 rounded-2xl p-2 border-wine-light text-white font-semibold hover:bg-opacity-90 hover:drop-shadow-lg">Salvar Variação</button>
                            </form>
                                <div className="flex w-full justify-around mt-5 px-32">
                                    <button className="bg-inherit border-2 rounded-2xl p-2 border-wine-light text-wine-black font-semibold hover:bg-wine-black hover:bg-opacity-15">
                                        <Link to="/dashboard/variacoes">
                                            <span>Voltar e Fechar</span>
                                        </Link>
                                    </button>
                                </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}