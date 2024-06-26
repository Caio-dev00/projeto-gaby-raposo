import { ChangeEvent, useEffect, useState } from "react"

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from "react-modal";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";

import { Container } from "../../components/container"
import { useLocation } from 'react-router-dom';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Color, Variations, productProps } from "../dashboard/new";
import { useCart } from "../../contexts/cartContext";
import { v4 as uuidv4 } from 'uuid';
import Footer from "../../components/Footer";
import toast from "react-hot-toast";


const getUniqueSizes = (variations: Variations[]) => {
  const sizes = variations.map((variation) => variation.size);
  return [...new Set(sizes)];
};

// Função para obter cores disponíveis com base no tamanho selecionado
const getAvailableColors = (variations: Variations[], selectedSize: string) => {
  const colors: Color[] = [];
  variations.forEach((variation) => {
    if (variation.size === selectedSize) {
      variation.colors.forEach((color) => {
        if (!colors.some((c) => c.name === color.name)) {
          colors.push(color);
        }
      });
    }
  });
  return colors;
};

export function ProductDetail() {
  const { addToCart } = useCart()
  const location = useLocation()
  const productId = new URLSearchParams(location.search).get("id")

  const [product, setProduct] = useState<productProps | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [colorStock, setColorStock] = useState<number>(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [selectedColorName, setSelectedColorName] = useState<string | null>(null);
  const [observation, setObservation] = useState("");

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [defaultSize, setDefaultSize] = useState<string>("Selecione o Tamanho");
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<Color[]>([]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedColor]);
  
  useEffect(() => {
    if (product) {
      const uniqueSizes = getUniqueSizes(product.variations);
      setAvailableSizes(uniqueSizes);
    }
  }, [product]);

  useEffect(() => {
    if (!productId) return;

    const productDocRef = doc(db, "Produtos", productId);
    
    const unsubscribe = onSnapshot(productDocRef, (productDoc) => {
      if (productDoc.exists()) {
        const productData = productDoc.data();
        if (productData) {
          const productCompleto: productProps = {
            id: productDoc.id,
            name: productData.name,
            owner: productData.owner,
            categoria: productData.categoria,
            price: productData.price,
            description: productData.description,
            image: productData.images,
            status: productData.status,
            size: productData.size,
            variations: productData.variations
          };
          setProduct(productCompleto);
        }
      } else {
        console.log("Produto não encontrado");
      }
    }, (error) => {
      console.error("Erro ao buscar produto:", error);
    });

    // Limpa o listener ao desmontar o componente
    return () => unsubscribe();

  }, [productId]);

  const handleAddToCart = () => {
    if (product && selectedSize && selectedColor && product.image && product.image.length > 0) {

      const selectedProduct = {
        id: uuidv4(),
        name: product.name,
        price: product.price,
        image: product.image[0].url,
        size: selectedSize,
        color: {
          name: selectedColorName || '', 
          imageUrl: selectedColor,
        },
        stock: quantity,
        observation: observation,
      };
  
      addToCart(selectedProduct);
    } else {
      toast.error("Por favor, selecione o tamanho e a cor antes de adicionar ao carrinho.");
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setDefaultSize(size);
    setSelectedColorIndex(null);
    setSelectedColor(null)

    const colors = getAvailableColors(product?.variations || [], size);
    setAvailableColors(colors);

    const selectedVariation = product?.variations.find(variation => variation.size === size);
    if (selectedVariation && selectedColor) {

      const selectedColorData = selectedVariation.colors.find(c => c.imageUrl === selectedColor);
      if (selectedColorData) {

        setQuantity(1);
      }
    }
  };

  const handleColorSelect = async (color: string, index: number) => {
    setSelectedColor(color);
    setSelectedColorIndex(index);
    if (!selectedSize) return;
  
    let selectedStock = 0;
  
    product?.variations.forEach(variation => {
      if (variation.size === selectedSize) {
        const selectedColorData = variation.colors.find(c => c.imageUrl === color);
        if (selectedColorData) {
          selectedStock = selectedColorData.estoque || 0;
          setSelectedColorName(selectedColorData.name);
        }
      }
    });
  
    // Atualize o estoque com base na quantidade disponível para a cor selecionada
    setColorStock(selectedStock);
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
    if (selectedColor === null) return;
  
    // Atualize a quantidade apenas se ela for menor que o estoque disponível
    if (quantity < colorStock) {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (selectedColor === null) return;
  
    // Atualize a quantidade apenas se ela for maior que 1
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
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
    <>
    <Container>
      {product && (
        <div className="flex flex-col md:flex-row justify-center mt-20 w-full">
          {product.image.length === 1 ? (
            <div className="md:w-[600px] h-full md:mr-8 ">
              <img src={product.image[0].url} alt={product.name} className="rounded-md h-[600px] max-md:h-[400px] w-full object-contain" />
              <div className="flex flex-col">
                <span className="mt-5 mb-2 max-md:mt-10 text-xl font-semibold">Descrição do Produto:</span>
                <p className="max-md:mb-2">{product.description}</p>
              </div>
            </div>
          ) : (
            <div className="md:w-[600px] md:mr-8">
              <Slider {...sliderSettings}>
                {product.image.map((item, index) => (
                  <div className="md:w-[600px] max-h-[600px] md:mr-8" key={index} onClick={() => openModal(index)}>
                    <img src={item.url} alt={item.name} className="rounded-md h-full w-full object-cover" />
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
                <h2 className="text-[32px] font-bold text-vinho-principal text-wine-light">R${product.price}</h2>
                <hr className="mt-[25px] w-60" />
                <h3 className="font-bold mt-6">Tamanhos</h3>
              </>
              <div className="flex flex-row gap-2 uppercase font-semibold">
                <select value={defaultSize} onChange={(event) => handleSizeSelect(event.target.value)} className="w-full max-w-50 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2">
                  <option disabled value="Selecione o Tamanho">Selecione o Tamanho</option>
                  {availableSizes.map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              {selectedSize !== null ? (
                <h4 className="font-bold mt-6 ">Cores</h4>
              ) : (
                <div></div>
              )}
              <div className="flex flex-row gap-2 uppercase font-semibold">
                {availableColors.map((color, index) => (
                  <div key={index}>
                    <button
                      className={`w-[30px] h-[30px] rounded-full border border-spacing-1 border-wine-black ${selectedColorIndex === index ? "border-4" : ""
                        }`}
                      onClick={() => handleColorSelect(color.imageUrl, index)}
                    >
                      <img className="rounded-full w-full h-full" src={color.imageUrl} alt={color.name} />
                    </button>
                  </div>
                ))}
              </div>
              {selectedColor !== null ? (
                <h5 className="font-bold mt-6">Quantidade</h5>
              ) : (
                <div></div>
              )}
              {selectedColor !== null ? (
                <div className="flex flex-row mt-2 ml-2 w-[90px] h-[30px] justify-around rounded-[12px] border-solid border-2 border-black">
                  <>
                    <button className="font-bold" onClick={decrementQuantity}>
                      -
                    </button>
                    <button className="font-bold">{quantity}</button>
                    <button className="font-bold" onClick={incrementQuantity}>
                      +
                    </button>
                  </>

                </div>
              ) : (
                <div></div>
              )}
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
              src={product?.image[selectedImageIndex].url}
              alt="Product Preview"
              className="w-96"
              onClick={closeModal}
            />
          )}
        </div>
      </Modal>
    </Container>
    <div id="footer"></div>
    <Footer/>
    </>

  )
}
