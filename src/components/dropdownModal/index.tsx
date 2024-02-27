import * as React from 'react';
import { useState } from "react";
import { pink } from '@mui/material/colors';

import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"

import { FiSearch } from "react-icons/fi";
import api from '../../services/apiCep.js';

import Input from "../input";
import AutoCep from "../autoCompleteCep";
import Radio from '@mui/material/Radio';

interface EnedecoProps {
    title: string;
    rua: string;
    bairro: string;
    numero: string | number;
    cep: number | string;
}

const schema = z.object({
  cep: z.string().min(8,"DIGITE O CEP"),
  name: z.string().min(4,"O Campo nome é obrigatorio"),
  city: z.string().min(4,"O Campo cidade é obrigatorio"),
  street: z.string().min(4,"O nome da rua é obrigatorio"),
  hood: z.string().min(4,"O bairro é obrigatorio"),
  zap: z.string().min(1,"O telefone é obrigatorio").refine((value)=> /^(\d{10,12})$/.test(value), {
     message: "Numero de telefone invalido"
  }),
  observation: z.string()
})

type FormData = z.infer<typeof schema>;

interface EnedecoProps {
 title: string;
}

export default function DropdownModal({title, rua, bairro, cep, numero}: EnedecoProps){
    const [selectedValue, setSelectedValue] = React.useState('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedValue(event.target.value);
    };
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenInput, setIsOpenInput] = useState(false)
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    
  
    const controlProps = (item: string) => ({
      checked: selectedValue === item,
      onChange: handleChange,
      value: item,
      name: 'color-radio-button-demo',
      inputProps: { 'aria-label': item },
    });

    async function handleSearch(){
      try{
        const response = await api.get(`${schema._input.cep}/json/`)
        setCep(response.data)
      } catch(error) {
        alert('Houve algum erro ao procurar cep')
        return
      }
    }

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

        
      <div>
        <Radio
          onClick={() => setIsOpenInput((prev) => !prev)}
          {...controlProps('d')}
          sx={{
            color: pink[800],
            '&.Mui-checked': {
              color: pink[600],
            },
          }}
        />
        <span>Entregar no meu endereço</span>
      </div>

      {isOpenInput && (
        <div className='w-full'>
            <form>

            </form>
        </div>
      )}
         

        
    </div>
     
    
  )
}
