import { ReactNode } from "react"
import { Swiper, SwiperProps } from "swiper/react"
import { Navigation, Pagination, A11y } from 'swiper/modules';


import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../slideBanner/Slider.css';

interface SliderProps {
    settings: SwiperProps,
    children: ReactNode
}

export function Slider({settings, children }: SliderProps) {
  return (
    <Swiper modules={[Navigation, Pagination, A11y]} {...settings}>{children}</Swiper>
  )
}
