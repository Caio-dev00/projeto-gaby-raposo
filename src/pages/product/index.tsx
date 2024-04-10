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


export function ProductDetail() {
  const location = useLocation()
  const productId = new URLSearchParams(location.search).get("id")
  const [product, setProduct] = useState<productProps | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [obeservation, setObservation] = useState("")

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

  const handleColorSelect = (index: number) => {
    setSelectedColorIndex(index);
  };

  const incrementQuantity = () => {
    // Converte o valor de storage para um número antes de comparar
    const stockQuantity = parseInt(product?.storage || "0");

    // Incrementa a quantidade apenas se ainda houver estoque disponível
    if (!isNaN(stockQuantity) && quantity < stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    // Converte o valor de storage para um número antes de comparar
    const stockQuantity = parseInt(product?.storage || "0");

    // Decrementa a quantidade apenas se a quantidade atual for maior que 1
    if (!isNaN(stockQuantity) && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleObservationsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const observations = event.target.value;
    setObservation(observations)
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
    setIsModalOpen(false);
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
                <p>{product.description}</p>
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
                <p>{product.description}</p>
              </div>
            </div>
          )}
          <div className="flex flex-col md:ml-8 w-full md:w-80">
            <div className="uppercase w-full h-full">
              <>
                <h1 className="font-semibold text-[20px] text-gray-500">{product.name}</h1>
                <h2 className="text-[32px] font-bold text-vinho-principal">R${product.price}</h2>
                <hr className="mt-[25px] w-60" />
                <h3 className="font-bold mt-6">Tamanhos</h3>
              </>
              <div className="flex flex-row gap-2 uppercase font-semibold">
                <select className="w-full max-w-50 h-10 border-0 border-black text-black bg-gray-200 py-1 rounded-md mb-2">
                  {product.sizes.map((size, index) => (
                    <option key={index} value={size}>
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
                      onClick={() => handleColorSelect(index)}
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
                <button className="font-bold" onClick={incrementQuantity} disabled={quantity >= parseInt(product.storage || "0")}>
                  +
                </button>
              </div>
              <div className="flex flex-col my-6">
                <span className="uppercase text-sm font-bold"> Observações do Pedido</span>
                <textarea
                  className="w-full h-20 bg-salmon border-[1px] rounded-lg pb-12 pl-1 text-sm font-medium"
                  onChange={() => handleObservationsChange}
                />

              </div>
              <div className="my-6">
                <button className="uppercase w-full justify-center items-center mb-0 mt font-semibold text-white text-[14px] rounded-md h-[32px] bg-wine-black">
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
