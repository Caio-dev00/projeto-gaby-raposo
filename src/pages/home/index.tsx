import { SwiperProps, SwiperSlide } from "swiper/react"
import { Container } from "../../components/container"
import { Slider } from "../../components/slideBanner/Slider"

import banner from '../../assets/bannerBlackFriday.jpg'
import banner2 from '../../assets/bannerSale.jpg'
import Dropdown from "../../components/dropdown"

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
    spaceBetween: 40,
    slidesPerView: "auto",
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
        <h1 className="text-center font-bold text-xl">CATEGORIAS</h1>
        <Slider settings={settings2}>
         <SwiperSlide>
          <Dropdown name="Babydoll"/>
         </SwiperSlide>
         <SwiperSlide>
          <Dropdown name="Babydoll"/>
         </SwiperSlide>
         <SwiperSlide>
          <Dropdown name="Babydoll"/>
         </SwiperSlide>
         <SwiperSlide>
          <Dropdown name="Babydoll"/>
         </SwiperSlide>
         <SwiperSlide>
          <Dropdown name="Babydoll"/>
         </SwiperSlide>
         <SwiperSlide>
          <Dropdown name="Babydoll"/>
         </SwiperSlide>
         <SwiperSlide>
          <Dropdown name="Babydoll"/>
         </SwiperSlide>
         <SwiperSlide>
          <Dropdown name="Babydoll"/>
         </SwiperSlide>
         <SwiperSlide>
          <Dropdown name="Babydoll"/>
         </SwiperSlide>
         <SwiperSlide>
          <Dropdown name="Babydoll"/>
         </SwiperSlide>
         <SwiperSlide>
          <Dropdown name="Babydoll"/>
         </SwiperSlide>
         <SwiperSlide>
          <Dropdown name="Babydoll"/>
         </SwiperSlide>
        </Slider>
       </div>

       <div>
        <h1 className="text-center font-bold text-xl">CATALOGO</h1>
       </div>
    </Container>
  )
}
