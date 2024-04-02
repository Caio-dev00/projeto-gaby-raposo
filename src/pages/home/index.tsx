import { SwiperProps, SwiperSlide } from "swiper/react"
import { Container } from "../../components/container"
import { Slider } from "../../components/slideBanner/Slider"

import Catalogo from "../../components/catalogo"
import Pagination from "../../components/pagination"
import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { categoryProp } from "../dashboard/categorias"
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";
import { BannerProps } from "../dashboard/banners"


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
        slidesPerView: 5
      }
    }
  }

  const [isOpen, setIsOpen] = useState<boolean[]>([])
  const [category, setCategory] = useState<categoryProp[]>([])
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
          setIsOpen(Array(listCategories.length).fill(false))
        })
    }
    loadBanner()
    getCategory()
  }, [])

  async function loadBanner(){
    const bannerRef = collection(db, "Banners")
    const q = query(bannerRef, orderBy("created", "desc"))

    await getDocs(q)
    .then((snapshot) => {
      const listBanner = [] as BannerProps[]

      snapshot.forEach(doc => {
        listBanner.push({
          id: doc.id,
          name: doc.data().name,
          images: doc.data().images,
          owner: doc.data().owner,
          status: doc.data().status,
        })
      })
      setBanner(listBanner)
    })
  }

  const toggleCategory = (index: number) => {
    setIsOpen((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index]
      return newState;
    })
  }
  return (
    <Container>
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
                      alt="" />
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

                  {isOpen[index] && (
                    <div>
                      <div className="w-full flex hover:bg-salmon rounded-lg ">
                        <h3 className="text-black cursor-pointer max-md:text-[0.7em]">{item.name}</h3>
                      </div>
                    </div>

                  )}
                </div>
              </SwiperSlide>
            )}


          </Slider>
        </div>
      </div>
      <div>
        <h1 className="text-center font-extrabold text-xl mt-60 my-10 max-md:text-lg max-md:mb-5 max-md:mt-32">CATÁLOGO</h1>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          <Catalogo />
        </div>
      </div>

      <Pagination />

    </Container>
  )
}
