import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { get_seller, seller_status_update, messageClear } from '../../store/Reducers/sellerReducer';
import toast from 'react-hot-toast';

const SellerDetails = () => {
  const dispatch = useDispatch();
  const { seller, successMessage } = useSelector((state) => state.seller);
  const { sellerId } = useParams();

  useEffect(() => {
    dispatch(get_seller(sellerId));
  }, [sellerId, dispatch]);

  const [status, setStatus] = useState('');

  const submit = (e) => {
    e.preventDefault();
    dispatch(
      seller_status_update({
        sellerId,
        status,
      })
    );
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (seller) {
      setStatus(seller.status);
    }
  }, [seller]);

  return (
    <div className='px-5 lg:px-7 pt-5'>
      {/* Header Section */}
      <h1 className='text-[20px] font-bold mb-3 text-[#000000]'>Seller Details</h1>

      {/* Seller Details Section */}
      <div className='w-full p-4 bg-[#ffffff] rounded-md shadow-lg'>
        <div className='w-full flex flex-wrap'>
          {/* Seller Image */}
          <div className='w-full md:w-3/12 flex justify-center items-center py-3'>
            <div>
              {seller?.image ? (
                <img
                  className='w-full h-[230px] rounded-md'
                  src='http://localhost:3000/images/demo.jpg'
                  alt='Seller'
                />
              ) : (
                <span className='text-[#000000]'>Image Not Uploaded</span>
              )}
            </div>
          </div>

          {/* Basic Info Section */}
          <div className='w-full md:w-4/12'>
            <div className='px-0 md:px-5 py-2'>
              <div className='py-2 text-lg text-[#000000]'>
                <h2>Basic Info</h2>
              </div>
              <div className='flex justify-between text-sm flex-col gap-2 p-4 bg-[#f8f9fa] rounded-md'>
                <div className='flex gap-2 font-bold text-[#000000]'>
                  <span>Name:</span>
                  <span>{seller?.name}</span>
                </div>
                <div className='flex gap-2 font-bold text-[#000000]'>
                  <span>Email:</span>
                  <span>{seller?.email}</span>
                </div>
                <div className='flex gap-2 font-bold text-[#000000]'>
                  <span>Role:</span>
                  <span>{seller?.role}</span>
                </div>
                <div className='flex gap-2 font-bold text-[#000000]'>
                  <span>Status:</span>
                  <span>{seller?.status}</span>
                </div>
                <div className='flex gap-2 font-bold text-[#000000]'>
                  <span>Payment Status:</span>
                  <span>{seller?.payment}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className='w-full md:w-4/12'>
            <div className='px-0 md:px-5 py-2'>
              <div className='py-2 text-lg text-[#000000]'>
                <h2>Address</h2>
              </div>
              <div className='flex justify-between text-sm flex-col gap-2 p-4 bg-[#f8f9fa] rounded-md'>
                <div className='flex gap-2 font-bold text-[#000000]'>
                  <span>Shop Name:</span>
                  <span>{seller?.shopInfo?.shopName}</span>
                </div>
                <div className='flex gap-2 font-bold text-[#000000]'>
                  <span>Division:</span>
                  <span>{seller?.shopInfo?.division}</span>
                </div>
                <div className='flex gap-2 font-bold text-[#000000]'>
                  <span>District:</span>
                  <span>{seller?.shopInfo?.district}</span>
                </div>
                <div className='flex gap-2 font-bold text-[#000000]'>
                  <span>State:</span>
                  <span>{seller?.shopInfo?.sub_district}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Form */}
        <div>
          <form onSubmit={submit}>
            <div className='flex gap-4 py-3'>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className='px-4 py-2 focus:border-[#0077cc] outline-none bg-[#ffffff] border border-[#0077cc] rounded-md text-[#000000]'
                required
              >
                <option value=''>-- Select Status --</option>
                <option value='active'>Active</option>
                <option value='deactive'>Deactive</option>
              </select>
              <button className='bg-[#0077cc] w-[170px] hover:shadow-[#0077cc]/40 hover:shadow-md text-white rounded-md px-7 py-2'>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerDetails;