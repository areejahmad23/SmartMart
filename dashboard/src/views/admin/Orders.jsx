import { Link } from 'react-router-dom';
import { BsArrowDownSquare } from "react-icons/bs";
import Pagination from '../Pagination';
import React, { useEffect, useState } from 'react';
import { get_admin_orders } from '../../store/Reducers/OrderReducer';
import { useDispatch, useSelector } from 'react-redux';

const Orders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(5);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const { myOrders, totalOrder } = useSelector(state => state.order);

  useEffect(() => {
    const obj = {
        parPage: parseInt(parPage),
        page: parseInt(currentPage),
        searchValue
    }
    dispatch(get_admin_orders(obj))
  }, [searchValue, currentPage, parPage, dispatch]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#ffffff] rounded-md shadow-lg">
        <div className="flex justify-between items-center">
          <select
            onChange={(e) => setParPage(parseInt(e.target.value))}
            className="px-4 py-2 hover:border-[#0077cc] outline-none bg-[#ffffff] border border-[#0077cc] rounded-md text-[#000000]"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>

          <input onChange={e => setSearchValue(e.target.value)} value={searchValue}
            className="px-4 py-2 focus:border-[#0077cc] outline-none bg-[#ffffff] border border-[#0077cc] rounded-md text-[#000000]"
            type="text"
            placeholder="Search"
          />
        </div>

        <div className="relative mt-5 overflow-x-auto">
          <div className="w-full text-sm text-left text-[#000000]">
            <div className="text-sm text-[#000000] uppercase border-b border-[#0077cc]">
              <div className="flex justify-between items-center">
                <div className="py-3 w-[25%] font-bold">Order ID</div>
                <div className="py-3 w-[13%] font-bold">Price</div>
                <div className="py-3 w-[18%] font-bold">Payment Status</div>
                <div className="py-3 w-[18%] font-bold">Order Status</div>
                <div className="py-3 w-[18%] font-bold">Action</div>
                <div className="py-3 w-[8%] font-bold">
                  <BsArrowDownSquare className="text-[#0077cc]" />
                </div>
              </div>
            </div>

            {myOrders && myOrders.length > 0 ? (
              myOrders.map((o, i) => (
                <div key={i} className='text-[#000000]'>
                  <div className='flex justify-between items-start border-b border-[#0077cc] bg-[#ffffff]'>
                    <div className='py-3 w-[25%] font-medium whitespace-nowrap text-[#000033]'>#{o._id}</div>
                    <div className='py-3 w-[13%] font-medium text-[#000033]'>${o.price}</div>
                    <div className='py-3 w-[18%] font-medium text-[#000033]'>{o.payment_status}</div>
                    <div className='py-3 w-[18%] font-medium text-[#000033]'>{o.delivery_status}</div>
                    <div className='py-3 w-[18%] font-medium'>
                      <Link to={`/admin/dashboard/order/details/${o._id}`} className='text-[#0077cc]'>View</Link>
                    </div>
                    <div onClick={() => setShow(o._id)} className='py-3 w-[8%] font-medium cursor-pointer text-[#0077cc]'>
                      <BsArrowDownSquare />
                    </div>
                  </div>
                  <div className={show === o._id ? 'block border-b border-[#0077cc] bg-[#0077cc]' : 'hidden'}>
                    {o.suborder && o.suborder.length > 0 ? (
                      o.suborder.map((so, j) => (
                        <div key={j} className='flex justify-start items-start border-b border-[#0077cc]'>
                          <div className='py-3 w-[25%] font-medium whitespace-nowrap pl-3 text-[#ffffff]'>#{so._id}</div>
                          <div className='py-3 w-[13%] font-medium text-[#ffffff]'>${so.price}</div>
                          <div className='py-3 w-[18%] font-medium text-[#ffffff]'>{so.payment_status}</div>
                          <div className='py-3 w-[18%] font-medium text-[#ffffff]'>{so.delivery_status}</div>
                        </div>
                      ))
                    ) : (
                      <div className='py-3 w-full text-center text-[#ffffff]'>No suborders available</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className='py-3 w-full text-center text-[#000000]'>No orders found</div>
            )}
          </div>
        </div>

        {totalOrder > parPage && (
          <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
            <Pagination 
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalOrder}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
