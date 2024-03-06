import { ReactNode } from 'react'

interface TitleProps {
    children: ReactNode,
    name: string
}

export default function Title({children, name}: TitleProps ) {
  return (
    <div className='flex flex-row items-center my-4 rounded-[4px] p-2 bg-wine-black drop-shadow-md'>
        {children}
        <span className='text-white font-bold text-[1.2rem] ml-4 max-sm:text-[0.9rem]'>{name}</span>
    </div>
  )
}
