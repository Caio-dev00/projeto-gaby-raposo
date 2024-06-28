import { SwiperProps, SwiperSlide } from "swiper/react"
import { Container } from "../../components/container"
import { Slider } from "../../components/slideBanner/Slider"

import Catalogo from "../../components/catalogo"
import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";
import { BannerProps } from "../dashboard/banners"

import { categoryProp } from "../dashboard/categorias"
import { Link } from "react-router-dom"
import Footer from "../../components/Footer"


interface Product {
  category: string;
  size: string[];
}


export function Home() {
  const settings: SwiperProps = {
    spaceBetween: 50,
    slidesPerView: 1,
    navigation: true,
    pagination: {
      clickable: true,
    }
  }

  const settings2: SwiperProps = {
    breakpoints: {
      768: {
        slidesPerView: 8,
        spaceBetween: 40,
      },
      200: {
        slidesPerView: 5,
      }
    }
  }

  const [isOpen, setIsOpen] = useState<boolean[]>([])
  const [categoriesWithSizes, setCategoriesWithSizes] = useState<categoryProp[]>([]);
  const [banner, setBanner] = useState<BannerProps[]>([])
  const [categorySizes, setCategorySizes] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {

    async function loadCategoriesWithSizes() {
      const categoryRef = collection(db, "categorias");
      const snapshot = await getDocs(categoryRef);
      const categoriesWithSizes: categoryProp[] = [];
    
      const newCategorySizes: { [key: string]: string[] } = {}; // Novo objeto para armazenar tamanhos
    
      for (const doc of snapshot.docs) {
        const categoryData = doc.data() as categoryProp;
        const category = { ...categoryData, id: doc.id };
    
        // Load sizes for this category
        const sizes = await loadSizesForCategory(category.name);
    
        // Check if sizes are available
        if (sizes.length > 0) {
          categoriesWithSizes.push(category);
          newCategorySizes[category.name] = sizes; // Adiciona os tamanhos ao novo objeto
        }
      }
    
      setCategoriesWithSizes(categoriesWithSizes);
      setCategorySizes((prevSizes) => ({ ...prevSizes, ...newCategorySizes })); // Atualiza o estado com os novos tamanhos
      setIsOpen(Array(categoriesWithSizes.length).fill(false));
    }

    async function loadSizesForCategory(categoryName: string): Promise<string[]> {
      const productRef = collection(db, "Produtos");
      const q = query(productRef, where("categoria", "==", categoryName));
    
      const snapshot = await getDocs(q);
      const sizes: string[] = [];
    
      snapshot.forEach((doc) => {
        const productData = doc.data() as Product;
        if (productData.size && productData.size.length > 0) {
          productData.size.forEach((size) => {
            if (!sizes.includes(size)) {
              sizes.push(size);
            }
          });
        }
      });
    
      return sizes;
    }

    
    loadBanner()
    loadCategoriesWithSizes();
  }, [])

  

  async function loadBanner() {
    const bannerRef = collection(db, "Banners")
    const q = query(bannerRef, orderBy("created", "desc"))

    await getDocs(q)
      .then((snapshot) => {
        const listBanner = [] as BannerProps[]

        snapshot.forEach(doc => {
          const bannerData = doc.data();

          if (bannerData.status === "Ativo")
            listBanner.push({
              id: doc.id,
              name: bannerData.name,
              images: bannerData.images,
              owner: bannerData.owner,
              status: bannerData.status,
            })
        })
        setBanner(listBanner)
      })
  }

  const toggleCategory = (index: number) => {
    setIsOpen((prev) => {
      const newState = [...prev];

      const updatedState = newState.map((state, idx) => idx === index ? !state : false);
      return updatedState;
    })
  }



  return (
    <>
      <Container>
      <div id="home"></div>
      <div className="mt-15 max-md:p-2 mt-10">
        <Slider settings={settings}>
          {banner.map((item, index) => (
            <div key={index}>
              <SwiperSlide>
                {item.status === "Inativo" ? (
                  <div></div>
                ) : (
                  <img key={index} src={item.images[0].url} alt="banner" />
                )}
              </SwiperSlide>
            </div>
          ))}
        </Slider>
      </div>

      <div className="mt-20 mb-[-90px]">
        <h1 className="text-center font-extrabold text-xl max-md:text-lg max-md:mt-[-50px] max-md:mb-[-50px]">CATEGORIAS</h1>
        <div className="overflow-x">

          <Slider settings={settings2}>

          {categoriesWithSizes.map((item, index) =>
              <SwiperSlide key={item.id}>
                <div className="flex flex-col items-center w-[340px] rounded-lg mt-5 max-md:mt-20">
                  <div className="relative w-[60px] h-[60px] max-md:w-[50px] max-md:h-[50px] bg-black rounded-full hover:bg-salmon duration-300">
                    <img
                      className="rounded-full absolute object-cover w-[60px] h-[60px] max-md:w-[50px] max-md:h-[50px]"
                      src={item.images[0].url}
                      alt={item.name} />
                  </div>

                    <button onClick={() => toggleCategory(index)} className=" w-full flex items-center justify-center tracking-wider active:text-salmon duration-300 max-md:text-[0.8rem]">
                      <span className="text-[0.9rem] max-md:text-[0.9em]">{item.name}</span>
                      {isOpen[index] ? (
                        <AiOutlineCaretDown className="h-5" />
                      ) : (
                        <AiOutlineCaretUp className="h-5" />
                      )}
                    </button>

                    {isOpen[index] &&
                      categorySizes[item.name]?.map((tamanho, tamanhoIndex) => (
                        <div key={tamanhoIndex} className="w-[80px] flex p-1 hover:bg-wine-black">
                          <div className="flex w-full max-w[100px]">
                            <Link
                              to={`/produtos/${item.name}/${tamanho}?`}
                              className="text-black flex w-full justify-center items-center hover:text-white cursor-pointer max-md:text-[0.7em]"
                            >
                              <p className="text-[0.9rem] max-md:text-[0.6rem] text-center">Tamanho {tamanho}</p>
                            </Link>
                          </div>
                        </div>
                      ))}
                </div>
              </SwiperSlide>
            )}
          </Slider>
        </div>
      </div>
      <div id="catalogo">
        <h1 className="text-center font-extrabold text-xl mt-60 my-10 max-md:text-lg max-md:mb-5 max-md:mt-32">CATÁLOGO</h1>
      </div>
      <Catalogo />
    </Container>
    <div id="footer"></div>
    <Footer/>
    </>
  )
}

