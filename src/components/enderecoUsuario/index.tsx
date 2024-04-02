

export default function EnderecoUsuario() {
  return (
    <form className="flex flex-wrap justify-between w-full">
      <input className="bg-gray-200 w-full rounded-full px-4 py-2 my-2"
        placeholder="CEP"
      />
      <input className="bg-gray-200 w-full rounded-full px-4 py-2 my-2"
        placeholder="Endereço"
      />
      <input className="bg-gray-200 w-5/12d rounded-full px-4 py-2 my-2"
        placeholder="Numero"
      />
      <input className="bg-gray-200 w-1/2 rounded-full px-4 py-2 my-2"
        placeholder="Bairro"
      />
      <input className="bg-gray-200 w-1/2 rounded-full px-4 py-2 my-2"
        placeholder="Cidade"
      />
      <select className="bg-gray-200 w-5/12 rounded-full px-4 py-2 my-2">
        <option value="">Selecione</option>
        <option value="AC">Acre</option>
        <option value="AL">Alagoas</option>
        <option value="AP">Amapá</option>
        <option value="AM">Amazonas</option>
        <option value="BA">Bahia</option>
        <option value="CE">Ceará</option>
        <option value="DF">Distrito Federal</option>
        <option value="ES">Espirito Santo</option>
        <option value="GO">Goiás</option>
        <option value="MA">Maranhão</option>
        <option value="MS">Mato Grosso do Sul</option>
        <option value="MT">Mato Grosso</option>
        <option value="MG">Minas Gerais</option>
        <option value="PA">Pará</option>
        <option value="PB">Paraíba</option>
        <option value="PR">Paraná</option>
        <option value="PE">Pernambuco</option>
        <option value="PI">Piauí</option>
        <option value="RJ">Rio de Janeiro</option>
        <option value="RN">Rio Grande do Norte</option>
        <option value="RS">Rio Grande do Sul</option>
        <option value="RO">Rondônia</option>
        <option value="RR">Roraima</option>
        <option value="SC">Santa Catarina</option>
        <option value="SP">São Paulo</option>
        <option value="SE">Sergipe</option>
        <option value="TO">Tocantins</option>
      </select>
      <input className="bg-gray-200 w-full rounded-full px-4 py-2 my-2"
        placeholder="Complemento"
      />
    </form>
  )
}
