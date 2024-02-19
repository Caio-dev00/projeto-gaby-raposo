import photo from '../../assets/produto.png'

export default function Catalogo() {

    const promotional = true;

  return (
    <div className="flex flex-col mt-5 w-[305px] max-md:w-[170px] cursor-pointer">
        <div>
            <img className='rounded-ss-lg rounded-se-lg' src={photo} alt="Product photo" />
        </div>
        <span className='text-gray-500 pl-4 pt-2 font-semibold max-md:text-[0.80rem] max-md:pb-1'>PRODUTO MODELO 1</span>
        <div className='flex'>
        {promotional ? (
            <span className='text-wine-light pl-4 mt-[-7px] font-medium text-[1.5rem] line-through max-md:text-[0.80rem]'>R$99,90</span>
        ):(
            <span className='text-wine-light pl-4 mt-[-7px] font-medium text-[1.5rem] max-md:text-[0.80rem]'>R$99,90</span>
        )}
            {
                promotional && (
                    <span className='text-green-400 pl-4 mt-[-7px] font-medium text-[1.5rem] max-md:text-[0.80rem]'>R$88,90</span>
                )
            }
        </div>
        <div className='flex justify-center bg-wine-light w-full max-md:w-[170px] rounded-ee-lg rounded-es-lg h-10 mb-10 hover:bg-wine-black'>
            <button className='text-white font-bold hover:scale-105 duration-300 max-md:text-[0.70rem]'>ADICIONAR AO CARRINHO</button>
        </div>
    </div>
  )
}
 