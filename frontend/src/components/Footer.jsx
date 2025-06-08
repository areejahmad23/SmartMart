import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Footer = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.auth);
    const { cart_product_count, wishlist_count } = useSelector(state => state.cart);

    return (
        <footer className='bg-[#f3f6fa]'>
            {/* Main Footer Content */}
            <div className='w-[85%] xl:w-[90%] mx-auto border-b border-gray-200 py-16 lg:py-10'>
                <div className='flex flex-wrap'>
                    {/* Company Info Column */}
                    <div className='w-full lg:w-4/12 mb-8 lg:mb-0'>
                        <div className='flex flex-col gap-4'>
                            <Link to='/'>
                                <img 
                                    className='w-[160px] h-[60px] object-contain' 
                                    src="http://localhost:3000/images/logo.png" 
                                    alt="SmartMart Logo" 
                                />
                            </Link>
                            <ul className='flex flex-col gap-3 text-gray-600'>
                                <li className='flex items-start gap-2'>
                                    <span className='font-medium text-gray-800'>Address:</span> 
                                    <span>2504 Ivins Avenue, Egg Harbor Township, NJ 08234</span>
                                </li>
                                <li className='flex items-center gap-2'>
                                    <span className='font-medium text-gray-800'>Phone:</span> 
                                    <span>0333-1239797</span>
                                </li>
                                <li className='flex items-center gap-2'>
                                    <span className='font-medium text-gray-800'>Email:</span> 
                                    <span>smartmart@gmail.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Useful Links Column */}
                    <div className='w-full lg:w-4/12 mb-8 lg:mb-0 lg:pr-8'> {/* Added right padding */}
                        <div className='w-full'>
                            <h2 className='font-bold text-lg mb-4 text-gray-800'>Useful Links</h2>
                            <div className='flex justify-between gap-8'>
                                <ul className='flex flex-col gap-3 text-gray-600 text-sm'>
                                    <li><Link to="/about" className='hover:text-[#0077cc] transition-colors'>About Us</Link></li>
                                    <li><Link to="/shops" className='hover:text-[#0077cc] transition-colors'>Our Shop</Link></li>
                                    <li><Link to="/shipping" className='hover:text-[#0077cc] transition-colors'>Delivery Info</Link></li>
                                    <li><Link to="/privacy" className='hover:text-[#0077cc] transition-colors'>Privacy Policy</Link></li>
                                    <li><Link to="/blog" className='hover:text-[#0077cc] transition-colors'>Blogs</Link></li>
                                </ul>
                                <ul className='flex flex-col gap-3 text-gray-600 text-sm'>
                                    <li><Link to="/services" className='hover:text-[#0077cc] transition-colors'>Our Services</Link></li>
                                    <li><Link to="/company" className='hover:text-[#0077cc] transition-colors'>Company Profile</Link></li>
                                    <li><Link to="/returns" className='hover:text-[#0077cc] transition-colors'>Returns Policy</Link></li>
                                    <li><Link to="/terms" className='hover:text-[#0077cc] transition-colors'>Terms & Conditions</Link></li>
                                    <li><Link to="/contact" className='hover:text-[#0077cc] transition-colors'>Contact Us</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Column */}
                    <div className='w-full lg:w-4/12'>
                        <div className='w-full flex flex-col gap-5'>
                            <h2 className='font-bold text-lg text-gray-800'>Join Our Newsletter</h2>
                            <span className='text-gray-600'>Get updates about our latest products and special offers</span>
                            <div className='h-[50px] w-full bg-white border border-gray-300 relative rounded-md overflow-hidden'>
                                <input 
                                    className='h-full bg-transparent w-full px-4 outline-none text-gray-700 placeholder-gray-400'
                                    type="email" 
                                    placeholder='Enter your email' 
                                />
                                <button className='h-full absolute right-0 bg-gradient-to-r from-[#000022] to-[#0055aa] text-white uppercase px-6 font-bold text-sm hover:from-[#001144] hover:to-[#0066cc] transition-colors'>
                                    Subscribe
                                </button>
                            </div>
                            <div className='flex justify-start items-center gap-3'>
                                <a href="#" className='w-10 h-10 hover:bg-gradient-to-r from-[#000022] to-[#0055aa] hover:text-white flex justify-center items-center bg-white rounded-full text-gray-600 transition-colors'>
                                    <FaFacebookF />
                                </a>
                                <a href="#" className='w-10 h-10 hover:bg-gradient-to-r from-[#000022] to-[#0055aa] hover:text-white flex justify-center items-center bg-white rounded-full text-gray-600 transition-colors'>
                                    <FaTwitter />
                                </a>
                                <a href="#" className='w-10 h-10 hover:bg-gradient-to-r from-[#000022] to-[#0055aa] hover:text-white flex justify-center items-center bg-white rounded-full text-gray-600 transition-colors'>
                                    <FaInstagram />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className='w-[85%] xl:w-[90%] mx-auto py-5 text-center'>
                <span className='text-gray-600 text-sm'>Copyright © {new Date().getFullYear()} SmartMart. All Rights Reserved.</span>
            </div>

            {/* Mobile Floating Buttons */}
            <div className='fixed bottom-5 right-5 lg:hidden z-50'>
                <div className='flex flex-col gap-3'>
                    <div 
                        onClick={() => navigate(userInfo ? '/cart' : '/login')} 
                        className='relative flex justify-center items-center cursor-pointer w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gradient-to-r from-[#000022] to-[#0055aa] group transition-colors'
                    >
                        <FaShoppingCart className='text-gray-600 group-hover:text-white text-lg' />
                        {cart_product_count !== 0 && (
                            <div className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white flex justify-center items-center text-xs'>
                                {cart_product_count}
                            </div>
                        )}
                    </div>
                    <div 
                        onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')} 
                        className='relative flex justify-center items-center cursor-pointer w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gradient-to-r from-[#000022] to-[#0055aa] group transition-colors'
                    >
                        <FaHeart className='text-gray-600 group-hover:text-white text-lg' />
                        {wishlist_count !== 0 && (
                            <div className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white flex justify-center items-center text-xs'>
                                {wishlist_count}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;