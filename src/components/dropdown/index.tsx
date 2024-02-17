import { useState } from "react";
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai" ;
import list from "../../list.json";

interface Categoryprops {
    name: string;
}

export default function Dropdown({name}: Categoryprops){
    const [isOpen, setIsOpen] = useState(false)

  return(
    <div className="relative flex flex-col items-center w-[340px] h-[340px] rounded-lg mt-20">
        <div className="w-[60px] h-[60px] bg-black rounded-full hover:bg-salmon duration-300"></div>
        {
          
            <button onClick={() => setIsOpen((prev) => !prev)} className="pt-2 w-full flex items-center justify-center tracking-wider active:text-salmon duration-300">
                {name}
                {isOpen ? (
                    <AiOutlineCaretDown className="h-8" />
                ):(
                    <AiOutlineCaretUp className="h-8" />
                )}
            </button>

            
            
        }

        {isOpen && (
            <div>
                {list.map((item, index) => (
                    <div className="w-full flex hover:bg-salmon rounded-lg" key={index}>
                        <h3 className="text-black cursor-pointer">{item.Tamanho}</h3>
                    </div>
                    
                ))}
            </div>
            
        )}
    </div>
  )
}
