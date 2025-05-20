import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Search from '../components/Search';
import { get_seller_request } from '../../store/Reducers/sellerReducer';

const SellerRequest = () => {
  const dispatch = useDispatch();
  const { sellers, totalSeller } = useSelector((state) => state.seller);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(5);
  const [show, setShow] = useState(false);

  useEffect(() => {
    dispatch(
      get_seller_request({
        parPage,
        searchValue,
        page: currentPage,
      })
    );
  }, [parPage, searchValue, currentPage, dispatch]);

  return (
    <div className='px-2 lg:px-7 pt-5'>
      {/* Header Section */}
      <h1 className='text-[20px] font-bold mb-3 text-[#000000]'>Seller Request</h1>

      {/* Seller Request Table Section */}
      <div className='w-full p-4 bg-[#ffffff] rounded-md shadow-lg'>
        {/* Search Component */}
        <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />

        {/* Seller Request Table */}
        <div className='relative overflow-x-auto mt-5'>
          <table className='w-full text-sm text-left text-[#000000]'>
            <thead className='text-sm text-[#000000] uppercase border-b border-[#0077cc]'>
              <tr>
                <th scope='col' className='py-3 px-4'>No</th>
                <th scope='col' className='py-3 px-4'>Name</th>
                <th scope='col' className='py-3 px-4'>Email</th>
                <th scope='col' className='py-3 px-4'>Payment Status</th>
                <th scope='col' className='py-3 px-4'>Status</th>
                <th scope='col' className='py-3 px-4'>Action</th>
              </tr>
            </thead>

            <tbody>
              {sellers.map((d, i) => (
                <tr key={i} className='border-b border-[#0077cc] hover:bg-[#f8f9fa] transition-all duration-200'>
                  <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                    {i + 1}
                  </td>
                  <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                    {d.name}
                  </td>
                  <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                    {d.email}
                  </td>
                  <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                    <span>{d.payment}</span>
                  </td>
                  <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                    <span>{d.status}</span>
                  </td>
                  <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                    <div className='flex justify-start items-center gap-4'>
                      <Link
                        to={`/admin/dashboard/seller/details/${d._id}`}
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
        <div className='w-full flex justify-end mt-4'>
          <Pagination
            pageNumber={currentPage}
            setPageNumber={setCurrentPage}
            totalItem={totalSeller}
            parPage={parPage}
            showItem={3}
          />
        </div>
      </div>
    </div>
  );
};

export default SellerRequest;