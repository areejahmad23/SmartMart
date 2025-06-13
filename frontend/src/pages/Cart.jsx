import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { IoIosArrowForward } from "react-icons/io";
import { get_cart_products, delete_cart_product, messageClear, quantity_inc, quantity_dec } from '../store/reducers/cartReducer';
import toast from 'react-hot-toast';

const Cart = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.auth);
    const { cart_products, successMessage, price, buy_product_item, shipping_fee, outofstock_products } = useSelector(state => state.cart);
    const dispatch = useDispatch();

    const redirect = () => {
        navigate('/shipping', {
            state: {
                products: cart_products,
                price: price,
                shipping_fee: shipping_fee,
                items: buy_product_item
            }
        });
    };

    useEffect(() => {
        dispatch(get_cart_products(userInfo.id));
    }, [dispatch, userInfo.id]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            dispatch(get_cart_products(userInfo.id));
        }
    }, [successMessage, dispatch, userInfo.id]);

    const inc = (quantity, stock, cart_id) => {
        const temp = quantity + 1;
        if (temp <= stock) {
            dispatch(quantity_inc(cart_id));
        }
    };

    const dec = (quantity, cart_id) => {
        const temp = quantity - 1;
        if (temp !== 0) {
            dispatch(quantity_dec(cart_id));
        }
    };

    return (
        <div className="bg-[#f8f9fa]">
            <Header />
            {/* Banner Section */}
            <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
                    <div className='w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[85%] 2xl:w-[85%] h-full mx-auto'>
                        <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
                            <h2 className='text-2xl sm:text-3xl font-bold'>Your Cart</h2>
                            <div className='flex justify-center items-center gap-2 text-lg sm:text-xl'>
                                <Link to='/'>Home</Link>
                                <span className='pt-1'><IoIosArrowForward /></span>
                                <span>Cart</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Cart Content */}
            <section className='py-8 sm:py-12 lg:py-16'>
                <div className='w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[85%] 2xl:w-[85%] mx-auto'>
                    {cart_products.length > 0 || outofstock_products.length > 0 ? (
                        <div className='flex flex-wrap gap-6'>
                            {/* Cart Items Section */}
                            <div className='w-full lg:w-[67%]'>
                                <div className='flex flex-col gap-4'>
                                    {/* In Stock Products */}
                                    {cart_products.length > 0 && (
                                        <div className='bg-white p-4 rounded-md shadow-sm'>
                                            <h2 className='text-lg font-bold text-[#0077cc] mb-3'>
                                                In Stock Products ({cart_products.length})
                                            </h2>
                                            {cart_products.map((p, i) => (
                                                <div key={i} className='mb-6 last:mb-0'>
                                                    <div className='flex items-center mb-3'>
                                                        <h2 className='text-md font-semibold text-[#000033]'>{p.shopName}</h2>
                                                    </div>
                                                    {p.products.map((pt, idx) => (
                                                        <div key={idx} className='flex flex-wrap items-center py-4 border-b border-[#e2e2e2] last:border-0'>
                                                            <div className='w-full sm:w-7/12 flex items-center gap-4'>
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
                                                            <div className='w-full sm:w-5/12 mt-4 sm:mt-0 flex justify-between items-center'>
                                                                <div className='text-right'>
                                                                    <p className='text-lg font-bold text-[#0077cc]'>
                                                                        ${pt.productInfo.price - Math.floor((pt.productInfo.price * pt.productInfo.discount) / 100)}
                                                                    </p>
                                                                    <p className='text-sm line-through text-[#999]'>${pt.productInfo.price}</p>
                                                                    <p className='text-sm text-[#0077cc]'>-{pt.productInfo.discount}% off</p>
                                                                </div>
                                                                <div className='flex flex-col gap-2'>
                                                                    <div className='flex items-center bg-[#f0f5ff] rounded-md overflow-hidden'>
                                                                        <button 
                                                                            onClick={() => dec(pt.quantity, pt._id)}
                                                                            className='px-3 py-1 text-lg cursor-pointer hover:bg-[#0077cc] hover:text-white transition-colors'
                                                                        >
                                                                            -
                                                                        </button>
                                                                        <span className='px-3'>{pt.quantity}</span>
                                                                        <button 
                                                                            onClick={() => inc(pt.quantity, pt.productInfo.stock, pt._id)}
                                                                            className='px-3 py-1 text-lg cursor-pointer hover:bg-[#0077cc] hover:text-white transition-colors'
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => dispatch(delete_cart_product(pt._id))}
                                                                        className='px-4 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors'
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Out of Stock Products */}
                                    {outofstock_products.length > 0 && (
                                        <div className='bg-white p-4 rounded-md shadow-sm'>
                                            <h2 className='text-lg font-bold text-red-500 mb-3'>
                                                Out of Stock ({outofstock_products.length})
                                            </h2>
                                            {outofstock_products.map((p, i) => (
                                                <div key={i} className='flex flex-wrap items-center py-4 border-b border-[#e2e2e2] last:border-0'>
                                                    <div className='w-full sm:w-7/12 flex items-center gap-4'>
                                                        <img 
                                                            className='w-[80px] h-[80px] object-cover rounded-md' 
                                                            src={p.products[0].images[0]} 
                                                            alt={p.products[0].name} 
                                                        />
                                                        <div>
                                                            <h2 className='text-md font-semibold text-[#000033]'>{p.products[0].name}</h2>
                                                            <p className='text-sm text-[#666]'>Brand: {p.products[0].brand}</p>
                                                        </div>
                                                    </div>
                                                    <div className='w-full sm:w-5/12 mt-4 sm:mt-0 flex justify-between items-center'>
                                                        <div className='text-right'>
                                                            <p className='text-lg font-bold text-[#0077cc]'>
                                                                ${p.products[0].price - Math.floor((p.products[0].price * p.products[0].discount) / 100)}
                                                            </p>
                                                            <p className='text-sm line-through text-[#999]'>${p.products[0].price}</p>
                                                            <p className='text-sm text-[#0077cc]'>-{p.products[0].discount}% off</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => dispatch(delete_cart_product(p._id))}
                                                            className='px-4 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors'
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Summary Section */}
                            {cart_products.length > 0 && (
                                <div className='w-full lg:w-[30%]'>
                                    <div className='bg-white p-6 rounded-md shadow-sm sticky top-4'>
                                        <h2 className='text-xl font-bold text-[#000033] mb-4'>Order Summary</h2>
                                        <div className='space-y-3 mb-4'>
                                            <div className='flex justify-between'>
                                                <span className='text-[#666]'>{buy_product_item} Items</span>
                                                <span className='font-medium'>${price}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-[#666]'>Shipping Fee</span>
                                                <span className='font-medium'>${shipping_fee}</span>
                                            </div>
                                        </div>
                                        <div className='mb-4'>
                                            <div className='flex gap-2'>
                                                <input 
                                                    className='flex-1 px-3 py-2 border border-[#e2e2e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077cc]'
                                                    type="text" 
                                                    placeholder='Enter coupon code' 
                                                />
                                                <button className='px-4 py-2 bg-[#0077cc] text-white rounded-md hover:bg-[#0055aa] transition-colors'>
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                        <div className='border-t border-[#e2e2e2] pt-4 mb-6'>
                                            <div className='flex justify-between items-center'>
                                                <span className='font-bold'>Total</span>
                                                <span className='text-xl font-bold text-[#0077cc]'>${price + shipping_fee}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={redirect}
                                            className='w-full py-3 bg-[#0077cc] text-white font-bold rounded-md hover:bg-[#0055aa] transition-colors'
                                        >
                                            Proceed to Checkout ({buy_product_item})
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='bg-white p-8 rounded-md shadow-sm text-center'>
                            <h2 className='text-xl font-bold text-[#000033] mb-4'>Your cart is empty</h2>
                            <Link 
                                to='/shops' 
                                className='inline-block px-6 py-2 bg-[#0077cc] text-white rounded-md hover:bg-[#0055aa] transition-colors'
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Cart;