import React, { useEffect } from 'react';
import { FaEye, FaRegHeart, FaHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_to_cart, add_to_wishlist, messageClear } from '../../store/reducers/cartReducer';
import toast from 'react-hot-toast';

const ShopProducts = ({ styles = 'grid', products }) => {
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
        if (userInfo) {
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
        } else {
            navigate('/login');
        }
    };

    const isInWishlist = (id) => {
        return wishlist.some(item => item.productId === id);
    };

    return (
        <div className={`w-full grid ${
            styles === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' 
                : 'grid-cols-1'
        } gap-6`}>
            {products.map((p) => (
                <div 
                    key={p._id}
                    className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
                        styles === 'list' ? 'flex flex-col sm:flex-row' : ''
                    }`}
                >
                    {/* Product Image */}
                    <div className={`relative group ${
                        styles === 'grid' 
                            ? 'w-full aspect-square' 
                            : 'w-full sm:w-1/3 aspect-square sm:aspect-auto sm:h-full'
                    }`}>
                        <img 
                            className="w-full h-full object-cover"
                            src={p.images[0]} 
                            alt={p.name}
                            loading="lazy"
                        />
                        
                        {/* Product Actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => add_wishlist(p)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                                        isInWishlist(p._id) 
                                            ? 'bg-gradient-to-r from-[#000022] to-[#0055aa] text-white' 
                                            : 'bg-white text-[#000033] hover:bg-gradient-to-r hover:from-[#000022] hover:to-[#0055aa] hover:text-white'
                                    }`}
                                >
                                    {isInWishlist(p._id) ? <FaHeart /> : <FaRegHeart />}
                                </button>
                                <Link 
                                    to={`/product/details/${p.slug}`}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#000033] hover:bg-gradient-to-r hover:from-[#000022] hover:to-[#0055aa] hover:text-white transition-all"
                                >
                                    <FaEye />
                                </Link>
                                <button 
                                    onClick={() => add_cart(p._id)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#000033] hover:bg-gradient-to-r hover:from-[#000022] hover:to-[#0055aa] hover:text-white transition-all"
                                >
                                    <RiShoppingCartLine />
                                </button>
                            </div>
                        </div>
                        
                        {/* Discount Badge */}
                        {p.discount > 0 && (
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-[#000022] to-[#0055aa] text-white text-xs font-bold px-2 py-1 rounded-full">
                                {p.discount}% OFF
                            </div>
                        )}
                    </div>
                    
                    {/* Product Info */}
                    <div className={`p-4 ${
                        styles === 'list' ? 'sm:w-2/3' : ''
                    }`}>
                        <Link to={`/product/details/${p.slug}`}>
                            <h3 className="text-lg font-bold text-[#000033] hover:text-[#0077cc] transition-colors mb-2 line-clamp-2">
                                {p.name}
                            </h3>
                        </Link>
                        
                        <div className="flex items-center gap-2 mb-2">
                            <Rating ratings={p.rating} />
                            <span className="text-sm text-slate-500">({p.reviews?.length || 0})</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-[#000033]">
                                ${(p.price - (p.price * (p.discount/100))).toFixed(2)}
                            </span>
                            {p.discount > 0 && (
                                <span className="text-sm text-slate-400 line-through">
                                    ${p.price.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShopProducts;