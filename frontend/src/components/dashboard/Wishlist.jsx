import React, { useEffect } from 'react';
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_wishlist_product, remove_wishlist, messageClear } from '../../store/reducers/cartReducer';
import toast from 'react-hot-toast';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { wishlist, successMessage } = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(get_wishlist_product(userInfo.id));
    }, [dispatch, userInfo.id]);

    useEffect(() => { 
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());  
        }   
    }, [successMessage, dispatch]);

    return (
        <div className="bg-[#f8f9fa] min-h-screen p-6">
            <div className="w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[85%] 2xl:w-[85%] mx-auto">
                <h1 className="text-2xl font-bold text-[#000033] mb-6">Your Wishlist</h1>
                
                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <h2 className="text-xl text-[#666] mb-4">Your wishlist is empty</h2>
                        <Link 
                            to="/shops" 
                            className="px-6 py-2 bg-[#0077cc] text-white rounded-md inline-block hover:bg-[#0055aa] transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((p, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                <div className="relative overflow-hidden">
                                    {p.discount !== 0 && (
                                        <div className="absolute left-2 top-2 w-9 h-9 flex justify-center items-center rounded-full bg-red-500 text-white font-semibold text-xs z-10">
                                            {p.discount}%
                                        </div>
                                    )}
                                    
                                    <img 
                                        className="w-full h-60 object-cover" 
                                        src={p.image} 
                                        alt={p.name} 
                                    />
                                    
                                    <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-3 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                        <button 
                                            onClick={() => dispatch(remove_wishlist(p._id))}
                                            className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-[#0077cc] hover:text-white transition-colors"
                                            title="Remove from wishlist"
                                        >
                                            <FaRegHeart />
                                        </button>
                                        
                                        <Link 
                                            to={`/product/details/${p.slug}`}
                                            className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-[#0077cc] hover:text-white transition-colors"
                                            title="View details"
                                        >
                                            <FaEye />
                                        </Link>
                                        
                                        <button 
                                            className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-[#0077cc] hover:text-white transition-colors"
                                            title="Add to cart"
                                        >
                                            <RiShoppingCartLine />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h2 className="font-bold text-[#000033] mb-2 line-clamp-1">{p.name}</h2>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-semibold text-[#0077cc]">
                                                ${(p.price - (p.price * p.discount / 100)).toFixed(2)}
                                            </span>
                                            {p.discount !== 0 && (
                                                <span className="text-sm line-through text-[#999]">
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
                )}
            </div>
        </div>
    );
};

export default Wishlist;