import { useState } from "react";
import { useCart } from "../../contexts/cartContext";

interface CepData {
  logradouro: string;
  bairro: string;
  name: string;
  localidade: string;
  uf: string;
  erro: boolean;
  numero: string | boolean;
  complemento: string;
}

export default function EnderecoUsuario({ onClose }: { onClose: () => void }) {
  const [cep, setCep] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [endereco, setEnderecoLocal] = useState<string>('');
  const [bairro, setBairro] = useState<string>('');
  const [numero, setNumero] = useState<string>('');
  const [cidade, setCidade] = useState<string>('');
  const [estado, setEstado] = useState<string>('');
  const [complemento, setComplemento] = useState<string>('');
  const [erroCep, setErroCep] = useState<string | null>(null);
  const [formAvailable, setFormAvailable] = useState<boolean>(false);

  const { updateAddress } = useCart();

  const salvarEndereco = () => {
    const enderecoSalvo = {
      rua: endereco,
      bairro: bairro,
      numero: numero,
      cep: cep,
      name: name,
      cidade: cidade,
      complemento: complemento,
      estado: estado
    };
    updateAddress(enderecoSalvo);
    onClose(); // Fechar o modal após salvar o endereço
  };

  const checkCEP = (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/D/g, '');

    if (cep.trim() === '' || cep.length !== 8 || isNaN(parseInt(cep))) {
      setErroCep('Digite um CEP válido');
      setFormAvailable(false);
      setName('')
      setBairro('');
      setCidade('');
      setEstado('');
      setNumero('');
      setComplemento('');
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
        if (data.erro) {
          throw new Error('CEP não encontrado');
        }
        setEnderecoLocal(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
        setEstado(data.uf);
        setErroCep(null);
        setFormAvailable(true);
      })
      .catch((error) => {
        console.error('Erro ao buscar CEP:', error);
        setErroCep('CEP não encontrado');
        setFormAvailable(false);
        setEnderecoLocal('');
        setName('')
        setBairro('');
        setCidade('');
        setEstado('');
        setNumero('');
        setComplemento('');
      });
  }

  return (
    <div className="mt-10">
      {erroCep && <span className="flex justify-center" id='erro'>{erroCep}</span>}
      <form onSubmit={(e) => { e.preventDefault(); salvarEndereco(); }} className="flex flex-wrap justify-between w-full">
        <input
          type="text"
          className="bg-gray-200 w-full rounded-full px-4 py-2 my-2"
          placeholder="Nome Completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="bg-gray-200 w-full rounded-full px-4 py-2 my-2"
          placeholder="CEP"
          onBlur={(e) => {
            setCep(e.target.value);
            checkCEP(e);
          }}
        />
        <input
          type="text"
          className="bg-gray-200 outline-none w-full rounded-full px-4 py-2 my-2"
          placeholder="Endereço"
          value={endereco}
          onChange={(e) => setEnderecoLocal(e.target.value)}
          readOnly
        />
        <input
          type="text"
          className="bg-gray-200 w-1/4 rounded-full px-4 py-2 my-2"
          placeholder="Numero"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          disabled={!formAvailable}
        />
        <input
          type="text"
          className="bg-gray-200 outline-none w-3/5 rounded-full px-4 py-2 my-2"
          placeholder="Bairro"
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          readOnly
        />
        <input
          type="text"
          className="bg-gray-200 w-full rounded-full px-4 py-2 my-2"
          placeholder="Complemento"
          value={complemento}
          onChange={(e) => setComplemento(e.target.value)}
          disabled={!formAvailable}
        />
        <input
          type="text"
          className="bg-gray-200 outline-none w-1/2 rounded-full px-4 py-2 my-2"
          placeholder="Cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          readOnly
        />
        <input
          type="text"
          className="bg-gray-200 outline-none w-3/2 rounded-full px-4 py-2 my-2"
          placeholder="Estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          readOnly
        />
        <button type="submit" className='py-2 px-4 bg-wine-light text-white font-semibold rounded-full'>Salvar Endereço</button>
      </form>
    </div>
  )
}
