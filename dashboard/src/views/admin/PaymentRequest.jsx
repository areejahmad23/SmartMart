import React, { forwardRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_payment_request, confirm_payment_request,messageClear  } from '../../store/Reducers/PaymentReducer';
 import moment from 'moment';
 import { useEffect } from 'react';
 import { useState } from 'react';
 import toast from 'react-hot-toast';
function handleOnWheel({ deltaY }) {
  console.log('handleOnWheel', deltaY);
}

const outerElementType = forwardRef((props, ref) => (
  <div ref={ref} onWheel={handleOnWheel} {...props} />
));

const PaymentRequest = () => {
  const dispatch = useDispatch()
  const {successMessage, errorMessage, pendingWithdrows,loader } = useSelector(state => state.payment)
  const [paymentId, setPaymentId] = useState('')
  useEffect(() => { 
    dispatch(get_payment_request())
},[])

const confirm_request = (id) => {
  setPaymentId(id)
  dispatch(confirm_payment_request(id))
}
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


  const Row = ({ index, style }) => {
    return (
      <div
        style={style}
        className='flex text-sm text-[#000000] font-medium hover:bg-[#f8f9fa] transition-all duration-200'
      >
        <div className='w-[20%] p-2 whitespace-nowrap'>{index + 1}</div>
        <div className='w-[20%] p-2 whitespace-nowrap'>{pendingWithdrows[index]?.amount}</div>
        <div className='w-[20%] p-2 whitespace-nowrap'>
          <span className='py-[1px] px-[5px] bg-[#0077cc] text-[#ffffff] rounded-md text-sm'>
          {pendingWithdrows[index]?.status}
          </span>
        </div>
        <div className='w-[20%] p-2 whitespace-nowrap'>{moment(pendingWithdrows[index]?.createdAt).format('LL')}</div>
        <div className='w-[20%] p-2 whitespace-nowrap'>
          <button disabled={loader} onClick={() => confirm_request(pendingWithdrows[index]?._id)} className='bg-[#0077cc] shadow-lg hover:shadow-[#0077cc]/50 px-3 py-[2px] cursor-pointer text-[#ffffff] rounded-sm text-sm'>
          {(loader && paymentId === pendingWithdrows[index]?._id) ? 'loading..' : 'Confirm'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className='px-2 lg:px-7 pt-5'>
      <div className='w-full p-4 bg-[#ffffff] rounded-md shadow-lg'>
        <h2 className='text-xl font-medium pb-5 text-[#000000]'>Withdrawal Request</h2>
        <div className='w-full'>
          <div className='w-full overflow-x-auto'>
            {/* Table Header */}
            <div className='bg-[#f8f9fa] uppercase text-xs font-bold min-w-[340px] flex rounded-md'>
              <div className='w-[20%] p-2'>No</div>
              <div className='w-[20%] p-2'>Amount</div>
              <div className='w-[20%] p-2'>Status</div>
              <div className='w-[20%] p-2'>Date</div>
              <div className='w-[20%] p-2'>Action</div>
            </div>

            {/* Virtualized List */}
            <List
              style={{ minWidth: '340px' }}
              className='List'
              height={350}
              itemCount={pendingWithdrows.length}
              itemSize={35}
              outerElementType={outerElementType}
            >
              {Row}
            </List>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequest;