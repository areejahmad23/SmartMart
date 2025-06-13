import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { place_order } from '../store/reducers/orderReducer';

const Shipping = () => {
    const { state: { products, price, shipping_fee, items } } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.auth);

    const [res, setRes] = useState(false);
    const [state, setState] = useState({
        name: '',
        address: '',
        phone: '',
        post: '',
        province: '',
        city: '',
        area: ''
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const save = (e) => {
        e.preventDefault();
        const { name, address, phone, post, province, city, area } = state;
        if (name && address && phone && post && province && city && area) {
            setRes(true);
        }
    };

    const placeOrder = () => {
        dispatch(place_order({
            price,
            products,
            shipping_fee,
            items,
            shippingInfo: state,
            userId: userInfo.id,
            navigate
        }));
    };

    return (
        <div className="bg-[#f8f9fa] min-h-screen flex flex-col">
            <Header />
            
            {/* Banner Section */}
            <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
                    <div className='w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[85%] 2xl:w-[85%] h-full mx-auto'>
                        <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
                            <h2 className='text-2xl sm:text-3xl font-bold'>Shipping Information</h2>
                            <div className='flex justify-center items-center gap-2 text-lg sm:text-xl'>
                                <Link to='/'>Home</Link>
                                <span className='pt-1'><IoIosArrowForward /></span>
                                <span>Shipping</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className='flex-grow py-8'>
                <div className='w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[85%] 2xl:w-[85%] mx-auto'>
                    <div className='flex flex-col lg:flex-row gap-6'>
                        {/* Left Column - Shipping Form and Products */}
                        <div className='w-full lg:w-2/3'>
                            {/* Shipping Information */}
                            <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                                <h2 className='text-xl font-bold text-[#000033] mb-4'>Shipping Information</h2>
                                
                                {!res ? (
                                    <form onSubmit={save} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className='space-y-1'>
                                                <label htmlFor="name" className="text-[#666]">Name</label>
                                                <input 
                                                    onChange={inputHandle} 
                                                    value={state.name} 
                                                    type="text" 
                                                    className='w-full px-4 py-2 border border-[#e2e2e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077cc]' 
                                                    name="name" 
                                                    id="name" 
                                                    placeholder='Your Name' 
                                                    required 
                                                />
                                            </div>

                                            <div className='space-y-1'>
                                                <label htmlFor="address" className="text-[#666]">Address</label>
                                                <input 
                                                    onChange={inputHandle} 
                                                    value={state.address} 
                                                    type="text" 
                                                    className='w-full px-4 py-2 border border-[#e2e2e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077cc]' 
                                                    name="address" 
                                                    id="address" 
                                                    placeholder='Your Address' 
                                                    required 
                                                />
                                            </div>

                                            <div className='space-y-1'>
                                                <label htmlFor="phone" className="text-[#666]">Phone</label>
                                                <input 
                                                    onChange={inputHandle} 
                                                    value={state.phone} 
                                                    type="tel" 
                                                    className='w-full px-4 py-2 border border-[#e2e2e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077cc]' 
                                                    name="phone" 
                                                    id="phone" 
                                                    placeholder='Phone Number' 
                                                    required 
                                                />
                                            </div>

                                            <div className='space-y-1'>
                                                <label htmlFor="post" className="text-[#666]">Postal Code</label>
                                                <input 
                                                    onChange={inputHandle} 
                                                    value={state.post} 
                                                    type="text" 
                                                    className='w-full px-4 py-2 border border-[#e2e2e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077cc]' 
                                                    name="post" 
                                                    id="post" 
                                                    placeholder='Postal Code' 
                                                    required 
                                                />
                                            </div>

                                            <div className='space-y-1'>
                                                <label htmlFor="province" className="text-[#666]">Province</label>
                                                <input 
                                                    onChange={inputHandle} 
                                                    value={state.province} 
                                                    type="text" 
                                                    className='w-full px-4 py-2 border border-[#e2e2e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077cc]' 
                                                    name="province" 
                                                    id="province" 
                                                    placeholder='Province' 
                                                    required 
                                                />
                                            </div>

                                            <div className='space-y-1'>
                                                <label htmlFor="city" className="text-[#666]">City</label>
                                                <input 
                                                    onChange={inputHandle} 
                                                    value={state.city} 
                                                    type="text" 
                                                    className='w-full px-4 py-2 border border-[#e2e2e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077cc]' 
                                                    name="city" 
                                                    id="city" 
                                                    placeholder='City' 
                                                    required 
                                                />
                                            </div>

                                            <div className='space-y-1 md:col-span-2'>
                                                <label htmlFor="area" className="text-[#666]">Area</label>
                                                <input 
                                                    onChange={inputHandle} 
                                                    value={state.area} 
                                                    type="text" 
                                                    className='w-full px-4 py-2 border border-[#e2e2e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077cc]' 
                                                    name="area" 
                                                    id="area" 
                                                    placeholder='Area' 
                                                    required 
                                                />
                                            </div>
                                        </div>

                                        <div className='pt-2'>
                                            <button 
                                                type="submit" 
                                                className='px-6 py-2 bg-[#0077cc] text-white rounded-md hover:bg-[#0055aa] transition-colors'
                                            >
                                                Save Shipping Info
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className='space-y-3'>
                                        <h2 className='text-lg font-semibold text-[#000033]'>Deliver To: {state.name}</h2>
                                        <div className='flex items-center gap-2'>
                                            <span className='bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded'>Home</span>
                                            <span className='text-[#666]'>
                                                {state.phone}, {state.address}, {state.province}, {state.city}, {state.area}
                                            </span>
                                        </div>
                                        <p className='text-[#666] text-sm'>Email: {userInfo?.email || 'ariyan@gmail.com'}</p>
                                        <button 
                                            onClick={() => setRes(false)} 
                                            className='text-[#0077cc] hover:underline text-sm'
                                        >
                                            Change Shipping Info
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Products List */}
                            <div className='space-y-4'>
                                {products.map((p, i) => (
                                    <div key={i} className='bg-white rounded-lg shadow-sm p-4'>
                                        <h2 className='text-md font-bold text-[#000033] mb-3'>{p.shopName}</h2>
                                        {p.products.map((pt, idx) => (
                                            <div key={idx} className='flex flex-col sm:flex-row gap-4 py-3 border-t border-[#e2e2e2]'>
                                                <div className='flex gap-3 sm:w-8/12'>
                                                    <img 
                                                        className='w-[80px] h-[80px] object-cover rounded-md' 
                                                        src={pt.productInfo.images[0]} 
                                                        alt={pt.productInfo.name} 
                                                    />
                                                    <div>
                                                        <h2 className='text-md font-semibold text-[#000033]'>{pt.productInfo.name}</h2>
                                                        <p className='text-sm text-[#666]'>Brand: {pt.productInfo.brand}</p>
                                                    </div>
                                                </div>
                                                <div className='sm:w-4/12 text-right'>
                                                    <p className='text-lg font-bold text-[#0077cc]'>
                                                        ${(pt.productInfo.price - Math.floor((pt.productInfo.price * pt.productInfo.discount) / 100)).toFixed(2)}
                                                    </p>
                                                    <p className='text-sm line-through text-[#999]'>${pt.productInfo.price.toFixed(2)}</p>
                                                    <p className='text-sm text-[#0077cc]'>-{pt.productInfo.discount}%</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className='w-full lg:w-1/3'>
                            <div className='bg-white rounded-lg shadow-sm p-6 sticky top-4'>
                                <h2 className='text-xl font-bold text-[#000033] mb-4'>Order Summary</h2>
                                <div className='space-y-3'>
                                    <div className='flex justify-between'>
                                        <span className='text-[#666]'>Items ({items})</span>
                                        <span className='font-medium'>${price.toFixed(2)}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-[#666]'>Delivery Fee</span>
                                        <span className='font-medium'>${shipping_fee.toFixed(2)}</span>
                                    </div>
                                    <div className='border-t border-[#e2e2e2] pt-3'>
                                        <div className='flex justify-between'>
                                            <span className='font-bold'>Total</span>
                                            <span className='text-xl font-bold text-[#0077cc]'>${(price + shipping_fee).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={placeOrder} 
                                    disabled={!res} 
                                    className={`w-full mt-6 py-3 rounded-md text-white font-medium ${res ? 'bg-[#0077cc] hover:bg-[#0055aa]' : 'bg-gray-400 cursor-not-allowed'} transition-colors`}
                                >
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Shipping;