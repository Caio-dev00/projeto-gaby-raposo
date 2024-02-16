import { SwiperProps, SwiperSlide } from "swiper/react"
import { Container } from "../../components/container"
import { Slider } from "../../components/slideBanner/Slider"

import banner from '../../assets/bannerBlackFriday.jpg'
import banner2 from '../../assets/bannerSale.jpg'

export function Home() {
  const settings: SwiperProps = {
    spaceBetween: 50,
    slidesPerView: 1,
    navigation: true,
    pagination: {
      clickable: true,
    }
  }

  return (
    <Container>
       <div className="mt-15 max-md:mt-10">
        <Slider settings={settings}>
              <SwiperSlide>
                <img src={banner} alt="blackFriday" />
              </SwiperSlide>
              <SwiperSlide>
              <img src={banner2} alt="SaleOctober" />
              </SwiperSlide>
          </Slider>
       </div>
    </Container>
  )
}
