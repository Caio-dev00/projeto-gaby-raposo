import { SwiperProps, SwiperSlide } from "swiper/react"
import { Container } from "../../components/container"
import { Slider } from "../../components/slideBanner/Slider"

import Catalogo from "../../components/catalogo"
import { useEffect, useState } from "react"
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";
import { BannerProps } from "../dashboard/banners"

import { categoryProp } from "../dashboard/categorias"
import { tamanhoProps } from "../dashboard/variacoes"
import { Link } from "react-router-dom"
import Footer from "../../components/Footer"



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
  const [category, setCategory] = useState<categoryProp[]>([])
  const [tamanho, setTamanho] = useState<tamanhoProps[]>([])
  const [banner, setBanner] = useState<BannerProps[]>([])

  useEffect(() => {

    async function getCategory() {
      const categoryref = collection(db, 'categorias')

      await getDocs(categoryref)
        .then((snapshot) => {
          const listCategories = [] as categoryProp[]

          snapshot.forEach(doc => {
            listCategories.push({
              id: doc.id,
              name: doc.data().name,
              owner: doc.data().owner,
              images: doc.data().images
            })
          })
          setCategory(listCategories)
        })
    }
    loadTamanhos()
    loadBanner()
    getCategory()
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

  async function loadTamanhos() {
    const tamanhosRef = collection(db, "Tamanhos")
    const q = query(tamanhosRef, orderBy("created", "desc"))

    await getDocs(q)
    onSnapshot(q, (snapshot) => {
      const lista = [] as tamanhoProps[]
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          name: doc.data().tamanho,
          owner: doc.data().owner
        })
        setTamanho(lista)
        setIsOpen(Array(lista.length).fill(false))
      })
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

          {category.map((item, index) =>
              <SwiperSlide key={item.id}>
                <div className="flex flex-col items-center w-[340px] rounded-lg mt-20">
                  <div className="relative w-[60px] h-[60px] max-md:w-[50px] max-md:h-[50px] bg-black rounded-full hover:bg-salmon duration-300">
                    <img
                      className="rounded-full absolute object-cover w-[60px] h-[60px] max-md:w-[50px] max-md:h-[50px]"
                      src={item.images[0].url}
                      alt={item.name} />
                  </div>

                  {

                    <button onClick={() => toggleCategory(index)} className=" w-full flex items-center justify-center tracking-wider active:text-salmon duration-300 max-md:text-[0.8rem]">
                      <span className="text-[0.9rem] max-md:text-[0.9em]">{item.name}</span>
                      {isOpen[index] ? (
                        <AiOutlineCaretDown className="h-5" />
                      ) : (
                        <AiOutlineCaretUp className="h-5" />
                      )}
                    </button>


                  }

                  {tamanho.map((tamanhoItem, tamanhoIndex) => (
                    <div key={tamanhoIndex}>
                      {isOpen[index] && (
                        <div className=" w-[80px] flex p-1 hover:bg-wine-black  ">
                          <div className="flex w-full max-w[100px]">
                          <Link to={`/produtos/${item.name}/${tamanhoItem.name}?`} className="text-black flex w-full justify-center items-center hover:text-white cursor-pointer max-md:text-[0.7em]">
                              <p className="text-[0.9rem] max-md:text-[0.6rem] text-center">Tamanho {tamanhoItem.name}</p>
                            </Link>
                          </div>
                        </div>

                      )}
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

