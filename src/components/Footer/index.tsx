import { FaInstagram, FaTiktok, FaFacebook, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full flex flex-col lg:items-center bg-gray-200 mt-8 px-2 py-4 xl:px-10">

      <div className="flex flex-col justify-between xl:mx-24 2xl:mx-36 lg:flex-row lg:w-3/4 lg:max-w-5xl">
        <div className='flex flex-col items-center gap-4 lg:flex-row lg:w-3/4'>
          <img
            className='w-36 h-36 max-lg:hidden'
            src='/src/assets/logo-footer.png'
            alt='Logo Footer'>
          </img>
          <div className='flex flex-col items-center md:w-96 lg:items-start'>
            <h2 className="text-xl font-semibold text-black my-2">Sobre nós</h2>
            <p className='text-sm font-medium text-black text-center lg:text-left'>Lorem ipsum dolor sit amet consectetur. Eu mi dapibus arcu dolor urna. Est rhoncus amet tincidunt elementum. Ullamcorper varius duis maecenas sit posuere massa non nunc proin.</p>
          </div>
        </div>

        <div className='flex flex-col items-center'>
          <h2 className='text-xl font-semibold text-black my-2'>Redes Sociais</h2>
          <div className='w-2/5 flex flex-row justify-around lg:flex-col lg:min-w-full'>
            <a
              href='https://'
              target='_blank'
              className='flex gap-2 items-center m-2'>
              <FaInstagram size={28} color="#000" />
              <span className='text-base font-semibold text-wine-light hidden lg:flex'>Instagram</span>
            </a>
            <a
              href="https://"
              target="_blank"
              className='flex gap-2 items-center m-2'>
              <FaFacebook size={28} color="#000" />
              <span className='text-base font-semibold text-wine-light hidden lg:flex'>Facebook</span>
            </a>
            <a
              href="https://"
              target="_blank"
              className='flex gap-2 items-center m-2'>
              <FaTiktok size={28} color="#000" />
              <span className='text-base font-semibold text-wine-light hidden lg:flex'>Tiktok</span>
            </a>
          </div>
        </div>
      </div>

      <hr className="w-full border border-solid border-wine-light rounded-s-full my-4 lg:max-w-5xl" />

      <div className='flex flex-col items-center'>
        <span className='text-xs font-normal text-black text-center'>Gabi Raposo Moda Íntima & Cia</span>
        <span className='text-xs font-normal text-black text-center'>CNPJ: 00.000.000/0000-00</span>
        <a
          href="https://"
          target="_blank"
          className='flex gap-2 items-center justify-center text-sm font-medium my-2'>
          <FaMapMarkerAlt size={24} color="#000" />
          Av. Dom Antonio, 754, Assis-SP
        </a>
      </div>
    </footer >
  );
}

export default Footer; 