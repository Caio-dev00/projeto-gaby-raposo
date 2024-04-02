import * as React from 'react';
import { useState } from "react";
import { pink } from '@mui/material/colors';
import Radio from '@mui/material/Radio';
import { ChildModal } from '../Modals';

interface EnedecoProps {
  title: string;
  rua: string;
  bairro: string;
  numero: string | number;
  cep: number | string;
}

interface EnedecoProps {
  title: string;
}

export default function DropdownModal({ title, rua, bairro, cep, numero }: EnedecoProps) {
  const [selectedValue, setSelectedValue] = React.useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };
  const [isOpen, setIsOpen] = useState(false)
  const isOpenInput = false

  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });


  return (
    <div className="relative flex flex-col w-full rounded-lg">
      <div>
        <Radio
          onClick={() => setIsOpen((prev) => !prev)}
          {...controlProps('e')}
          sx={{
            color: pink[800],
            '&.Mui-checked': {
              color: pink[600],
            },
          }}
        />
        <span className='font-medium'>{title}</span>
      </div>

      {isOpen && (
        <div className="flex w-full mt-3">
          <div className="mx-3 flex flex-wrap justify-start w-full gap-1">
            <h3 className="font-medium text-base">Rua: {rua}, {numero} - Bairro: {bairro}</h3>
            <h3 className="font-medium text-base">CEP: {cep}</h3>
          </div>
        </div>
      )}

      <div>
        <Radio
          onClick={() => setIsOpen((prev) => !prev)}
          {...controlProps('e')}
          sx={{
            color: pink[800],
            '&.Mui-checked': {
              color: pink[600],
            },
          }}
        />
        <span className="font-medium">Entregar no meu endereço</span>
      </div>


      {isOpenInput && (
        <div className='w-full'>
          <button>
            <ChildModal />
          </button>
        </div>
      )}
    </div>


  )
}
