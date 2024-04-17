import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { FaShoppingBag } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from 'react-router-dom';
import photo from '../../assets/produto.png'

import { BsThreeDotsVertical, BsTranslate } from "react-icons/bs";
import DropdownModal from '../dropdownModal';
import { Fade } from '@mui/material';
import EnderecoUsuario from '../enderecoUsuario';

const style = {
    position: 'absolute',
    top: {
        xs: "20%",
        sm: '20%',
        md: '0%',
        lg: '0%',
        xl: '0%',
    },
    left: {
        xs: "0%",
        sm: '0%',
        md: '30%',
        lg: '50%',
        xl: '60%',
    },
    /*     transform: 'translate(-50%, -50%)', */
    height: {
        xs: "80%",
        sm: '80%',
        md: '100%',
        lg: '100%',
        xl: '100%',
    },
    width: {
        xs: "100%",
        sm: "100%",
        md: "70%",
        lg: "50%",
        xl: "40%",
    },
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    borderRadius: {
        xs: "18px",
        sm: "18px",
        md: "18px",
        lg: "18px",
        xl: "18px",
    },
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
            <button onClick={handleOpen}> + Adicionar meu endereço</button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style }}>
                    <div className='py-2 mb-8'>
                        <h1 className="flex justify-center text-xl font-semibold mb-4">CADASTRAR ENDEREÇO</h1>
                        <EnderecoUsuario />
                    </div>
                    <div className='flex flex-row justify-between'>
                        <button onClick={handleClose} className='flex justify-center py-2 px-4 bg-wine-light text-white font-medium rounded-full'>Voltar</button>
                        <button className='flex justify-center py-2 px-4 bg-wine-light text-white font-medium rounded-full'>Salvar Endereço</button>
                    </div>
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
                    <Box sx={{ ...style }}>
                        <AiOutlineClose onClick={handleClose} className='flex right-4 mr-3 absolute cursor-pointer' size={26} color="#000" />
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
                            rua='Av. Dom Antonio'
                            numero='754'
                            bairro='Vila Rodrigues'
                            cep="19806-172"
                            cidade="Assis-SP"
                        />

                    </Box>
                </Fade>

            </Modal>
        </div>
    );
}