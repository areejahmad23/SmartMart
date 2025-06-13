import React from 'react';
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

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
                    className={`${pageNumber === i 
                        ? 'bg-gradient-to-r from-[#000022] to-[#0055aa] text-white shadow-md shadow-[#0077cc]/50' 
                        : 'bg-[#f0f5ff] text-[#000033] hover:bg-gradient-to-r hover:from-[#001144] hover:to-[#0066cc] hover:text-white hover:shadow-md hover:shadow-[#0077cc]/30'
                    } w-[33px] h-[33px] rounded-full flex justify-center items-center cursor-pointer transition-all duration-300`}
                >
                    {i}                    
                </li>
            );
        }
        return btns;
    };

    return (
        <ul className='flex gap-2'>
            {
                pageNumber > 1 && (
                    <li 
                        onClick={() => setPageNumber(pageNumber - 1)} 
                        className='w-[33px] h-[33px] rounded-full flex justify-center items-center bg-[#f0f5ff] text-[#000033] cursor-pointer hover:bg-gradient-to-r hover:from-[#001144] hover:to-[#0066cc] hover:text-white transition-all duration-300'
                    >
                        <MdOutlineKeyboardDoubleArrowLeft />
                    </li>
                )
            }
            {createBtn()}
            {
                pageNumber < totalPage && (
                    <li 
                        onClick={() => setPageNumber(pageNumber + 1)} 
                        className='w-[33px] h-[33px] rounded-full flex justify-center items-center bg-[#f0f5ff] text-[#000033] cursor-pointer hover:bg-gradient-to-r hover:from-[#001144] hover:to-[#0066cc] hover:text-white transition-all duration-300'
                    >
                        <MdOutlineKeyboardDoubleArrowRight />
                    </li>
                )
            }
        </ul>
    );
};

export default Pagination;