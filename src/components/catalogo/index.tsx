import photo from '../../assets/produto.png'

export default function Catalogo() {
  return (
    <div className="flex flex-col mt-20">
        <div>
            <img className='rounded-xl' src={photo} alt="" />
        </div>
    </div>
  )
}
