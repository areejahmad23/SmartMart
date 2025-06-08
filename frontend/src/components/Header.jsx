import React, { useState } from 'react';
import { MdEmail } from "react-icons/md";
import { FaLock, FaPhoneAlt, FaUser, FaList, FaHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { IoMdArrowDropdown, IoIosArrowDown } from "react-icons/io";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';
import { get_cart_products, get_wishlist_product } from '../store/reducers/cartReducer';

const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {categorys} = useSelector(state => state.home)
    const {userInfo} = useSelector(state => state.auth)
    const {cart_product_count,wishlist_count} = useSelector(state => state.cart) 
    const { pathname } = useLocation();
    const [showSidebar, setShowSidebar] = useState(true);
    const [categoryShow, setCategoryShow] = useState(true);
    const [searchValue, setSearchValue] = useState('')
    const [category, setCategory] = useState('')
    
    const search = () => {
        if (searchValue.trim()) {
            navigate(`/products/search?category=${category}&&value=${searchValue}`)
        }
    }
    
    const redirect_cart_page = () => {
        if (userInfo) {
            navigate('/cart')
        } else {
            navigate('/login')
        }
    }

    const handleMobileNavClick = (path) => {
        navigate(path);
        setShowSidebar(true);
    };

    useEffect(() => {
        if (userInfo) {
            dispatch(get_cart_products(userInfo.id))
            dispatch(get_wishlist_product(userInfo.id))
        }  
    },[userInfo])

    return (
        <div className='w-full bg-white shadow-sm'>
            {/* Top Header - Hidden on mobile */}
            <div className='bg-gradient-to-r from-[#000022] to-[#0055aa] hidden lg:block'>
                <div className='w-[85%] xl:w-[90%] mx-auto'>
                    <div className='flex w-full justify-between items-center h-[50px]'>
                        <ul className='flex justify-start items-center gap-8 font-medium text-white'>
                            <li className='flex relative justify-center items-center gap-2 text-sm after:absolute after:h-[18px] after:w-[1px] after:bg-[#0077cc] after:-right-[16px]'>
                                <span><MdEmail /></span>
                                <span>support@gmail.com</span>
                            </li>
                            <li className='flex relative justify-center items-center gap-2 text-sm'>
                                <span><FaPhoneAlt /> </span>
                                <span>+(123) 3456 7891</span>
                            </li>
                        </ul>
                        <div>
                            <div className='flex justify-center items-center gap-10'>
                                <div className='flex justify-center items-center gap-4 text-white'>
                                    <a href="#" className='hover:text-[#0077cc] transition-colors'><FaFacebookF /></a>
                                    <a href="#" className='hover:text-[#0077cc] transition-colors'><FaTwitter /></a>
                                    <a href="#" className='hover:text-[#0077cc] transition-colors'><FaInstagram /></a>
                                </div>
                                <div className='flex group cursor-pointer text-white text-sm justify-center items-center gap-1 relative after:h-[18px] after:w-[1px] after:bg-[#0077cc] after:-right-[16px] after:absolute before:absolute before:h-[18px] before:bg-[#0077cc] before:w-[1px] before:-left-[20px]'>
                                    <img src="http://localhost:3000/images/language.png" alt="Language" className='w-5 h-5' />
                                    <span><IoMdArrowDropdown /></span>
                                    <ul className='absolute invisible transition-all top-12 rounded-sm duration-200 text-white p-2 w-[100px] flex flex-col gap-3 group-hover:visible group-hover:top-6 bg-[#000033] z-10'>
                                        <li className='hover:text-[#0077cc]'>Hindi</li>
                                        <li className='hover:text-[#0077cc]'>English</li>
                                    </ul>
                                </div>
                                {userInfo ? (
                                    <Link className='flex cursor-pointer justify-center items-center gap-2 text-sm text-white hover:text-[#0077cc] transition-colors' to='/dashboard'>
                                        <span><FaUser /></span>
                                        <span>{userInfo.name} </span>
                                    </Link>
                                ) : (
                                    <Link className='flex cursor-pointer justify-center items-center gap-2 text-sm text-white hover:text-[#0077cc] transition-colors' to='/login'>
                                        <span><FaLock /></span>
                                        <span>Login</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className='w-full bg-white'>
                <div className='w-[85%] xl:w-[90%] lg:w-[95%] mx-auto'>
                    <div className='h-[80px] lg:h-[70px] flex justify-between items-center'>
                        <div className='w-3/12 lg:w-auto flex justify-start items-center'>
                            <Link to='/'>
                                <img 
                                    src="http://localhost:3000/images/logo.png" 
                                    alt="Logo" 
                                    className='h-10 lg:h-12 object-contain'
                                />
                            </Link>
                        </div>
                        <div className='hidden lg:block w-9/12'>
                            <div className='flex justify-between items-center pl-8'>
                                <ul className='flex justify-start items-center gap-8 text-sm font-bold uppercase'>
                                    <li>
                                        <Link className={`p-2 block ${pathname === '/' ? 'text-[#0077cc]' : 'text-[#000033] hover:text-[#0077cc] transition-colors'}`} to='/'>Home</Link>
                                    </li>
                                    <li>
                                        <Link to='/shops' className={`p-2 block ${pathname === '/shops' ? 'text-[#0077cc]' : 'text-[#000033] hover:text-[#0077cc] transition-colors'}`}>Shop</Link>
                                    </li>
                                    <li>
                                        <Link className={`p-2 block ${pathname === '/blog' ? 'text-[#0077cc]' : 'text-[#000033] hover:text-[#0077cc] transition-colors'}`} to='/blog'>Blog</Link>
                                    </li>
                                    <li>
                                        <Link className={`p-2 block ${pathname === '/about' ? 'text-[#0077cc]' : 'text-[#000033] hover:text-[#0077cc] transition-colors'}`} to='/about'>About Us</Link>
                                    </li>
                                    <li>
                                        <Link className={`p-2 block ${pathname === '/contact' ? 'text-[#0077cc]' : 'text-[#000033] hover:text-[#0077cc] transition-colors'}`} to='/contact'>Contact Us</Link>
                                    </li>
                                </ul>
                                <div className='flex justify-center items-center gap-5'>
                                    <div className='flex justify-center gap-5'>
                                        <div onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')} className='relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#f0f5ff] hover:bg-[#0077cc] hover:text-white transition-colors'>
                                            <span className='text-xl text-[#000033] hover:text-white'><FaHeart /></span>
                                            {wishlist_count !== 0 && <div className='w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px] text-xs'>
                                                {wishlist_count}
                                            </div>}                 
                                        </div>
                                        <div onClick={redirect_cart_page} className='relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#f0f5ff] hover:bg-[#0077cc] hover:text-white transition-colors'>
                                            <span className='text-xl text-[#000033] hover:text-white'><FaCartShopping/></span>
                                            {cart_product_count !== 0 && <div className='w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px] text-xs'>
                                                {cart_product_count}
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div 
                            className='lg:hidden flex items-center justify-center w-10 h-10 bg-white text-[#000033] border border-[#000033] rounded-sm cursor-pointer hover:bg-[#0077cc] hover:text-white transition-colors'
                            onClick={() => setShowSidebar(false)}
                        >
                            <FaList className='text-lg' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar - Only shown on mobile */}
            <div className='lg:hidden'>
                <div 
                    onClick={() => setShowSidebar(true)} 
                    className={`fixed duration-200 transition-all ${showSidebar ? 'invisible opacity-0' : 'visible opacity-100'} w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 z-20`}
                ></div> 
                <div className={`w-[280px] z-[9999] transition-all duration-200 fixed ${showSidebar ? '-left-[280px]' : 'left-0'} top-0 overflow-y-auto bg-white h-screen py-4 px-6 shadow-lg`}>
                    <div className='flex flex-col gap-6 h-full'>       
                        <div className='flex justify-between items-center'>
                            <Link to='/' onClick={() => setShowSidebar(true)}>
                                <img 
                                    src="http://localhost:3000/images/logo.png" 
                                    alt="Logo" 
                                    className='h-10 object-contain'
                                />
                            </Link>
                            <button 
                                onClick={() => setShowSidebar(true)}
                                className='text-2xl text-gray-600 hover:text-[#0077cc]'
                            >
                                &times;
                            </button>
                        </div>
                        
                        <div className='flex justify-between items-center'>
                            <div className='flex group cursor-pointer text-[#000033] text-sm items-center gap-1'>
                                <img src="http://localhost:3000/images/language.png" alt="Language" className='w-5 h-5' />
                                <span><IoMdArrowDropdown /></span>
                                <ul className='absolute invisible transition-all mt-2 rounded-sm duration-200 text-white p-2 w-[100px] flex flex-col gap-3 group-hover:visible bg-[#000033] z-10'>
                                    <li className='hover:text-[#0077cc]'>Hindi</li>
                                    <li className='hover:text-[#0077cc]'>English</li>
                                </ul>
                            </div>
                            {userInfo ? 
                                <Link 
                                    className='flex items-center gap-2 text-sm text-[#000033] hover:text-[#0077cc] transition-colors' 
                                    to='/dashboard'
                                    onClick={() => setShowSidebar(true)}
                                >
                                    <span><FaUser/></span>
                                    <span>{userInfo.name}</span>
                                </Link> : 
                                <Link 
                                    to='/login' 
                                    className='flex items-center gap-2 text-sm text-[#000033] hover:text-[#0077cc] transition-colors'
                                    onClick={() => setShowSidebar(true)}
                                >
                                    <span><FaLock /></span>
                                    <span>Login</span>
                                </Link>
                            } 
                        </div>
                                                <ul className='flex flex-col gap-2 text-sm font-bold uppercase'>
                            <li>
                                <Link 
                                    onClick={() => handleMobileNavClick('/')}
                                    className={`py-3 px-2 block ${pathname === '/' ? 'text-[#0077cc]' : 'text-[#000033] hover:text-[#0077cc] transition-colors'}`}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    onClick={() => handleMobileNavClick('/shops')}
                                    className={`py-3 px-2 block ${pathname === '/shops' ? 'text-[#0077cc]' : 'text-[#000033] hover:text-[#0077cc] transition-colors'}`}
                                >
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    onClick={() => handleMobileNavClick('/blog')}
                                    className={`py-3 px-2 block ${pathname === '/blog' ? 'text-[#0077cc]' : 'text-[#000033] hover:text-[#0077cc] transition-colors'}`}
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    onClick={() => handleMobileNavClick('/about')}
                                    className={`py-3 px-2 block ${pathname === '/about' ? 'text-[#0077cc]' : 'text-[#000033] hover:text-[#0077cc] transition-colors'}`}
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    onClick={() => handleMobileNavClick('/contact')}
                                    className={`py-3 px-2 block ${pathname === '/contact' ? 'text-[#0077cc]' : 'text-[#000033] hover:text-[#0077cc] transition-colors'}`}
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                        
                        <div className='mt-auto'>
                            <div className='flex justify-center gap-4 mb-4'>
                                <div 
                                    onClick={() => {
                                        setShowSidebar(true);
                                        navigate(userInfo ? '/dashboard/my-wishlist' : '/login');
                                    }} 
                                    className='relative flex justify-center items-center cursor-pointer w-[40px] h-[40px] rounded-full bg-[#f0f5ff] hover:bg-[#0077cc] hover:text-white transition-colors'
                                >
                                    <FaHeart className='text-lg' />
                                    {wishlist_count !== 0 && (
                                        <div className='w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px] text-xs'>
                                            {wishlist_count}
                                        </div>
                                    )}
                                </div>
                                <div 
                                    onClick={() => {
                                        setShowSidebar(true);
                                        redirect_cart_page();
                                    }} 
                                    className='relative flex justify-center items-center cursor-pointer w-[40px] h-[40px] rounded-full bg-[#f0f5ff] hover:bg-[#0077cc] hover:text-white transition-colors'
                                >
                                    <FaCartShopping className='text-lg' />
                                    {cart_product_count !== 0 && (
                                        <div className='w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px] text-xs'>
                                            {cart_product_count}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className='flex justify-center gap-4 text-[#000033] mb-4'>
                                <a href="#" className='hover:text-[#0077cc] transition-colors'><FaFacebookF /></a>
                                <a href="#" className='hover:text-[#0077cc] transition-colors'><FaTwitter /></a>
                                <a href="#" className='hover:text-[#0077cc] transition-colors'><FaInstagram /></a>
                            </div>
                            
                            <div className='flex items-center gap-3 mb-3'>
                                <div className='w-[40px] h-[40px] rounded-full flex bg-[#f0f5ff] justify-center items-center text-[#000033] hover:bg-[#0077cc] hover:text-white transition-colors'>
                                    <FaPhoneAlt className='text-sm' />
                                </div>
                                <div className='flex flex-col'>
                                    <h2 className='text-sm font-medium text-[#000033]'>+(123) 3456 7891</h2>
                                    <span className='text-xs text-slate-600'>Support 24/7</span> 
                                </div>
                            </div>
                            
                            <div className='flex items-center gap-2 text-sm text-[#000033]'>
                                <MdEmail className='text-base' />
                                <span>support@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category and Search Section */}
            <div className='w-[85%] xl:w-[90%] lg:w-[95%] mx-auto py-2 lg:py-0'>
                <div className='flex w-full flex-col lg:flex-row gap-3 lg:gap-0'>
                    <div className='w-full lg:w-3/12'>
                        <div className='bg-white relative'>
                            <div 
                                onClick={() => setCategoryShow(!categoryShow)} 
                                className='h-[50px] bg-gradient-to-r from-[#000022] to-[#0055aa] text-white flex justify-between px-4 items-center gap-3 font-bold text-md cursor-pointer hover:bg-gradient-to-r hover:from-[#001144] hover:to-[#0066cc] transition-colors rounded-md lg:rounded-none'
                            >
                                <div className='flex items-center gap-3'>
                                    <FaList className='text-lg' />
                                    <span>All Category</span>
                                </div>
                                <IoIosArrowDown className={`transition-transform ${categoryShow ? 'rotate-0' : 'rotate-180'}`} />
                            </div>
                            <div className={`${categoryShow ? 'h-0' : 'h-[300px]'} overflow-hidden transition-all duration-300 absolute z-[9999] bg-white w-full border border-gray-200 shadow-lg rounded-b-md lg:rounded-none`}>
                                <ul className='py-2 text-[#000033] font-medium'>
                                    {categorys.map((c,i) => (
                                        <li key={i} className='flex items-center gap-2 px-4 py-3 hover:bg-[#0077cc] hover:text-white transition-colors'>
                                            <img src={c.image} className='w-6 h-6 rounded-full object-cover' alt={c.name} />
                                            <Link 
                                                to={`/products?category=${c.name}`} 
                                                className='text-sm block'
                                                onClick={() => setCategoryShow(true)}
                                            >
                                                {c.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className='w-full lg:w-9/12 lg:pl-4'>
                        <div className='flex flex-col lg:flex-row w-full gap-3 lg:gap-0'>
                            <div className='w-full'>
                                <div className='flex border border-[#0077cc] h-[50px] items-center relative rounded-md overflow-hidden'>
                                    <div className='hidden lg:block relative after:absolute after:h-[25px] after:w-[1px] after:bg-[#0077cc] after:-right-[15px]'>
                                        <select 
                                            onChange={(e) => setCategory(e.target.value)} 
                                            className='w-[150px] text-[#000033] font-semibold bg-transparent px-2 h-full outline-0 border-none'
                                            value={category}
                                        >
                                            <option value="">All Categories</option>
                                            {categorys.map((c, i) => (
                                                <option key={i} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <input 
                                        className='w-full bg-transparent text-[#000033] outline-0 px-4 h-full'
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && search()}
                                        type="text" 
                                        placeholder='What do you need...'
                                        value={searchValue}
                                    />
                                    <button 
                                        onClick={search}
                                        className='absolute right-0 bg-gradient-to-r from-[#000022] to-[#0055aa] px-6 h-full font-semibold uppercase text-white hover:from-[#001144] hover:to-[#0066cc] transition-colors'
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>

                            <div className='hidden lg:flex lg:w-4/12 lg:pl-4 items-center justify-end'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-12 h-12 rounded-full flex bg-[#f0f5ff] justify-center items-center text-[#000033] hover:bg-[#0077cc] hover:text-white transition-colors'>
                                        <FaPhoneAlt className='text-sm' />
                                    </div>
                                    <div className='flex flex-col'>
                                        <h2 className='text-sm font-medium text-[#000033]'>+(123) 3456 7891</h2>
                                        <span className='text-xs text-slate-600'>Support 24/7</span> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;