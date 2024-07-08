import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FaShoppingBag, FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from 'react-router-dom';

import DropdownModal from '../dropDownModal';
import { Fade } from '@mui/material';
import EnderecoUsuario from '../enderecoUsuario';

import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/cartContext';
import toast from 'react-hot-toast';

const style = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  top: '50%',
  width: {
    xs: '100%',
    sm: '80%',
    md: '60%',
    lg: '40%',
    xl: '35%',
  },
  left: {
    xs: '50%',
    sm: '50%',
    md: '50%',
    lg: '50%',
    xl: '50%',
  },
  maxHeight: '90vh',
  minHeight: '75vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '18px',
  p: 4,
};

export function ChildModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <React.Fragment>
      <button onClick={handleOpen} className="add-address-button">
        + Adicionar meu endereço
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <div className="py-2 mb-8">
            <h1 className="flex justify-center text-xl font-semibold mb-4">
              CADASTRAR ENDEREÇO
            </h1>
            <EnderecoUsuario onClose={handleClose} />
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function NestedModal() {
  const [open, setOpen] = React.useState(false);
  const { cart, removeFromCart, address, setAddress } = useCart();
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [deliveryOption, setDeliveryOption] = React.useState("");
  const [clientName, setClientName] = React.useState("");

  React.useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      cart.forEach(item => {
        const quantidade = item.stock;
        total += item.price * quantidade;
      });
      setTotalPrice(total);
    };
    calculateTotalPrice();
  }, [cart]);

  const handleClickNavigate = () => {
    navigate("/");
    setOpen(false);
  };

  const resetModalValues = () => {
    setAddress(null);
    setDeliveryOption("");
    setClientName("");
  };

  const handleFinalizarCompra = () => {
    if (!deliveryOption) {
      toast.error("Selecione um modo de entrega");
      return;
    }

    let message = "";
    if (deliveryOption === "Retirar na loja") {
      if (!clientName.trim()) {
        toast.error("Por favor, insira seu nome completo.");
        return;
      }
      message =
        `Olá! sou ${clientName}, gostaria de fazer um pedido para retirar na loja. Aqui está a lista de produtos:\n`;
    } else {
      if (!address) {
        toast.error("Salve um endereço para entrega");
        return;
      }
      message = `Olá! sou ${address.name},  Gostaria de fazer um pedido para entrega no endereço:\n: ${address.rua}, ${address.numero}, ${address.bairro}, ${address.cidade}, ${address.estado}, ${address.cep}\n Aqui está a lista de produtos:\n`;
    }

    cart.forEach((item) => {
      message += `${item.stock} - ${item.name} (${item.color.name} - ${item.size}) - R$ ${item.price} - Observação: ${item.observation}\n`;
    });

    message += `\nTotal a pagar: R$ ${totalPrice.toFixed(2)}`;

    const phoneNumber = "5518996812002";
    const encodedMessage = encodeURIComponent(message);
    const encodedPhoneNumber = encodeURIComponent(phoneNumber);
    const whatsappURL = `https://wa.me/${encodedPhoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL);
    setDeliveryOption("");
    setClientName("")
    resetModalValues();
    setOpen(false)
  };

  const handleDeleteAddress = () => setAddress(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetModalValues();
  }

  return (
    <div>
      <button onClick={handleOpen} className="cart-button">
        {cart.length >= 1 && (
          <div className="absolute bg-wine-light w-5 h-5 mt-4 ml-[-5px] flex justify-center items-center rounded-full">
            <span className="text-white text-sm font-semibold">{cart.length}</span>
          </div>
        )}
        <FaShoppingBag size={26} color="#000" />
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description">
        <Fade in={open} timeout={300}>
          <Box sx={{ ...style }}>
            <AiOutlineClose
              onClick={handleClose}
              className="flex right-1 top-4 mr-3 absolute cursor-pointer"
              size={26}
              color="#000"
            />
            <div className="flex flex-col justify-center items-center my-5">
              <h1 className="font-black text-wine-light text-[1.5rem]">
                CONFIRME SEU PEDIDO:
              </h1>
            </div>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-row justify-between items-center w-full my-5">
                <div className="flex justify-between w-full items-center">
                  <div className="flex items-center">
                    <Link
                      className="w-[40px] h-[40px] max-md:w-[40px] max-md:h-[40px] max-md:mr-2 rounded-full"
                      onClick={() => setOpen(false)}
                      to={`/product/details?id=${item.id}`}
                    >
                      <img className="rounded-full" src={item.image} alt="" />
                    </Link>
                    <span className="font-semibold ml-2">{item.stock}x</span>
                    <span className="font-semibold ml-2 max-md:text-xs">
                      {item.name}{" "}
                    </span>
                    <span className="font-semibold ml-2 text-xs max-md:text-xs">
                      ({item.color.name} - {item.size})
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="font-bold max-md:mx-1 text-green-600 mr-2">
                      R${item.price}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="hover:scale-110"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {cart.length >= 1 ? (
              <h1 className="text-center font-bold mt-5">
                TOTAL A PAGAR: R$
                <span className="text-green-600 text-lg pl-1">
                  {totalPrice.toFixed(2)}
                </span>
              </h1>
            ) : (
              <h1 className="text-center mt-5">
                Adicione produtos ao seu carrinho
              </h1>
            )}

            <div className="w-full flex justify-center items-center my-8">
              <button
                onClick={handleClickNavigate}
                className="font-semibold bg-wine-light text-white text-[0.8rem] p-2 rounded-full w-[220px] hover:bg-wine-black hover:scale-105 duration-300"
              >
                CONTINUAR COMPRANDO
              </button>
            </div>

            <hr className="w-full bg-wine-light border-wine-light my-8"></hr>



            <DropdownModal
              title1="Retirar na Loja"
              title2="Entregar no meu endereço"
              rua="Av. Dom Antônio"
              bairro="Vila Rodrigues"
              numero="754"
              cep="19806-172 - Assis-SP"
              setDeliveryOption={setDeliveryOption}
              selectedOption={deliveryOption}
              clientName={clientName}
              setClientName={setClientName}
            />

            {address && (
              <div className="flex flex-col w-full mt-7 bg-wine-light rounded-md p-2">
                <h2 className="text-white font-semibold mb-2">Endereço Salvo:</h2>
                <div className="flex justify-between mb-2">
                  <p className="text-white">{address?.rua}</p>
                  <p className="text-white">Numero: {address?.numero}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-white">Cidade: {address?.cidade}</p>
                  <p className="text-white">Bairro: {address?.bairro}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-white">Estado: {address?.estado}</p>
                  {address.complemento && (
                    <p className="text-white">Complemento: {address?.complemento}</p>
                  )}
                </div>
                <button
                  onClick={handleDeleteAddress}
                  className="text-white font-semibold"
                >
                  Deletar Endereço
                </button>
              </div>
            )}

            {cart.length >= 1 && (
              <div className="w-full flex justify-center">
                <button
                  onClick={handleFinalizarCompra}
                  className="w-full flex justify-center items-center my-8 font-semibold bg-wine-light text-white text-[0.8rem] p-2 rounded-full max-w-[220px] hover:bg-wine-black hover:scale-105 duration-300"
                >
                  FINALIZAR COMPRA
                </button>
              </div>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
