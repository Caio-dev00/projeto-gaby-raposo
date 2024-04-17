import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FaShoppingBag, FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from 'react-router-dom';

import DropdownModal from '../dropdownModal';
import { Fade } from '@mui/material';
import EnderecoUsuario from '../enderecoUsuario';

import { useCart } from '../../contexts/cartContext';
import { useNavigate } from 'react-router-dom';

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
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = React.useState(0)

  React.useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      cart.forEach(item => {
        const quantidade = parseFloat(item.quantidade)
        total += item.price * quantidade;
      });
      setTotalPrice(total)
    }
    calculateTotalPrice()
  }, [cart])

  function handleClickNavigate(){
    navigate("/")
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  console.log("Cart Data:", cart);

  return (
    <div>
      <button onClick={handleOpen}>
      {cart.length >= 1 && (
        <div className='absolute bg-wine-light w-5 h-5 mt-4 ml-[-5px] flex justify-center items-center rounded-full'>
          <span className='text-white text-sm font-semibold'>{cart.length}</span>
        </div>
      )}
        <FaShoppingBag size={26} color="#000" />
        </button>
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
          {cart.map((item) => (
            <div key={item.id} className='flex flex-row justify-between items-center w-full my-5 '>
            <div className='flex justify-between w-full items-center'>
              <div className='flex items-center'>
              <button className='w-[40px] h-[40px] max-md:w-[40px] max-md:h-[40px] max-md:mr-2 rounded-full'>
                <Link onClick={() => setOpen(false)} to={`/product/details?id=${item.id}`}>
                    <img className='rounded-full' src={item.image[0].url} alt="" />
                </Link>     
            </button>
            <span className='font-semibold ml-2'>{item.quantidade}x</span>
            <span className='font-semibold ml-2 max-md:text-xs'>{item.name} </span>
            <span className='font-semibold ml-2 text-xs max-md:text-xs'>({item.colorImage[0].name} - {item.size})</span>
              </div>
              <div className='flex items-center justify-center'>
              <span className='font-bold max-md:mx-1 text-green-600 mr-2'>R${item.price.toFixed(2)}</span>
              <button onClick={() => removeFromCart(item.id, item.variation)} className='hover:scale-110'>
                  <FaTrash />
              </button>
              </div>
            </div>
          

      </div>
          ))}
          {cart.length >= 1 ? (
            <h1 className='text-center font-bold mt-5'>TOTAL A PAGAR: R$ <span className='text-green-600 text-lg'>{totalPrice.toFixed(2)}</span></h1>
          ) : (
            <h1 className='text-center mt-5'>Adicione produtos ao seu carrinho</h1>
          )}

            <button className='w-full flex justify-center items-center my-8'>
                <span onClick={handleClickNavigate} className='font-semibold bg-wine-light text-white text-[0.8rem] p-2 rounded-full w-[220px] hover:bg-wine-black hover:scale-105 duration-300'>
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
            cidade="Assis-SP"
            />
        </Box>
      </Fade>
       
      </Modal>
    </div>
  );
}