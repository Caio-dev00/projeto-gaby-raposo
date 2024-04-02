import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { FaShoppingBag } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from 'react-router-dom';
import photo from '../../assets/produto.png'

import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownModal from '../dropDownModal';
import { Fade } from '@mui/material';
import EnderecoUsusario from '../enderecoUsuario';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: {
    xs: "100%",
    sm: 'auto',
    md: 'auto',
    lg: 'auto',
    xl: 'auto',
  },
  width: {
    xs: "100%",
    sm: 500,
    md: 550,
    lg: 600,
    xl: 650,
  },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export function ChildModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
    <Button style={{color:"#FFF", padding:"1px"}} onClick={handleOpen}>+ Adicionar meu Endereço</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style}}>
          <h1 className="font-semibold">PREENCHA SEU ENDEREÇO</h1>
          <EnderecoUsusario/>
          <Button onClick={handleClose}>Voltar</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function NestedModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpen}>
        <FaShoppingBag size={26} color="#000" />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
      <Fade in={open}>
      <Box sx={{ ...style}}>
          <AiOutlineClose onClick={handleClose} className='flex right-0 mr-3 absolute cursor-pointer' size={26} color="#000"/>
          <div className='flex flex-col justify-center items-center my-5'>
            <h1 className='font-black text-wine-light text-[1.5rem]'>CONFIRME SEU PEDIDO:</h1>
          </div>
          <div className='flex flex-row justify-between items-center w-full my-5 '>
                <button className='w-[40px] h-[40px] max-md:w-[40px] max-md:h-[40px] rounded-full'>
                    <Link to="/product/:id">
                        <img className='rounded-full' src={photo} alt="" />
                    </Link>     
                </button>
                <span className='font-semibold '>1x - PRODUTO MODELO 1 (preto)</span>
                <span className='font-bold'>R$99,00</span>
                <button>
                    <BsThreeDotsVertical />
                </button>
            </div>

            <div className='flex flex-row justify-between items-center w-full my-5 '>
                <button className='w-[40px] h-[40px] max-md:w-[40px] max-md:h-[40px] rounded-full'>
                    <Link to="/product/:id">
                        <img className='rounded-full' src={photo} alt="" />
                    </Link>     
                </button>
                <span className='font-semibold max-md:text-sm pl-2'>1x - PRODUTO MODELO 1 (preto)</span>
                <span className='font-bold '>R$99,00</span>
                <button>
                    <BsThreeDotsVertical />
                </button>
            </div>

            <button className='w-full flex justify-center items-center my-8'>
                <span className='font-semibold bg-wine-light text-white text-[0.8rem] p-2 rounded-full w-[220px] hover:bg-wine-black hover:scale-105 duration-300'>
                    CONTINUAR COMPRANDO
                </span>
            </button>

            <hr className=' w-full bg-wine-light border-wine-light my-8'></hr>

            <div className='flex flex-col justify-center items-center my-5'>
                <h1 className='font-black text-black text-[1.5rem]'>FRETE:</h1>
            </div>

            <DropdownModal 
            title1='Retirar na Loja'
            title2='Entregar no meu endereço'
            rua='São Judas Tadeu'
            bairro='São Judas'
            numero='139'
            cep="19880-000"
            />
        </Box>
      </Fade>
       
      </Modal>
    </div>
  );
}