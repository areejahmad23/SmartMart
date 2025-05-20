import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { get_active_sellers } from '../../store/Reducers/sellerReducer';
import { useSelector } from 'react-redux';
const Sellers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(5);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const {sellers,totalSeller } = useSelector(state => state.seller)

  useEffect(() => {
    const obj = {
        parPage: parseInt(parPage),
        page: parseInt(currentPage),
        searchValue
    }
    dispatch(get_active_sellers(obj))
},[searchValue,currentPage,parPage])

  return (
    <div className='px-2 lg:px-7 pt-5'>
      <div className='w-full p-4 bg-[#ffffff] rounded-md shadow-lg'>
        {/* Search and Pagination Controls */}
        <div className='flex justify-between items-center'>
          <select
            onChange={(e) => setParPage(parseInt(e.target.value))}
            className='px-4 py-2 focus:border-[#0077cc] outline-none bg-[#ffffff] border border-[#0077cc] rounded-md text-[#000000]'
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <input onChange = {e => setSearchValue(e.target.value)} value={searchValue}
            className='px-4 py-2 focus:border-[#0077cc] outline-none bg-[#ffffff] border border-[#0077cc] rounded-md text-[#000000]'
            type="text"
            placeholder='Search'
            
          />
        </div>

        {/* Sellers Table */}
        <div className='relative overflow-x-auto mt-5'>
          <table className='w-full text-sm text-left text-[#000000]'>
            <thead className='text-sm text-[#000000] uppercase border-b border-[#0077cc]'>
              <tr>
                <th scope='col' className='py-3 px-4'>No</th>
                <th scope='col' className='py-3 px-4'>Image</th>
                <th scope='col' className='py-3 px-4'>Name</th>
                <th scope='col' className='py-3 px-4'>Shop Name</th>
                <th scope='col' className='py-3 px-4'>Payment Status</th>
                <th scope='col' className='py-3 px-4'>Email</th>
                <th scope='col' className='py-3 px-4'>Status</th>
                <th scope='col' className='py-3 px-4'>District</th>
                <th scope='col' className='py-3 px-4'>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                sellers.map((d, i) =>  (
                <tr key={i} className='hover:bg-[#f8f9fa] transition-all duration-200'>
                  <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                   {i+1}
                  </td>
                  <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                    <img
                      className='w-[45px] h-[45px] rounded-md'
                      src={d.image}
                      alt="Seller"
                    />
                  </td>
                  <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                    { d.name }
                  </td>
                  <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                  { d.shopInfo?.shopName }
                  </td>
                  <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                  { d.payment }
                  </td>
                  <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                  { d.email }
                  </td>
                  <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                  { d.status }
                  </td>
                  <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                  { d.shopInfo?.district }
                  </td>
                  <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                    <div className='flex justify-start items-center gap-4'>
                      <Link to={`/admin/dashboard/seller/details/${d._id}`}
                        className='p-[6px] bg-[#0077cc] rounded hover:shadow-lg hover:shadow-[#0077cc]/50'
                      >
                        <FaEye className='text-[#ffffff]' />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {
      totalSeller <= parPage ? <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
      <Pagination 
          pageNumber = {currentPage}
          setPageNumber = {setCurrentPage}
          totalItem = {totalSeller}
          parPage = {parPage}
          showItem = {4}
      />
      </div> : ""
    }
      </div>
    </div>
  );
};

export default Sellers;