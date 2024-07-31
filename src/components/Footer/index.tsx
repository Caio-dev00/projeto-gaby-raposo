import { FaInstagram, FaTiktok, FaFacebook, FaMapMarkerAlt } from 'react-icons/fa';
import { Container } from '../container';
import logoFooter from '/src/assets/logoFooter.png';

const Footer = () => {
  return (

    <footer className="w-full flex flex-col lg:items-center bg-gray-200 mt-20 relative bottom-0 lg:px-8">
      <Container>

        <div className="flex flex-col justify-between lg:flex-row">
          <div className='flex flex-col items-center gap-14 lg:flex-row'>
            <img
              className='w-36 h-36 max-lg:hidden'
              src={logoFooter}
              alt='Logo Footer'>
            </img>
            <div className='flex flex-col items-center md:w-96 lg:items-start'>
              <h2 className="text-xl font-semibold text-black my-2">Sobre nós</h2>
              <p className='text-sm font-medium text-black text-center md:w-[28rem] lg:text-left'>
                Empoderamos nossos clientes com peças íntimas e selecionadas para elevar sua autoestima e confiança. Em 2023, nosso compromisso com a excelência foi recompensado ao sermos eleitos como a melhor loja de lingerie da nossa região. Venha nos conhecer pessoalmente e vista-se de poder !
              </p>
            </div>
          </div>

          <div className='flex flex-col items-center'>
            <h2 className='text-xl font-semibold text-black my-2'>Redes Sociais</h2>
            <div className='w-2/5 flex flex-row justify-around lg:flex-col lg:min-w-full'>
              <a
                href='https://www.instagram.com/gabiraposo_lingerie/'
                target='_blank'
                className='flex gap-2 items-center m-2'>
                <FaInstagram size={28} color="#000" />
                <span className='text-base font-semibold text-wine-light hidden lg:flex'>Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/p/Gabi-Raposo-Lingerie-100063670114076/"
                target="_blank"
                className='flex gap-2 items-center m-2'>
                <FaFacebook size={28} color="#000" />
                <span className='text-base font-semibold text-wine-light hidden lg:flex'>Facebook</span>
              </a>
              <a
                href="https://www.tiktok.com/@gabiraposolingerie"
                target="_blank"
                className='flex gap-2 items-center m-2'>
                <FaTiktok size={28} color="#000" />
                <span className='text-base font-semibold text-wine-light hidden lg:flex'>Tiktok</span>
              </a>
            </div>
          </div>
        </div>

        <hr className="w-full border border-solid border-wine-light rounded-s-full my-4" />

        <div className='flex flex-col items-center'>
          <span className='text-xs font-medium text-black text-center'>Gabi Raposo Moda Íntima & Cia</span>
          <span className='text-xs font-medium text-black text-center'>CNPJ: 19.907.291/0001-24</span>
          <div>
          <a
            href="https://maps.app.goo.gl/AUxnBQJ5rUxG9ZxD9"
            target="_blank"
            className='flex gap-2 items-center justify-center text-sm font-medium my-2'>
            <FaMapMarkerAlt size={24} color="#000" />
            Av. Dom Antonio, 754, Assis-SP
          </a>
          </div>
        </div>
      </Container >
    </footer >
  );
}

export default Footer; 