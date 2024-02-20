import ReactPaginate from 'react-paginate'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { motion } from 'framer-motion'

export default function Pagination() {
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
    }
    const pageCount = 10;

  return (
    <motion.div 
        variants={paginationVariants} 
        initial="hidden" 
        animate="visible">
        <ReactPaginate
             breakLabel={<span className='mr-4'>...</span>}
             nextLabel={
                <span className='w-10 h-10 flex items-center justify-center bg-wine-light rounded-md'>
                    <BsChevronRight size={26} color="#FFF"/>
                </span>
             }
             /* onPageChange={handlePageClick} */
             pageRangeDisplayed={5}
             pageCount={pageCount}
             previousLabel={
                <span className='w-10 h-10 flex items-center justify-center bg-wine-light rounded-md'>
                    <BsChevronLeft size={26} color="#FFF"/>
                </span>
             }
             containerClassName='flex items-center justify-center gap-5 mt-8'
             renderOnZeroPageCount={null}
             pageClassName='block boder-solid hover:bg-wine-light w-10 h-10 flex items-center justify-center hover:text-white rounded-md'
             activeClassName='bg-wine-light text-white'
        />
    </motion.div>
  )
}
