import * as React from 'react';
import { useState } from "react";
import { pink } from '@mui/material/colors';
import Radio from '@mui/material/Radio';
import { ChildModal } from '../Modals/index.js';

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

export default function DropdownModal({title, rua, bairro, cep, numero}: EnedecoProps){
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
    

  return(
    <div className="relative flex flex-col w-fullrounded-lg">
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
      <span>{title}</span>
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


      {isOpenInput && (
        <div className='w-full'>
            <button>
                <ChildModal/>
            </button>
        </div>
      )}  
    </div>
     
    
  )
}