import { useState } from "react";
import { useForm } from "react-hook-form";

interface CepData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro: boolean;
  numero: string | boolean;
  complemento: string | boolean;
}


export default function EnderecoUsuario() {

  const { register, setValue } = useForm();
  const [erroCep, setErroCep] = useState<string | null>(null);
  const [formAvailable, setFormAvailable] = useState<boolean>(false);

  const checkCEP = (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/D/g, '');

    if (cep.trim() === '' || cep.length !== 8 || isNaN(parseInt(cep))) {
      setErroCep('Digite um CEP válido');
      console.log(`'CEP Inválido: ${cep}`);
      setFormAvailable(false);
      setValue('endereco', '');
      setValue('bairro', '');
      setValue('cidade', '');
      setValue('estado', '');
      setValue('numero', '');
      setValue('complemento', '');
      return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('CEP não encontrado');
        }
        return res.json();
      })
      .then((data: CepData) => {
        console.log(data);
        if (data.erro) {
          throw new Error('CEP não encontrado');
        }
        setValue('endereco', data.logradouro,);
        setValue('bairro', data.bairro);
        setValue('cidade', data.localidade);
        setValue('estado', data.uf);
        setErroCep(null);
        setFormAvailable(true);
      })
      .catch((error) => {
        console.error('Erro ao buscar CEP:', error);
        setErroCep('CEP não encontrado');
        setFormAvailable(false);
        setValue('endereco', '');
        setValue('bairro', '');
        setValue('cidade', '');
        setValue('estado', '');
        setValue('numero', '');
        setValue('complemento', '');
      });
  }

  return (
    <div className="mt-10">
      {erroCep && <span className="flex justify-center"id='erro'>{erroCep}</span>}
      <form className="flex flex-wrap justify-between w-full">
        <input
          type="text"
          className="bg-gray-200 w-full rounded-full px-4 py-2 my-2"
          placeholder="CEP"
          onBlur={checkCEP}
        />
        <input
          type="text"
          className="bg-gray-200 outline-none w-full rounded-full px-4 py-2 my-2"
          placeholder="Endereço"
          {...register('endereco')}
          readOnly
        />
        <input
          type="text"
          className="bg-gray-200 w-1/4 rounded-full px-4 py-2 my-2"
          placeholder="Numero"
          {...register('numero')}
          disabled={!formAvailable}
        />
        <input
          type="text"
          className="bg-gray-200 outline-none w-3/5 rounded-full px-4 py-2 my-2"
          placeholder="Bairro"
          {...register('bairro')}
          readOnly
        />
        <input
          type="text"
          className="bg-gray-200 w-full rounded-full px-4 py-2 my-2"
          placeholder="Complemento"
          {...register('complemento')}
          disabled={!formAvailable}
        />
        <input
          type="text"
          className="bg-gray-200 outline-none w-1/2 rounded-full px-4 py-2 my-2"
          placeholder="Cidade"
          {...register('cidade')}
          readOnly
        />
        <input
          type="text"
          className="bg-gray-200 outline-none w-3/2 rounded-full px-4 py-2 my-2"
          placeholder="Estado"
          {...register('estado')}
          readOnly
        />
      </form>
    </div>
  )
}
