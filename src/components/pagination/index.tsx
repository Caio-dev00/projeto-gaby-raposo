import ReactPaginate from 'react-paginate'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'

export default function Pagination() {

   const pageCount = 10;

  return (
    <div>
        <ReactPaginate
             breakLabel="..."
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
             containerClassName='flex items-center justify-center gap-10 mt-8'
             renderOnZeroPageCount={null}
        />
    </div>
  )
}
