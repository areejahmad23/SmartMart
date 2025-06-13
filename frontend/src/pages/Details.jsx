import React, { useState, useEffect } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import Carousel from 'react-multi-carousel'; 
import 'react-multi-carousel/lib/styles.css'
import Rating from '../components/Rating';
import { FaHeart } from "react-icons/fa6";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Reviews from '../components/Reviews';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import { product_details } from '../store/reducers/homeReducer';
import toast from 'react-hot-toast';
import { add_to_cart, messageClear, add_to_wishlist } from '../store/reducers/cartReducer';

const Details = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { product, relatedProducts, moreProducts } = useSelector(state => state.home);
    const { userInfo } = useSelector(state => state.auth);
    const { errorMessage, successMessage } = useSelector(state => state.cart);
    
    useEffect(() => {
        dispatch(product_details(slug));
    }, [slug, dispatch]);

    useEffect(() => { 
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());  
        } 
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());  
        } 
    }, [successMessage, errorMessage, dispatch]);
    
    const [image, setImage] = useState('');
    const [state, setState] = useState('reviews');
    const [quantity, setQuantity] = useState(1);

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 768 },
            items: 4
        },
        mdtablet: {
            breakpoint: { max: 768, min: 464 },
            items: 3
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2
        }
    };

    const inc = () => {
        if (quantity >= product.stock) {
            toast.error('Out of Stock');
        } else {
            setQuantity(quantity + 1);
        }
    };
    
    const dec = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const add_cart = () => {
        if (userInfo) {
            dispatch(add_to_cart({
                userId: userInfo.id,
                quantity,
                productId: product._id
            }));
        } else {
            navigate('/login');
        }
    };

    const add_wishlist = () => {
        if (userInfo) {
            dispatch(add_to_wishlist({
                userId: userInfo.id,
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                discount: product.discount,
                rating: product.rating,
                slug: product.slug
            }));
        } else {
            navigate('/login');
        }
    };

    const buynow = () => {
        let price = 0;
        if (product.discount !== 0) {
            price = product.price - Math.floor((product.price * product.discount) / 100);
        } else {
            price = product.price;
        }

        const obj = [
            {
                sellerId: product.sellerId,
                shopName: product.shopName,
                price: quantity * ((price - Math.floor(price * 5) / 100)),
                products: [
                    {
                        quantity,
                        productInfo: product
                    }
                ]
            }
        ];
        navigate('/shipping', {
            state: {
                products: obj,
                price: price * quantity,
                shipping_fee: 50,
                items: 1
            }
        }); 
    };

    return (
        <div className="bg-[#f8f9fa]">
            <Header/>
            {/* Banner Section */}
            <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
                    <div className='w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[85%] 2xl:w-[85%] h-full mx-auto'>
                        <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
                            <h2 className='text-2xl sm:text-3xl font-bold'>Product Details</h2>
                            <div className='flex justify-center items-center gap-2 text-lg sm:text-xl'>
                                <Link to='/'>Home</Link>
                                <span className='pt-1'><IoIosArrowForward /></span>
                                <span>Product Details</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className='bg-[#f0f5ff] py-5 mb-5'>
                    <div className='w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[85%] 2xl:w-[85%] h-full mx-auto'>
                        <div className='flex justify-start items-center text-md text-[#000033] w-full'>
                            <Link to='/'>Home</Link>
                            <span className='pt-1'><IoIosArrowForward /></span>
                            <Link to='/'>{product.category}</Link>
                            <span className='pt-1'><IoIosArrowForward /></span>
                            <span>{product.name}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className='w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[85%] 2xl:w-[85%] h-full mx-auto pb-16'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <div>
                            <div className='p-5 border border-[#e2e2e2] bg-white rounded-md shadow-sm'>
                                <img 
                                    className='h-[400px] w-full object-contain' 
                                    src={image || product.images?.[0]} 
                                    alt={product.name} 
                                />
                            </div>
                            <div className='py-3'>
                                {product.images && (
                                    <Carousel
                                        autoPlay={true}
                                        infinite={true}
                                        responsive={responsive}
                                        transitionDuration={500}
                                    >
                                        {product.images.map((img, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => setImage(img)}
                                                className="cursor-pointer"
                                            >
                                                <img 
                                                    className='h-[120px] w-full object-cover border border-[#e2e2e2] rounded-md' 
                                                    src={img} 
                                                    alt="" 
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                )}
                            </div>
                        </div>

                        <div className='flex flex-col gap-5'>
                            <div className='text-2xl md:text-3xl text-[#000033] font-bold'>
                                <h3>{product.name}</h3>
                            </div>
                            <div className='flex justify-start items-center gap-4'>
                                <div className='flex text-xl'>
                                    <Rating ratings={product.rating || 4.5} />
                                </div>
                                <span className='text-[#0077cc]'>(24 reviews)</span>
                            </div>
                            <div className='text-xl md:text-2xl text-[#d00000] font-bold flex gap-3 flex-wrap'>
                                {product.discount !== 0 ? (
                                    <>
                                        <span>Price:</span>
                                        <span className='line-through text-[#000033]/70'>${product.price}</span>
                                        <span>
                                            ${product.price - Math.floor((product.price * product.discount) / 100)} 
                                            <span className='text-[#0077cc]'> (-{product.discount}%)</span>
                                        </span>
                                    </>
                                ) : (
                                    <span>Price: ${product.price}</span>
                                )}
                            </div>
                            <div className='text-[#000033]'>
                                <p>{product.description}{'...'}</p>
                                <p className='text-[#000033] py-1 font-bold'>Shop Name: {product.shopName}</p>
                            </div>

                            <div className='flex gap-3 pb-10 border-b border-[#e2e2e2]'>
                                {product.stock ? (
                                    <>
                                        <div className='flex bg-[#f0f5ff] h-[50px] justify-center items-center text-xl rounded-md overflow-hidden'>
                                            <div 
                                                onClick={dec} 
                                                className='px-4 sm:px-6 cursor-pointer hover:bg-[#0077cc] hover:text-white transition-colors'
                                            >
                                                -
                                            </div>
                                            <div className='px-4 sm:px-6'>{quantity}</div>
                                            <div 
                                                onClick={inc} 
                                                className='px-4 sm:px-6 cursor-pointer hover:bg-[#0077cc] hover:text-white transition-colors'
                                            >
                                                +
                                            </div>
                                        </div>
                                        <div>
                                            <button 
                                                onClick={add_cart} 
                                                className='px-6 sm:px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg hover:shadow-[#0077cc]/40 bg-gradient-to-r from-[#000022] to-[#0055aa] text-white rounded-md transition-all'
                                            >
                                                Add To Cart
                                            </button>
                                        </div>
                                    </>
                                ) : null}
                                <div>
                                    <div 
                                        onClick={add_wishlist} 
                                        className='h-[50px] w-[50px] flex justify-center items-center cursor-pointer hover:shadow-lg hover:shadow-[#0077cc]/40 bg-gradient-to-r from-[#000022] to-[#0055aa] text-white rounded-md transition-all'
                                    >
                                        <FaHeart />
                                    </div>
                                </div>
                            </div>
                            <div className='flex py-5 gap-5'>
                                <div className='w-[150px] text-[#000033] font-bold text-lg flex flex-col gap-5'>
                                    <span>Availability</span>
                                    <span>Share On</span>
                                </div>
                                <div className='flex flex-col gap-5'>
                                    <span className={`${product.stock ? 'text-[#0077cc]' : 'text-[#d00000]'}`}>
                                        {product.stock ? `In Stock(${product.stock})` : 'Out Of Stock'}
                                    </span>
                                    <ul className='flex justify-start items-center gap-3'>
                                        <li>
                                            <a className='w-[38px] h-[38px] hover:bg-[#0077cc] flex justify-center items-center bg-[#000033] rounded-full text-white transition-colors' href="#">
                                                <FaFacebookF />
                                            </a>
                                        </li>
                                        <li>
                                            <a className='w-[38px] h-[38px] hover:bg-[#0077cc] flex justify-center items-center bg-[#000033] rounded-full text-white transition-colors' href="#">
                                                <FaTwitter />
                                            </a>
                                        </li>
                                        <li>
                                            <a className='w-[38px] h-[38px] hover:bg-[#0077cc] flex justify-center items-center bg-[#000033] rounded-full text-white transition-colors' href="#">
                                                <FaInstagram />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className='flex gap-3 flex-wrap'>
                                {product.stock ? (
                                    <button 
                                        onClick={buynow} 
                                        className='px-6 sm:px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg hover:shadow-[#0077cc]/40 bg-gradient-to-r from-[#001144] to-[#0066cc] text-white rounded-md transition-all'
                                    >
                                        Buy Now
                                    </button>
                                ) : null}
                                <Link 
                                    to={`/dashboard/chat/${product.sellerId}`} 
                                    className='px-6 sm:px-8 py-3 h-[50px] cursor-pointer hover:shadow-lg hover:shadow-[#d00000]/40 bg-[#d00000] text-white rounded-md transition-all'
                                >
                                    Chat Seller
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className='w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[85%] 2xl:w-[85%] h-full mx-auto pb-16'>
                    <div className='flex flex-col lg:flex-row gap-8'>
                        <div className='w-full lg:w-[72%]'>
                            <div className='pr-0 lg:pr-4'>
                                <div className='grid grid-cols-2 gap-2'>
                                    <button 
                                        onClick={() => setState('reviews')} 
                                        className={`py-2 px-4 rounded-md transition-all ${state === 'reviews' 
                                            ? 'bg-gradient-to-r from-[#000022] to-[#0055aa] text-white' 
                                            : 'bg-[#f0f5ff] text-[#000033] hover:bg-gradient-to-r hover:from-[#001144] hover:to-[#0066cc] hover:text-white'
                                        }`}
                                    >
                                        Reviews
                                    </button>
                                    <button 
                                        onClick={() => setState('description')} 
                                        className={`py-2 px-4 rounded-md transition-all ${state === 'description' 
                                            ? 'bg-gradient-to-r from-[#000022] to-[#0055aa] text-white' 
                                            : 'bg-[#f0f5ff] text-[#000033] hover:bg-gradient-to-r hover:from-[#001144] hover:to-[#0066cc] hover:text-white'
                                        }`}
                                    >
                                        Description
                                    </button>
                                </div>
                                <div className='mt-4'>
                                    {state === 'reviews' ? (
                                        <Reviews product={product} />
                                    ) : (
                                        <div className='py-5 text-[#000033] bg-white p-4 rounded-md shadow-sm'>
                                            <p>{product.description || "No description available."}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='w-full lg:w-[28%]'>
                            <div className='pl-0 lg:pl-4'>
                                <div className='px-3 py-2 text-[#000033] bg-[#f0f5ff] rounded-t-md'>
                                    <h2 className='font-bold'>From {product.shopName}</h2>
                                </div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mt-0 border border-t-0 border-[#e2e2e2] p-3 rounded-b-md bg-white'>
                                    {moreProducts.map((p, i) => (
                                        <Link key={i} to={`/product/${p.slug}`} className='block group'>
                                            <div className='relative h-[200px] overflow-hidden rounded-md'>
                                                <img 
                                                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
                                                    src={p.images[0]} 
                                                    alt={p.name} 
                                                />
                                                {p.discount !== 0 && (
                                                    <div className='flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-[#d00000] font-semibold text-xs left-2 top-2'>
                                                        {p.discount}%
                                                    </div>
                                                )}
                                            </div>
                                            <div className='mt-2'>
                                                <h2 className='text-[#000033] font-bold line-clamp-1'>{p.name}</h2>
                                                <div className='flex justify-between items-center mt-1'>
                                                    <span className='text-lg font-bold text-[#000033]'>${p.price}</span>
                                                    <Rating ratings={p.rating} />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='bg-[#f0f5ff] py-8'>
                <div className='w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[85%] 2xl:w-[85%] h-full mx-auto'>
                    <h2 className='text-2xl py-4 text-[#000033] font-bold'>Related Products</h2>
                    <div>
                        <Swiper
                            slidesPerView='auto'
                            breakpoints={{
                                1280: {
                                    slidesPerView: 4
                                },
                                1024: {
                                    slidesPerView: 3
                                },
                                768: {
                                    slidesPerView: 2
                                },
                                0: {
                                    slidesPerView: 1
                                }
                            }}
                            spaceBetween={25}
                            loop={true}
                            pagination={{
                                clickable: true,
                                el: '.custom_bullet'
                            }}
                            modules={[Pagination]}
                            className='mySwiper'
                        >
                            {relatedProducts.map((p, i) => (
                                <SwiperSlide key={i}>
                                    <Link to={`/product/${p.slug}`} className='block group'>
                                        <div className='relative h-[270px] overflow-hidden rounded-md bg-white shadow-sm'>
                                            <div className='w-full h-full'>
                                                <img 
                                                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
                                                    src={p.images[0]} 
                                                    alt={p.name} 
                                                />
                                                <div className='absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300'></div>
                                            </div>
                                            {p.discount !== 0 && (
                                                <div className='flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-[#d00000] font-semibold text-xs left-2 top-2'>
                                                    {p.discount}%
                                                </div>
                                            )}
                                        </div>
                                        <div className='p-4 flex flex-col gap-1 bg-white'>
                                            <h2 className='text-[#000033] text-lg font-bold line-clamp-1'>{p.name}</h2>
                                            <div className='flex justify-between items-center'>
                                                <span className='text-lg font-bold text-[#000033]'>${p.price}</span>
                                                <Rating ratings={p.rating} />
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className='w-full flex justify-center items-center py-4'>
                        <div className='custom_bullet justify-center gap-3 !w-auto'></div>
                    </div>
                </div>
            </section>

            <Footer/>
        </div>
    );
};

export default Details;