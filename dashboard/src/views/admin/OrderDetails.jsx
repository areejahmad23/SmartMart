import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { admin_order_status_update, get_admin_order,messageClear} from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';

const OrderDetails = () => {

  const { orderId } = useParams() 
  const dispatch = useDispatch() 
 const { order,errorMessage,successMessage } = useSelector(state => state.order)
  const [status, setStatus] = useState('')

  const status_update = (e) => {
      dispatch(admin_order_status_update({orderId, info: {status: e.target.value} }))
      setStatus(e.target.value)
  }
  
  useEffect(() => {
      dispatch(get_admin_order(orderId))
  },[orderId])

  useEffect(() => {
       setStatus(order?.delivery_status)
   },[order])
  
  
   useEffect(() => { 
      if (successMessage) {
          toast.success(successMessage)
          dispatch(messageClear())  
      } 
      if (errorMessage) {
          toast.error(errorMessage)
          dispatch(messageClear())  
      } 
  },[successMessage,errorMessage])
  

  return (
    <div className='px-2 lg:px-7 pt-5'>
      <div className='w-full p-4 bg-[#ffffff] rounded-md shadow-lg'>
        {/* Header Section */}
        <div className='flex justify-between items-center p-4'>
          <h2 className='text-xl text-[#000000]'>Order Details</h2>
          <select onChange={status_update} value={status}
            className='px-4 py-2 focus:border-[#0077cc] outline-none bg-[#ffffff] border border-[#0077cc] rounded-md text-[#000000]'
          >
           <option value="pending">pending</option>
           <option value="processing">processing</option>
           <option value="warehouse">warehouse</option>
           <option value="placed">placed</option>
          <option value="cancelled">cancelled</option>
          </select>
        </div>

        {/* Order Information */}
        <div className='p-4'>
          <div className='flex gap-2 text-lg text-[#000000]'>
            <h2>{order._id}</h2>
            <span>{order.date}</span>
          </div>

          <div className='flex flex-wrap'>
            {/* Left Section: Delivery and Payment Details */}
            <div className='w-full md:w-[30%]'>
              <div className='pr-3 text-[#000000] text-lg'>
                <div className='flex flex-col gap-1'>
                 <h2 className='pb-2 font-semibold'>Deliver To : {order.shippingInfo?.name} </h2>
                  <p><span className='text-sm'>
                     {order.shippingInfo?.address}
                     {order.shippingInfo?.province}
                     {order.shippingInfo?.city}
                     {order.shippingInfo?.area}</span></p>
                </div>
                <div className='flex justify-start items-center gap-3 mt-3'>
                  <h2>Payment Status:</h2>
                  <span className='text-base'>{order.payment_status}</span>
                  </div>
                  <span>Price : ${order.price}</span> 
                  </div>

              {/* Product List */}
            
                <div className='mt-4 flex flex-col gap-4 bg-[#f8f9fa] rounded-md p-3'>
                  <div className='text-[#000000]'>
                  {
                     order.products && order.products.map((p, i) => 
                    <div key={i} className='flex gap-3 text-md'>
                     <img className='w-[50px] h-[50px]' src={p.images[0]} alt="" />
 
                     <div>
                     <h2>{p.name} </h2>
                      <p>
                 <span>Brand : </span>
                 <span>{p.brand}</span>
                 <span className='text-lg'>Quantity : {p.quantity} </span>
             </p>
         </div> 
     </div>
    )
}
                  </div>
                </div>
            </div>     
              

            {/* Right Section: Seller Orders  bg-[#f8f9fa], text-[#000000] */}
            <div className='w-full md:w-[70%] mt-6 md:mt-0'>
              <div className='pl-3'>
                <div className='mt-4 flex flex-col bg-[#f8f9fa] rounded-md p-4'>
                {
                  order?.suborder?.map((o,i) => <div key={i + 20} className='text-[#000000] mt-2'>
                 <div className='flex justify-start items-center gap-3'>
                  <h2>Seller {i + 1}   Order : </h2>
                  <span>{o.delivery_status}</span> 
                  </div>
                {
                  o.products?.map((p,i) =>  <div className='flex gap-3 text-md mt-2'>
                 < img className='w-[50px] h-[50px]' src={p.images[0]} alt="" />
                 <div>
                <h2>{p.name} </h2>
                <p>
                    <span>Brand : </span>
                    <span>{p.brand}</span>
                    <span className='text-lg'>Quantity : {p.quantity} </span>
                </p>
            </div> 
        </div> )
        }

    </div> )
} 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;