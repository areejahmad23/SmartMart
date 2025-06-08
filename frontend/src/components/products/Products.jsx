import React, { useRef } from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Rating from '../Rating';

const Products = ({ title, products }) => {
    const carouselRef = useRef();

    const responsive = {
        xxl: {
            breakpoint: { max: 4000, min: 1536 },
            items: 1
        },
        xl: {
            breakpoint: { max: 1536, min: 1280 },
            items: 1
        },
        lg: {
            breakpoint: { max: 1280, min: 1024 },
            items: 1
        },
        md: {
            breakpoint: { max: 1024, min: 768 },
            items: 1
        },
        sm: {
            breakpoint: { max: 768, min: 640 },
            items: 1
        },
        xs: {
            breakpoint: { max: 640, min: 0 },
            items: 1
        }
    };

    const CustomButtonGroup = ({ next, previous }) => {
        return (
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-[#000033]'>{title}</h2>
                <div className='flex gap-2'>
                    <button 
                        onClick={previous}
                        className='w-10 h-10 flex justify-center items-center rounded-full bg-[#f0f5ff] text-[#000033] hover:bg-[#0077cc] hover:text-white transition-colors'
                        aria-label="Previous products"
                    >
                        <IoIosArrowBack />
                    </button>
                    <button 
                        onClick={next}
                        className='w-10 h-10 flex justify-center items-center rounded-full bg-[#f0f5ff] text-[#000033] hover:bg-[#0077cc] hover:text-white transition-colors'
                        aria-label="Next products"
                    >
                        <IoIosArrowForward />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className='w-[95%] sm:w-[90%] md:w-[85%] mx-auto py-8'>
            {/* Header and navigation buttons placed above the carousel */}
            <CustomButtonGroup
                next={() => carouselRef.current.next()}
                previous={() => carouselRef.current.previous()}
            />
            
            {/* Carousel component */}
            <Carousel
                ref={carouselRef}
                autoPlay={false}
                infinite={true}
                arrows={false}
                responsive={responsive}
                transitionDuration={300}
                renderButtonGroupOutside={false}
                itemClass="px-3"
                containerClass="pb-4"
                partialVisible={false}
            >
                {products.map((productGroup, i) => (
                    <div key={i} className='flex flex-col gap-4 h-full'>
                        {productGroup.map((product, j) => (
                            <Link 
                                key={j} 
                                to={`/product/details/${product.slug}`}
                                className='flex items-center gap-4 p-3 rounded-lg bg-white border border-[#f0f5ff] hover:shadow-md transition-all duration-300'
                            >
                                <div className='flex-shrink-0'>
                                    <img 
                                        className='w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-md'
                                        src={product.images[0]}  
                                        alt={product.name}
                                        loading='lazy'
                                    />
                                </div>
                                <div className='flex-1'>
                                    <h3 className='text-[#000033] font-medium line-clamp-2 mb-1 hover:text-[#0077cc] transition-colors'>
                                        {product.name}
                                    </h3>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <Rating ratings={product.rating} />
                                        <span className='text-sm text-slate-500'>({product.reviews?.length || 0})</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-lg font-bold text-[#000033]'>
                                            ${(product.price - (product.price * (product.discount/100))).toFixed(2)}
                                        </span>
                                        {product.discount > 0 && (
                                            <span className='text-sm text-slate-400 line-through'>
                                                ${product.price.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Products;