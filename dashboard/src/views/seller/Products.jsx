import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_products } from '../../store/Reducers/productReducer';
import { LuImageMinus } from "react-icons/lu";
const Products = () => {
    const dispatch = useDispatch();
    const { products, totalProduct } = useSelector(state => state.product);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        };
        dispatch(get_products(obj));
    }, [searchValue, currentPage, parPage]);

    return (
        <div className='px-2 lg:px-4 pt-5'>
            <h1 className='text-[#000000] font-semibold text-lg mb-3'>All Products</h1>
            <div className='w-full p-4 bg-[#ffffff] rounded-md shadow-lg'>
                <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />
                <div className='relative overflow-x-auto mt-5'>
                    <table className='w-full text-sm text-left text-[#000000]'>
                        <thead className='text-sm text-[#000000] uppercase border-b border-[#0077cc]'>
                            <tr>
                                <th scope='col' className='py-3 px-4'>No</th>
                                <th scope='col' className='py-3 px-4'>Image</th>
                                <th scope='col' className='py-3 px-4'>Name</th>
                                <th scope='col' className='py-3 px-4'>Category</th>
                                <th scope='col' className='py-3 px-4'>Brand</th>
                                <th scope='col' className='py-3 px-4'>Price</th>
                                <th scope='col' className='py-3 px-4'>Discount</th>
                                <th scope='col' className='py-3 px-4'>Stock</th>
                                <th scope='col' className='py-3 px-4'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map((d, i) => (
                                    <tr key={i} className='hover:bg-[#f8f9fa] transition-all duration-200'>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{i + 1}</td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            <img className='w-[45px] h-[45px] rounded-md' src={d.images[0]} alt="" />
                                        </td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{d?.name?.slice(0, 15)}...</td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{d.category}</td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{d.brand}</td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>${d.price}</td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            {
                                                d.discount === 0 ? <span>No Discount</span> :
                                                    <span>%{d.discount}</span>
                                            }
                                        </td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{d.stock}</td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            <div className='flex justify-start items-center gap-4'>
                                                <Link to={`/seller/dashboard/edit-product/${d._id}`} className='p-[6px] bg-[#0077cc] rounded hover:shadow-lg hover:shadow-[#0077cc]/50'>
                                                    <FaEdit className='text-[#ffffff]' />
                                                </Link>
                                                <Link to={`/seller/dashboard/add-banner/${d._id}`} className='p-[6px] bg-sky-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'> <LuImageMinus /> 
                                                </Link> 
                                                <Link className='p-[6px] bg-[#28a745] rounded hover:shadow-lg hover:shadow-[#28a745]/50'>
                                                    <FaEye className='text-[#ffffff]' />
                                                </Link>
                                                <Link className='p-[6px] bg-[#dc3545] rounded hover:shadow-lg hover:shadow-[#dc3545]/50'>
                                                    <FaTrash className='text-[#ffffff]' />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                    {
                        totalProduct <= parPage ? "" : (
                            <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                                <Pagination
                                    pageNumber={currentPage}
                                    setPageNumber={setCurrentPage}
                                    totalItem={50}
                                    parPage={parPage}
                                    showItem={3}
                                />
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Products;