import { useForm } from "react-hook-form";


export default function EnderecoUsuario() {

  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = (e) => {
    console.log(e);
  }

    const checkCEP = (e) => {
    const cep = e.target.value.replace(/D/g, '');
    console.log(cep);
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json()).then(data => {
        console.log(data);
        setValue('endereco', data.logradouro);
        setValue('bairro', data.bairro);
        setValue('cidade', data.localidade);
        setValue('estado', data.uf);
      })
  }

  return (
    <div className="mt-10">
      <span 
        id="erro"
        ></span>
      <form className="flex flex-wrap justify-between w-full">
        <input
          type="text"
          className="bg-gray-200 w-full rounded-full px-4 py-2 my-2"
          placeholder="CEP"
          onBlur={checkCEP}
        />
        <input
          type="text"
          className="bg-gray-200 w-full rounded-full px-4 py-2 my-2"
          placeholder="Endereço"
          {...register('endereco')}
        />
        <input
          type="text"
          className="bg-gray-200 w-1/4 rounded-full px-4 py-2 my-2"
          placeholder="Numero"
          {...register('numero')}
        />
        <input
          type="text"
          className="bg-gray-200 w-3/5 rounded-full px-4 py-2 my-2"
          placeholder="Bairro"
          {...register('bairro')}
        />
        <input
          type="text"
          className="bg-gray-200 w-full rounded-full px-4 py-2 my-2"
          placeholder="Complemento"
        />
        <input
          type="text"
          className="bg-gray-200 w-1/2 rounded-full px-4 py-2 my-2"
          placeholder="Cidade"
          {...register('cidade')}
        />
        <input
          type="text"
          className="bg-gray-200 w-3/2 rounded-full px-4 py-2 my-2"
          placeholder="Estado"
          {...register('estado')}
        />
      </form>
    </div>
  )
}
