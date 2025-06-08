import React, { useEffect } from 'react';
import { FaEye, FaRegHeart, FaHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_to_cart, add_to_wishlist, messageClear } from '../../store/reducers/cartReducer';
import toast from 'react-hot-toast';

const FeatureProducts = ({ products }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { errorMessage, successMessage } = useSelector(state => state.cart);
    const { wishlist } = useSelector(state => state.cart);

    const add_cart = (id) => {
        if (userInfo) {
            dispatch(add_to_cart({
                userId: userInfo.id,
                quantity: 1,
                productId: id
            }));
        } else {
            navigate('/login');
        }
    };

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

    const add_wishlist = (pro) => {
        dispatch(add_to_wishlist({
            userId: userInfo.id,
            productId: pro._id,
            name: pro.name,
            price: pro.price,
            image: pro.images[0],
            discount: pro.discount,
            rating: pro.rating,
            slug: pro.slug
        }));
    };

    const isInWishlist = (id) => {
        return wishlist.some(item => item.productId === id);
    };

    return (
        <div className='w-[95%] sm:w-[90%] md:w-[85%] mx-auto py-8'>
            {/* Section Header - Matches Header component styling */}
            <div className='w-full mb-8 text-center'>
                <h2 className='text-2xl sm:text-3xl font-bold text-[#000033] mb-2'>Featured Products</h2>
                <div className='w-20 h-1 bg-gradient-to-r from-[#000022] to-[#0055aa] mx-auto rounded-full'></div>
            </div>
            
            {/* Products Grid - Fully responsive */}
            <div className='w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6'>
                {products.map((p, i) => (
                    <div key={i} className='bg-white border border-[#f0f5ff] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group'>
                        <div className='relative'>
                            {/* Discount Badge - Using header's gradient */}
                            {p.discount > 0 && (
                                <div className='absolute left-3 top-3 bg-gradient-to-r from-[#000022] to-[#0055aa] text-white text-xs font-bold px-2 py-1 rounded-full z-10'>
                                    {p.discount}% OFF
                                </div>
                            )}
                            
                            {/* Product Image */}
                            <img 
                                className='w-full h-48 sm:h-56 object-cover'
                                src={p.images[0]} 
                                alt={p.name} 
                            />
                            
                            {/* Action Buttons - Matching header's interactive elements */}
                            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100'>
                                <div className='flex gap-3'>
                                    <button 
                                        onClick={() => add_wishlist(p)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            isInWishlist(p._id) 
                                                ? 'bg-gradient-to-r from-[#000022] to-[#0055aa] text-white' 
                                                : 'bg-white text-[#000033] hover:bg-gradient-to-r hover:from-[#000022] hover:to-[#0055aa] hover:text-white'
                                        }`}
                                    >
                                        {isInWishlist(p._id) ? <FaHeart /> : <FaRegHeart />}
                                    </button>
                                    
                                    <Link 
                                        to={`/product/details/${p.slug}`}
                                        className='w-10 h-10 rounded-full bg-white text-[#000033] flex items-center justify-center hover:bg-gradient-to-r hover:from-[#000022] hover:to-[#0055aa] hover:text-white transition-all duration-300'
                                    >
                                        <FaEye />
                                    </Link>
                                    
                                    <button 
                                        onClick={() => add_cart(p._id)}
                                        className='w-10 h-10 rounded-full bg-white text-[#000033] flex items-center justify-center hover:bg-gradient-to-r hover:from-[#000022] hover:to-[#0055aa] hover:text-white transition-all duration-300'
                                    >
                                        <RiShoppingCartLine />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Product Info */}
                        <div className='p-4'>
                            <Link to={`/product/details/${p.slug}`}>
                                <h3 className='text-[#000033] font-medium text-sm sm:text-base mb-1 hover:text-[#0077cc] transition-colors line-clamp-1'>
                                    {p.name}
                                </h3>
                            </Link>
                            <div className='flex justify-between items-center mt-2'>
                                <div className='flex items-center gap-2'>
                                    <span className='text-[#000033] font-bold text-lg'>
                                        ${(p.price - (p.price * (p.discount/100))).toFixed(2)}
                                    </span>
                                    {p.discount > 0 && (
                                        <span className='text-slate-400 text-sm line-through'>
                                            ${p.price.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <Rating ratings={p.rating} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureProducts;