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
    if (product && selectedSize && selectedColor) {
        // Encontre a variação selecionada e a cor correspondente
        const selectedVariation = product.variations.find(v => v.size === selectedSize);
        const selectedColorObj = selectedVariation?.colors.find(c => c.url === selectedColor);

        // Use a URL da primeira imagem do produto como a imagem principal
        const productImageUrl = product.image.length > 0 ? product.image[0].url : '';

        // Nome e imagem da cor selecionada, se disponível
        const selectedColorName = selectedColorObj ? selectedColorObj.name : selectedColor;
        const selectedColorImageUrl = selectedColorObj ? selectedColorObj.imageUrl : '';

        // Crie o objeto do produto para adicionar ao carrinho
        const selectedProduct = {
            id: uuidv4(),
            name: product.name,
            price: product.price,
            image: productImageUrl, // A URL da imagem do produto
            size: selectedSize,
            color: {
                name: selectedColorName, // Nome da cor selecionada, mesmo sem imagem
                imageUrl: selectedColorImageUrl, // URL da imagem da cor selecionada (se houver)
            },
            stock: quantity,
            observation: observation,
        };

        console.log(selectedProduct);
        addToCart(selectedProduct);
        toast.success("Produto adicionado ao carrinho com sucesso!");
    } else {
        toast.error("Por favor, selecione o tamanho e a cor antes de adicionar ao carrinho.");
    }
};

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setDefaultSize(size);
    setSelectedColorIndex(null);
    setSelectedColor(null);

    const colors = getAvailableColors(product?.variations || [], size);
    setAvailableColors(colors);

    if (selectedColor) {
      const selectedVariation = product?.variations.find(variation => variation.size === size);
      if (selectedVariation) {
        const selectedColorData = selectedVariation.colors.find(c => c.name === selectedColor);
        if (selectedColorData) {
          setQuantity(1);
        }
      }
    }
  };

  const handleColorSelect = (colorName: string, index: number) => {
    setSelectedColor(colorName);
    setSelectedColorIndex(index);
    if (!selectedSize) return;

    let selectedStock = 0;

    product?.variations.forEach(variation => {
      if (variation.size === selectedSize) {
        const selectedColorData = variation.colors.find(c => c.name === colorName);
        if (selectedColorData) {
          selectedStock = selectedColorData.estoque || 0;
          setSelectedColorName(selectedColorData.name);
          console.log(selectedColorName)
        }
      }
    });

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
                    <div className="flex items-center justify-center h-[500px] max-h-[500px] w-[305px] max-md:h-[500px] max-w-full overflow-hidden" key={index} onClick={() => openModal(index)}>
                      <img src={item.url} alt={item.name} className="object-contain w-full h-full rounded-ss-lg rounded-se-lg" />
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
                  {availableColors.length > 0 ? (
                    availableColors.map((color, index) => (
                      <div key={index}>
                        {color.imageUrl ? (
                          <button
                            className={`w-[30px] h-[30px] rounded-full border border-spacing-1 border-wine-black ${selectedColorIndex === index ? "border-4" : ""
                              }`}
                            onClick={() => handleColorSelect(color.imageUrl, index)}
                          >
                            <img className="rounded-full w-full h-full" src={color.imageUrl} alt={color.name} />
                          </button>
                        ) : (
                          <select
                          value={selectedColor || ''}
                          onChange={(e) => handleColorSelect(e.target.value, index)}
                          className="w-full max-w-50 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2"
                        >
                          <option value="" disabled>Selecione a cor</option>
                          {availableColors.map((color, index) => (
                            <option key={index} value={color.name}>
                              {color.name}
                            </option>
                          ))}
                        </select>
                        )}
                      </div>
                    ))
                  ) : (
                    <div></div>
                  )}
                </div>
                <h4 className="font-bold mt-6">Quantidade</h4>
                <div className="flex flex-row items-center">
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
                </div>
                <h4 className="font-bold mt-6">Observações</h4>
                <textarea
                  value={observation}
                  onChange={handleObservationsChange}
                  className="w-full h-24 border border-gray-300 rounded-md p-2"
                ></textarea>
                <button onClick={handleAddToCart} className="uppercase w-full justify-center items-center mb-0 mt font-semibold text-white text-[14px] rounded-md h-[32px] bg-wine-black">
                  Adicionar ao Carrinho
                </button>
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
                className="w-[600px] p-10"
                onClick={closeModal}
              />
            )}
          </div>
        </Modal>
      </Container>
      <div id="footer"></div>
      <Footer />
    </>
  );
}