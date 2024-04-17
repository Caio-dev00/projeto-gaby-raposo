
import ReactPaginate from 'react-paginate';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { motion } from 'framer-motion';

interface PaginationProps {
    pageCount: number;
    onPageChange: (selectedPage: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => {
   
    const paginationVariants = {
        hidden: {
            opacity: 0,
            y: 100,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 2
            },
        }
    };

    return (
        <motion.div 
            variants={paginationVariants} 
            initial="hidden" 
            animate="visible">
            <ReactPaginate
                breakLabel={<span className='mr-4'>...</span>}
                nextLabel={
                    <span className='w-10 h-10 flex items-center justify-center bg-wine-light rounded-md max-md:w-6 max-md:h-8'>
                        <BsChevronRight size={20} color="#FFF"/>
                    </span>
                }
                onPageChange={onPageChange}
                pageRangeDisplayed={2}
                pageCount={pageCount}
                previousLabel={
                    <span className='w-10 h-10 flex items-center justify-center bg-wine-light rounded-md max-md:w-6 max-md:h-8'>
                        <BsChevronLeft size={20} color="#FFF"/>
                    </span>
                }
                containerClassName='flex items-center justify-center gap-5 mt-8'
                renderOnZeroPageCount={null}
                pageClassName='block border-solid hover:max-md:w-14 hover:max-md:h-8 hover:rounded-full hover:bg-wine-light w-10 h-8 flex items-center justify-center hover:text-white rounded-full'
                activeClassName='bg-wine-light text-white max-md:w-14 max-md:h-15'
            />
        </motion.div>
    );
};

export default Pagination;
