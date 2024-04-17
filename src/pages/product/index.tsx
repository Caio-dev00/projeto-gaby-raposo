import { ChangeEvent, useEffect, useState } from "react"

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from "react-modal";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";

import { Container } from "../../components/container"
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { productProps } from "../dashboard/new";
import { useCart } from "../../contexts/cartContext";

export function ProductDetail() {
  const { addToCart, cart } = useCart();
  const location = useLocation()
  const productId = new URLSearchParams(location.search).get("id")

  const [product, setProduct] = useState<productProps | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [observation, setObservation] = useState("");

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [defaultSize, setDefaultSize] = useState<string>("Selecione o Tamanho");


  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;

      try {
        const productDoc = await getDoc(doc(db, "Produtos", productId))
        if (productDoc.exists()) {
          const productData = productDoc.data();
          if (productData) {
            const productCompleto: productProps = {
              id: productDoc.id,
              name: productData.name,
              owner: productData.owner,
              categoria: productData.categoria,
              colors: productData.colors,
              sizes: productData.sizes,
              status: productData.status,
              storage: productData.storage,
              price: productData.price,
              description: productData.description,
              image: productData.images,
              colorImage: productData.colorImage,
            }
            setProduct(productCompleto)
          }
        } else {
          console.log("Produto não encontrado")
        }
      } catch (error) {
        console.log("Error ao buscar produto")
      }
    }
    fetchProduct()
  }, [productId])

  const handleColorSelect = (color: string, index: number) => {
    setSelectedColor(color);
    setSelectedColorIndex(index);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setDefaultSize(size); // Atualiza o valor padrão do select de tamanho
  };


  const handleObservationsChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const observations = event.target.value;
    setObservation(observations);
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
    setIsModalOpen(false);
  };

  const incrementQuantity = () => {
    const stockQuantity = parseInt(product?.storage || "0");
    if (!isNaN(stockQuantity) && quantity < stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {


    if (product && selectedColor && selectedSize) {
      const price = parseFloat(product.price.replace(',', '.'));
      const totalPrice = (price * quantity).toFixed(2);

      const existingProductIndex = cart.findIndex(item =>
        item.id === product.id && // Verifica se o ID do produto é o mesmo
        item.size === selectedSize && // Verifica se o tamanho é o mesmo
        item.selectedColorName === selectedColor // Verifica se a cor selecionada é a mesma
      );

      if (existingProductIndex !== -1) {
        // Se o produto já existe no carrinho, não faz nada ou mostra uma mensagem para o usuário
        console.log("Produto já existe no carrinho.");
        return;
      }
  
      // Se não existe um produto com as mesmas propriedades, adiciona ao carrinho
      const colorImageItems = selectedColorIndex !== null ? [{
        uid: product.colorImage[selectedColorIndex].name,
        previewUrl: product.colorImage[selectedColorIndex].imageUrl,
        url: product.colorImage[selectedColorIndex].imageUrl,
        name: product.colorImage[selectedColorIndex].name,
        imageUrl: product.colorImage[selectedColorIndex].imageUrl,
      }] : [];
  
      addToCart({
        id: product.id,
        name: product.name,
        size: selectedSize,
        image: product.image,
        price: parseFloat(totalPrice),
        colorImage: colorImageItems,
        quantidade: quantity.toString(),
        observation: observation,
        selectedColorIndex: selectedColorIndex !== null ? selectedColorIndex : undefined,
        selectedColorName: selectedColor,
        variation: quantity.toString()
      }, selectedColorIndex !== null ? selectedColorIndex : undefined,
        selectedColor);
        
      // Limpa os campos depois de adicionar ao carrinho
      setObservation('');
      setSelectedColor(null);
      setSelectedColorIndex(null);
      setSelectedSize(null);
      setQuantity(1);
      setDefaultSize("Selecione o Tamanho");
    }
  };



  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <IoMdArrowBack color="#000" />,
    nextArrow: <IoMdArrowForward color="#000" />,
  };

  const modalStyles = {
    content: "modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-md outline-none overflow-hidden z-50",
    overlay: "overlay fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg flex justify-center items-center",
  };

  return (
    <Container>
      {product && (
        <div className="flex flex-col md:flex-row justify-center mt-20 w-full">
          {product.image.length === 1 ? (
            <div className="md:w-[600px] md:mr-8">
              <img src={product.image[0].url} alt="" className="h-auto w-full object-contain" />
              <div className="flex flex-col">
                <span className="mt-5 mb-2 max-md:mt-10 text-xl font-semibold">Descrição do Produto:</span>
                <p className="max-md:mb-2">{product.description}</p>
              </div>
            </div>
          ) : (
            <div className="md:w-[600px] md:mr-8">
              <Slider {...sliderSettings}>
                {product.image.map((item, index) => (
                  <div key={index} onClick={() => openModal(index)}>
                    <img src={item.url} alt="" className="h-full w-full object-contain" />
                  </div>
                ))}
              </Slider>
              <div className="flex flex-col">
                <span className="mt-5 mb-2 max-md:mt-10 text-xl font-semibold">Descrição do Produto:</span>
                <p className="max-md:mb-2">{product.description}</p>
              </div>
            </div>
          )}
          <div className="flex flex-col md:ml-8 w-full md:w-80">
            <div className="uppercase w-full h-full">
              <>
                <h1 className="font-semibold text-[20px] text-gray-500">{product.name}</h1>
                <h2 className="text-[32px] font-bold text-vinho-principal ">R${product.price}</h2>
                <hr className="mt-[25px] w-60" />
                <h3 className="font-bold mt-6">Tamanhos</h3>
              </>
              <div className="flex flex-row gap-2 uppercase font-semibold">
                <select value={defaultSize} onChange={(event) => handleSizeSelect(event.target.value)} className="w-full max-w-50 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2">
                  <option disabled value="Selecione o Tamanho">Selecione o Tamanho</option>
                  {product.sizes.map((size, index) => (
                    <option key={index} value={size} >
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <h4 className="font-bold mt-6 ">Cores</h4>
              <div className="flex flex-row gap-2 uppercase font-semibold">
                {product.colorImage.map((color, index) => (
                  <div key={index}>
                    <button
                      className={`w-[30px] h-[30px] rounded-full border border-spacing-1 border-wine-black ${selectedColorIndex === index ? "border-4" : ""
                        }`}
                      onClick={() => handleColorSelect(color.imageUrl, index)}
                    >
                      <img className="rounded-full" src={color.imageUrl} alt={color.name} />
                    </button>
                  </div>
                ))}
              </div>
              <h5 className="font-bold mt-6">Quantidade</h5>
              <div className="flex flex-row mt-2 ml-2 w-[90px] h-[30px] justify-around rounded-[12px] border-solid border-2 border-black">
                <button className="font-bold" onClick={decrementQuantity}>
                  -
                </button>
                <button className="font-bold">{quantity}</button>
                <button className="font-bold" onClick={incrementQuantity}>
                  +
                </button>
              </div>
              <div className="flex flex-col my-6">
                <span className="uppercase text-sm font-bold"> Observações do Pedido</span>
                <textarea
                  className="w-full h-20 bg-salmon border-[1px] rounded-lg pb-12 pl-1 text-sm font-medium"
                  onChange={handleObservationsChange}
                  value={observation}
                />

              </div>
              <div className="my-6">
                <button onClick={handleAddToCart} className="uppercase w-full justify-center items-center mb-0 mt font-semibold text-white text-[14px] rounded-md h-[32px] bg-wine-black">
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className={modalStyles.overlay}
      >
        <div onClick={closeModal} className="w-full h-full flex justify-center items-center">
          {selectedImageIndex !== null && (
            <img
              src={product?.image[selectedImageIndex].previewUrl}
              alt="Product Preview"
              className="w-96"
              onClick={closeModal}
            />
          )}
        </div>
      </Modal>
    </Container>

  )
}