import { SwiperSlide } from "swiper/react"
import { Container } from "../../components/container"
import { Slider } from "../../components/slideBanner/Slider"

import banner from '../../assets/bannerBlackFriday.jpg'
import banner2 from '../../assets/bannerSale.jpg'

export function Home() {
  const settings = {
    spaceBetween: 50,
    slidesPerView: 1,
  }

  return (
    <Container>
       <div className="mt-20">
        <Slider settings={settings}>
              <SwiperSlide>
                <img src={banner} alt="blackFriday" />
              </SwiperSlide>
              <SwiperSlide>
              <img src={banner2} alt="SaleOctober" />
              </SwiperSlide>
              <SwiperSlide>
                <h1>TESTE 3</h1>
              </SwiperSlide>
              <SwiperSlide>
                <h1>TESTE 4</h1>
              </SwiperSlide>
          </Slider>
       </div>
    </Container>
  )
}
