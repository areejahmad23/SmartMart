import { MdCurrencyExchange } from "react-icons/md";
import React, { forwardRef, useEffect, useState } from 'react';
import { FixedSizeList as List } from "react-window";
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_payment_details, send_withdrowal_request, messageClear } from '../../store/Reducers/PaymentReducer';
import toast from 'react-hot-toast';
import moment from 'moment';


function handleOnWheel({ deltaY }) {
  console.log("handleOnWheel", deltaY);
}

const outerElementType = forwardRef((props, ref) => (
  <div ref={ref} onWheel={handleOnWheel} {...props} />
));

const Payments = () => {

  const dispatch = useDispatch()
  const {userInfo } = useSelector(state => state.auth)
  const {successMessage, errorMessage,loader,pendingWithdrows,   successWithdrows, totalAmount, withdrowAmount, pendingAmount,
    availableAmount, } = useSelector(state => state.payment)
    const [amount,setAmount] = useState(0)


    const sendRequest = (e) => {
      e.preventDefault()
      if (availableAmount - amount > 10) {
          dispatch(send_withdrowal_request({amount, sellerId: userInfo._id }))
          setAmount(0)
      } else {
          toast.error('Insufficient Balance')
      }
  }

  const Row = ({ index, style }) => {
    return (
      <div style={style} className="flex text-sm text-[#000000] font-medium">
        <div className="w-[25%] p-2 whitespace-nowrap">{index + 1}</div>
        <div className="w-[25%] p-2 whitespace-nowrap">${pendingWithdrows[index]?.amount}</div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          <span className="py-[1px] px-[5px] bg-[#f8f9fa] text-[#0077cc] rounded-md text-sm">
          {pendingWithdrows[index]?.status}
          </span>
        </div>
        <div className="w-[20%] p-2 whitespace-nowrap">{moment(pendingWithdrows[index]?.createdAt).format('LL')}</div>
      </div>
    );
  };

  const Rows = ({ index, style }) => {
    return (
      <div style={style} className="flex text-sm text-[#000000] font-medium">
        <div className="w-[25%] p-2 whitespace-nowrap">{index + 1}</div>
        <div className="w-[25%] p-2 whitespace-nowrap">${successWithdrows[index]?.amount}</div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          <span className="py-[1px] px-[5px] bg-[#f8f9fa] text-[#0077cc] rounded-md text-sm">
          {successWithdrows[index]?.status}
          </span>
        </div>
        <div className="w-[20%] p-2 whitespace-nowrap">{moment(successWithdrows[index]?.createdAt).format('LL')}</div>
      </div>
    );
  };

  useEffect(() => {
    dispatch(get_seller_payment_details(userInfo._id))
},[])


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
    <div className="px-2 md:px-7 py-5">
      {/* Grid displaying total stats */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-5">
        {/* Total Sales Card */}
        <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-md gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col justify-start items-start text-[#ffffff]">
            <h2 className="text-3xl font-bold">${totalAmount}</h2>
            
            <span className="text-md font-medium">Total Sales</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-[#ffffff] flex justify-center items-center text-xl">
            <MdCurrencyExchange className="text-[#000033] shadow-lg" />
          </div>
        </div>

        {/* Available Amount Card */}
        <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-md gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col justify-start items-start text-[#ffffff]">
            <h2 className="text-3xl font-bold">${availableAmount}</h2>
            <span className="text-md font-medium">Available Amount</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-[#ffffff] flex justify-center items-center text-xl">
            <MdCurrencyExchange className="text-[#000033] shadow-lg" />
          </div>
        </div>

        {/* Withdrawal Amount Card */}
        <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-md gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col justify-start items-start text-[#ffffff]">
            <h2 className="text-3xl font-bold">${withdrowAmount}</h2>
            <span className="text-md font-medium">Withdrawal Amount</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-[#ffffff] flex justify-center items-center text-xl">
            <MdCurrencyExchange className="text-[#000033] shadow-lg" />
          </div>
        </div>

        {/* Pending Amount Card */}
        <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#000022] to-[#0055aa] rounded-md gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col justify-start items-start text-[#ffffff]">
            <h2 className="text-3xl font-bold">${pendingAmount}</h2>
            <span className="text-md font-medium">Pending Amount</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-[#ffffff] flex justify-center items-center text-xl">
            <MdCurrencyExchange className="text-[#000033] shadow-lg" />
          </div>
        </div>
      </div>

      {/* Send Request and Pending Request */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 pb-4">
        <div className="bg-[#ffffff] text-[#000000] rounded-md p-5 shadow-lg">
          <h2 className="text-lg">Send Request</h2>
          <div className="pt-5 mb-5">
            <form  onSubmit={sendRequest}>
              <div className="flex gap-3 flex-wrap">
                <input 
                  onChange={(e) => setAmount(e.target.value)} value={amount}
                  min="0"
                  type="number"
                  className="px-3 py-2 md:w-[75%] focus:border-[#0077cc] outline-none bg-[#ffffff] border border-[#0077cc] rounded-md text-[#000000]"
                  name="amount"
                />
                <button disabled={loader}  className="bg-[#0077cc] hover:shadow-[#0077cc]/40 hover:shadow-md text-white rounded-md px-7 py-2">
                {loader ? 'loading..' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
          <div>
            <h2 className="text-lg pb-4">Pending Request</h2>
            <div className="w-full overflow-x-auto">
              <div className="bg-[#f8f9fa] uppercase text-xs font-bold min-w-[340px] flex rounded-md">
                <div className="w-[25%] p-2">No</div>
                <div className="w-[25%] p-2">Amount</div>
                <div className="w-[25%] p-2">Status</div>
                <div className="w-[25%] p-2">Date</div>
              </div>
              <List
                style={{ minWidth: "340px" }}
                className="List"
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

        <div className="bg-[#ffffff] text-[#000000] rounded-md p-5 shadow-lg">
          <div>
            <h2 className="text-lg pb-4">Success Withdrawl</h2>
            <div className="w-full overflow-x-auto">
              <div className="bg-[#f8f9fa] uppercase text-xs font-bold min-w-[340px] flex rounded-md">
                <div className="w-[25%] p-2">No</div>
                <div className="w-[25%] p-2">Amount</div>
                <div className="w-[25%] p-2">Status</div>
                <div className="w-[25%] p-2">Date</div>
              </div>
              <List
                style={{ minWidth: "340px" }}
                className="List"
                height={350}
                itemCount={successWithdrows.length}
                itemSize={35}
                outerElementType={outerElementType}
              >
                {Rows}
              </List>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;