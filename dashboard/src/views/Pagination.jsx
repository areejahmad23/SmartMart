import React from 'react';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';

const Pagination = ({ pageNumber, setPageNumber, totalItem, parPage, showItem }) => {
  let totalPage = Math.ceil(totalItem / parPage);
  let startPage = pageNumber;

  let dif = totalPage - pageNumber;
  if (dif <= showItem) {
    startPage = totalPage - showItem;
  }
  let endPage = startPage < 0 ? showItem : showItem + startPage;

  if (startPage <= 0) {
    startPage = 1;
  }

  const createBtn = () => {
    const btns = [];
    for (let i = startPage; i < endPage; i++) {
      btns.push(
        <li
          key={i}
          onClick={() => setPageNumber(i)}
          className={`${
            pageNumber === i
              ? 'bg-[#0077cc] shadow-lg shadow-[#0077cc]/50 text-white'
              : 'bg-[#f8f9fa] hover:bg-[#0077cc] shadow-lg hover:shadow-[#0077cc]/50 text-[#000000]'
          } w-[33px] h-[33px] rounded-full flex justify-center items-center cursor-pointer transition-all duration-300`}
        >
          {i}
        </li>
      );
    }
    return btns;
  };

  return (
    <ul className='flex gap-3 items-center'>
      {/* Previous Button */}
      {pageNumber > 1 && (
        <li
          onClick={() => setPageNumber(pageNumber - 1)}
          className='w-[33px] h-[33px] rounded-full flex justify-center items-center bg-[#0077cc] text-white cursor-pointer hover:shadow-lg hover:shadow-[#0077cc]/50 transition-all duration-300'
        >
          <MdKeyboardDoubleArrowLeft />
        </li>
      )}

      {/* Pagination Buttons */}
      {createBtn()}

      {/* Next Button */}
      {pageNumber < totalPage && (
        <li
          onClick={() => setPageNumber(pageNumber + 1)}
          className='w-[33px] h-[33px] rounded-full flex justify-center items-center bg-[#0077cc] text-white cursor-pointer hover:shadow-lg hover:shadow-[#0077cc]/50 transition-all duration-300'
        >
          <MdKeyboardDoubleArrowRight />
        </li>
      )}
    </ul>
  );
};

export default Pagination;