import { SwiperProps, SwiperSlide } from "swiper/react"
import { Container } from "../../components/container"
import { Slider } from "../../components/slideBanner/Slider"

import banner from '../../assets/bannerBlackFriday.jpg'
import banner2 from '../../assets/bannerSale.jpg'

import Catalogo from "../../components/catalogo"
import Pagination from "../../components/pagination"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { categoryProp } from "../dashboard/categorias"
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";




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
    spaceBetween: 10,
    slidesPerView: 8
  }

  const [isOpen, setIsOpen] = useState<boolean[]>([])
  const [category, setCategory] = useState<categoryProp[]>([])


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
    getCategory()

  }, [])

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
          <SwiperSlide>
            <img src={banner} alt="blackFriday" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={banner2} alt="SaleOctober" />
          </SwiperSlide>
        </Slider>
      </div>

      <div className="mt-20 max-md:mt-10 mb-[-90px]">
        <h1 className="text-center font-extrabold text-xl max-md:text-lg">CATEGORIAS</h1>
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
                    <span className="text-[0.9rem]">{item.name}</span>
                    {isOpen[index] ? (
                      <AiOutlineCaretDown className="h-8" />
                      ) : (
                        <AiOutlineCaretUp className="h-8" />
                    )}
                  </button>


                }

                {isOpen[index] && (
                  <div>
                    <div className="w-full flex hover:bg-salmon rounded-lg">
                      <h3 className="text-black cursor-pointer">{item.name}</h3>
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
          <Catalogo />
          <Catalogo />
          <Catalogo />
          <Catalogo />
        </div>
      </div>

      <Pagination />

    </Container>
  )
}
