import * as React from 'react';
import { useState } from "react";
import { pink } from '@mui/material/colors';
import Radio from '@mui/material/Radio';
import { ChildModal } from '../Modals';

interface EnedecoProps {
  title1: string;
  title2: string;
  rua: string;
  bairro: string;
  numero: string | number;
  cep: number | string;
}


export default function DropdownModal({ title1, title2, rua, bairro, cep, numero }: EnedecoProps) {
  const [selectedValue, setSelectedValue] = React.useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenInput, setIsOpenInput] = useState(false)


  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });




  return (
    <div className="relative flex flex-col w-fullrounded-lg">
      <div>
        <Radio
          onClick={() => setIsOpen((prev) => !prev)}
          {...controlProps('a')}
          sx={{
            color: pink[800],
            '&.Mui-checked': {
              color: pink[600],
            },
          }}
        />
        <span>{title1}</span>
      </div>

      {isOpen && (
        <div className="flex w-full mt-3">
          <div className="flex flex-col w-full justify-start gap-1">
            <h3 className="">Bairro: {bairro}</h3>
            <h3 className="">CEP: {cep}</h3>
          </div>
          <div className="w-full">
            <h3 className="">Rua: {rua}</h3>
            <h3>Numero: {numero}</h3>
          </div>
        </div>
      )}
      <div>

        <Radio
          onClick={() => setIsOpenInput((prev) => !prev)}
          {...controlProps('b')}
          sx={{
            color: pink[800],
            '&.Mui-checked': {
              color: pink[600],
            },
          }}
        />
        <span>{title2}</span>
        <>
          {isOpenInput && (
            <button className='flex justify-center bg-wine-black p-2 rounded-xl text-white font-semibold'>
              <ChildModal/>
            </button>
          )}
        </>
      </div>
    </div>


  )
}
