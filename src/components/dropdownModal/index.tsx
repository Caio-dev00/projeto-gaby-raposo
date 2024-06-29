import * as React from 'react';
import { useState } from "react";
import { pink } from '@mui/material/colors';
import Radio from '@mui/material/Radio';
import { ChildModal } from '../Modals';


interface EnderecoProps {
  title1: string;
  title2: string;
  rua: string;
  bairro: string;
  numero: string | number;
  cep: number | string;
  setDeliveryOption: React.Dispatch<React.SetStateAction<string>>;
  selectedOption: string;
  clientName: string;
  setClientName: React.Dispatch<React.SetStateAction<string>>;
}

export default function DropdownModal({ title1, title2, rua, bairro, cep, numero, setDeliveryOption, selectedOption, clientName, setClientName  }: EnderecoProps) {
  const [selectedValue, setSelectedValue] = React.useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenInput, setIsOpenInput] = useState(false);

  React.useEffect(() => {
    if (selectedOption === '') {
      setDeliveryOption('');
    }
  }, [selectedOption, setDeliveryOption]);

  const handleChangeOption1 = () => {
    setIsOpen((prev) => !prev);
    setIsOpenInput(false)
    setSelectedValue(selectedOption === 'Retirar na loja' ? '' : 'Retirar na loja');
    setDeliveryOption(selectedOption === 'Retirar na loja' ? '' : 'Retirar na loja');
  };
  const handleChangeOption2 = () => {
    setIsOpenInput((prev) => !prev);
    setIsOpen(false)
    setSelectedValue(selectedOption === 'Entregar no meu endereço' ? '' : 'Entregar no meu endereço');
    setDeliveryOption(selectedOption === 'Entregar no meu endereço' ? '' : 'Entregar no meu endereço');
  };


  return (
    <div className="relative flex flex-col w-full rounded-lg">
      <div>
        <Radio
          onClick={handleChangeOption1}
          checked={selectedValue === 'Retirar na loja'}
          sx={{
            color: selectedValue === 'Retirar na loja' ? pink[600] : pink[800], // Define a cor selecionada
            '&.Mui-checked': {
              color: pink[600],
            },
          }}
        />
        <span>{title1}</span>

        {selectedOption === "Retirar na loja" && (
        <div className="flex flex-col w-full my-2">
          <label className="mb-2 font-semibold">Nome Completo:</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="p-2 border rounded-md"
            placeholder='Digite seu nome completo'
          />
        </div>
      )}

        {isOpen && (
          <div className="flex w-full ml-2">
            <div className="flex flex-col w-full justify-start gap-1">
              <h3 className="font-semibold text-lg">Endereço:</h3>
              <h3 className="font-medium text-base">{rua}, {numero} - {bairro}, {cep}</h3>
              <button className="flex justify-start items-center my-2">
                <a className="font-semibold bg-inherit text-wine-light text-sm border-2 border-wine-light py-2 px-3 rounded-xl" href='https://maps.app.goo.gl/pti59njtouBACcqr7' target='_blank'>Ver no mapa</a>
              </button>
            </div>
          </div>
        )}
      </div>
      

      <div>
        <Radio
          onClick={handleChangeOption2}
          checked={selectedValue === 'Entregar no meu endereço'}
          sx={{
            color: selectedValue === 'Entregar no meu endereço' ? pink[600] : pink[800], // Define a cor selecionada
            '&.Mui-checked': {
              color: pink[600],
            },
          }}
        />
        <span>{title2}</span>
        <div className='flex ml-10'>
          {isOpenInput && (
            <button className='flex justify-center w-72 bg-wine-black py-2 rounded-full text-white font-medium text-base'>
              {/* Passa a função setEndereco para ChildModal para atualizar o estado de endereço */}
              <ChildModal/>
            </button>
          )}
        </div>
      </div>
     
    </div>
  );
}
