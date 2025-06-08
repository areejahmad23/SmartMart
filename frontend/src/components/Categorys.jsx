import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { useSelector } from "react-redux";

const Categorys = () => {
    const { categorys } = useSelector(state => state.home);
    
    const responsive = {
        xxl: {
            breakpoint: { max: 4000, min: 1536 },
            items: 6,
            partialVisibilityGutter: 30
        },
        xl: {
            breakpoint: { max: 1536, min: 1280 },
            items: 5,
            partialVisibilityGutter: 25
        },
        lg: {
            breakpoint: { max: 1280, min: 1024 },
            items: 4,
            partialVisibilityGutter: 20
        },
        md: {
            breakpoint: { max: 1024, min: 768 },
            items: 3,
            partialVisibilityGutter: 15
        },
        sm: {
            breakpoint: { max: 768, min: 640 },
            items: 2,
            partialVisibilityGutter: 15
        },
        xs: {
            breakpoint: { max: 640, min: 0 },
            items: 2,
            partialVisibilityGutter: 10
        }
    };

    return (
        <section className='w-[95%] sm:w-[90%] md:w-[85%] mx-auto py-12'>
            {/* Section Header */}
            <div className='w-full mb-12 text-center'>
                <h2 className='text-3xl md:text-4xl font-bold text-[#000033] mb-4'>Explore Categories</h2>
                <div className='w-24 h-1 bg-gradient-to-r from-[#000022] to-[#0055aa] mx-auto rounded-full'></div>
            </div>
            
            <Carousel
                autoPlay={{ delay: 3000 }}
                infinite={true}
                arrows={true}
                responsive={responsive}
                transitionDuration={500}
                itemClass="px-2"
                containerClass="pb-2"
                partialVisible={false}
                centerMode={false}
                swipeable={true}
                draggable={true}
                showDots={false}
                customLeftArrow={<CustomArrow left />}
                customRightArrow={<CustomArrow right />}
            >
                {categorys.map((c, i) => (
                    <div key={i} className="h-full px-2">
                        <Link 
                            to={`/products?category=${c.name}`} 
                            className='group block h-full rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]'
                        >
                            <div className='relative aspect-square w-full overflow-hidden'>
                                {/* Image with perfect aspect ratio and no cropping */}
                                <img 
                                    src={c.image} 
                                    alt={c.name}
                                    className='w-full h-full object-contain object-center bg-white'
                                    loading='lazy'
                                />
                                
                                {/* Semi-transparent overlay (always visible) */}
                                <div className='absolute inset-0 bg-black/30'></div>
                                
                                {/* Gradient overlay at bottom */}
                                <div className='absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent'></div>
                                
                                {/* Category name */}
                                <div className='absolute bottom-0 left-0 right-0 p-4 text-center'>
                                    <h3 className='text-xl font-bold text-white drop-shadow-lg transition-colors duration-300'>
                                        {c.name}
                                    </h3>
                                    <span className='inline-block mt-1 text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                        Shop Now →
                                    </span>
                                </div>
                                
                                {/* Hover effect - now more subtle */}
                                <div className='absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300'></div>
                            </div>
                        </Link>
                    </div>
                ))}
            </Carousel>
        </section>
    );
};

// Custom arrow component for better control
const CustomArrow = ({ left, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`absolute ${left ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#000033] hover:bg-[#0077cc] hover:text-white transition-all`}
            aria-label={left ? 'Previous' : 'Next'}
        >
            {left ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            )}
        </button>
    );
};

export default Categorys;