import { ReactNode } from "react"
import { Swiper, SwiperProps } from "swiper/react"

import 'swiper/css'

interface SliderProps {
    settings: SwiperProps,
    children: ReactNode
}

export function Slider({settings, children }: SliderProps) {
  return (
    <Swiper {...settings}>{children}</Swiper>
  )
}
