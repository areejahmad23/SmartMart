import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { Range } from 'react-range';
import { AiFillStar } from 'react-icons/ai';
import { CiStar } from 'react-icons/ci'; 
import Products from '../components/products/Products';
import { BsFillGridFill } from 'react-icons/bs';
import { FaThList } from 'react-icons/fa';
import ShopProducts from '../components/products/ShopProducts';
import Pagination from '../components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { price_range_product, query_products } from '../store/reducers/homeReducer';

const Shops = () => {
    const dispatch = useDispatch();
    const { products, categorys, priceRange, latest_product, totalProduct, parPage } = useSelector(state => state.home);

    useEffect(() => { 
        dispatch(price_range_product());
    }, [dispatch]);

    useEffect(() => { 
        setState({
            values: [priceRange.low, priceRange.high]
        });
    }, [priceRange]);

    const [filter, setFilter] = useState(true);
    const [state, setState] = useState({ values: [priceRange.low, priceRange.high] });
    const [rating, setRating] = useState('');
    const [styles, setStyles] = useState('grid');
    const [pageNumber, setPageNumber] = useState(1);
    const [sortPrice, setSortPrice] = useState('');
    const [category, setCategory] = useState('');

    const queryCategory = (e, value) => {
        if (e.target.checked) {
            setCategory(value);
        } else {
            setCategory('');
        }
    };

    useEffect(() => { 
        dispatch(
            query_products({
                low: state.values[0],
                high: state.values[1],
                category,
                rating,
                sortPrice,
                pageNumber
            })
        );
    }, [state.values[0], state.values[1], category, rating, sortPrice, pageNumber, dispatch]);
    
    const resetRating = () => {
        setRating('');
        dispatch(
            query_products({
                low: state.values[0],
                high: state.values[1],
                category,
                rating: '',
                sortPrice,
                pageNumber
            })
        );
    };

    return (
        <div className="bg-[#f8f9fa]">
            <Header/>
            {/* Banner Section */}
            <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
                    <div className='w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[85%] 2xl:w-[85%] h-full mx-auto'>
                        <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
                            <h2 className='text-2xl sm:text-3xl font-bold'>Shop Page</h2>
                            <div className='flex justify-center items-center gap-2 text-lg sm:text-xl w-full'>
                                <Link to='/'>Home</Link>
                                <span className='pt-1'>
                                    <IoIosArrowForward />
                                </span>
                                <span>Shop</span>
                            </div>
                        </div> 
                    </div> 
                </div> 
            </section>

            {/* Main Shop Content */}
            <section className='py-8 sm:py-12 lg:py-16'>
                <div className='w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[85%] 2xl:w-[85%] mx-auto'>
                    {/* Filter Toggle Button - Mobile Only */}
                    <div className='sm:hidden mb-4'>
                        <button 
                            onClick={() => setFilter(!filter)} 
                            className='w-full py-2 px-3 bg-gradient-to-r from-[#000022] to-[#0055aa] text-white rounded-md'
                        >
                            {filter ? 'Show Filters' : 'Hide Filters'}
                        </button> 
                    </div>

                    <div className='w-full flex flex-wrap'>
                        {/* Filters Sidebar */}
                        <div className={`w-full sm:w-3/12 ${filter ? 'block' : 'hidden sm:block'} pr-0 sm:pr-4`}>
                            <div className='bg-white p-4 rounded-md shadow-sm mb-6'>
                                <h2 className='text-xl sm:text-2xl font-bold mb-3 text-[#000033]'>Category</h2>
                                <div className='py-2'>
                                    {categorys.map((c, i) => (
                                        <div key={i} className='flex justify-start items-center gap-2 py-1'>
                                            <input 
                                                checked={category === c.name} 
                                                onChange={(e) => queryCategory(e, c.name)} 
                                                type="checkbox" 
                                                id={c.name} 
                                                className='text-[#0077cc]'
                                            />
                                            <label className='text-[#000033] block cursor-pointer' htmlFor={c.name}>
                                                {c.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='bg-white p-4 rounded-md shadow-sm mb-6'>
                                <h2 className='text-xl sm:text-2xl font-bold mb-3 text-[#000033]'>Price</h2>
                                <div className='py-2 flex flex-col gap-5'>
                                    <Range
                                        step={5}
                                        min={priceRange.low}
                                        max={priceRange.high}
                                        values={state.values}
                                        onChange={(values) => setState({ values })}
                                        renderTrack={({ props, children }) => (
                                            <div {...props} className='w-full h-[6px] bg-[#e2e2e2] rounded-full cursor-pointer'>
                                                {children}
                                            </div>
                                        )}
                                        renderThumb={({ props }) => (
                                            <div className='w-[15px] h-[15px] bg-[#0077cc] rounded-full' {...props} />
                                        )} 
                                    />  
                                    <div>
                                        <span className='text-[#000033] font-bold text-lg'>
                                            ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
                                        </span>  
                                    </div>
                                </div>
                            </div>

                            <div className='bg-white p-4 rounded-md shadow-sm'>
                                <h2 className='text-xl sm:text-2xl font-bold mb-3 text-[#000033]'>Rating</h2>
                                <div className='flex flex-col gap-3'>
                                    {[5, 4, 3, 2, 1].map((stars) => (
                                        <div 
                                            key={stars} 
                                            onClick={() => setRating(stars)} 
                                            className='text-orange-500 flex justify-start items-center gap-1 text-xl cursor-pointer'
                                        >
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>
                                                    {i < stars ? <AiFillStar/> : <CiStar/>}
                                                </span>
                                            ))}
                                        </div>
                                    ))}
                                    <div onClick={resetRating} className='text-orange-500 flex justify-start items-center gap-1 text-xl cursor-pointer'>
                                        {[...Array(5)].map((_, i) => <CiStar key={i}/>)}
                                    </div> 
                                </div> 
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className='w-full sm:w-9/12'>
                            <div className='pl-0 sm:pl-4'>
                                <div className='py-4 bg-white mb-6 px-4 rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-start border border-[#e2e2e2]'>
                                    <h2 className='text-lg font-medium text-[#000033] mb-2 sm:mb-0'>
                                        {totalProduct} Products
                                    </h2>
                                    <div className='flex justify-between items-center gap-3 w-full sm:w-auto'>
                                        <select 
                                            onChange={(e) => setSortPrice(e.target.value)}
                                            className='p-2 border border-[#e2e2e2] outline-0 text-[#000033] font-medium rounded-md'
                                        >
                                            <option value="">Sort By</option>
                                            <option value="low-to-high">Low to High Price</option>
                                            <option value="high-to-low">High to Low Price</option>
                                        </select>
                                        <div className='flex justify-center items-center gap-2'>
                                            <button 
                                                onClick={() => setStyles('grid')} 
                                                className={`p-2 ${styles === 'grid' ? 'bg-[#0077cc] text-white' : 'bg-[#f0f5ff] text-[#000033]'} rounded-md hover:bg-[#0077cc] hover:text-white transition-colors`}
                                            >
                                                <BsFillGridFill/>  
                                            </button>
                                            <button 
                                                onClick={() => setStyles('list')} 
                                                className={`p-2 ${styles === 'list' ? 'bg-[#0077cc] text-white' : 'bg-[#f0f5ff] text-[#000033]'} rounded-md hover:bg-[#0077cc] hover:text-white transition-colors`}
                                            >
                                                <FaThList/>  
                                            </button> 
                                        </div> 
                                    </div> 
                                </div> 

                                {/* Main Products Grid */}
                                <div className='pb-8'>
                                    <ShopProducts products={products} styles={styles} />  
                                    
                                    {/* Pagination - Now placed right after main products */}
                                    {totalProduct > parPage && (
                                        <div className='mt-8'>
                                            <Pagination 
                                                pageNumber={pageNumber} 
                                                setPageNumber={setPageNumber} 
                                                totalItem={totalProduct} 
                                                parPage={parPage} 
                                                showItem={Math.floor(totalProduct / parPage)} 
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Latest Products Section - Now placed below pagination */}
                                <div className='bg-white p-4 rounded-md shadow-sm mb-6'>
                                    <Products title='Latest Products' products={latest_product} />
                                </div>
                            </div> 
                        </div>  
                    </div>
                </div> 
            </section>

            <Footer/>
        </div>
    );
};

export default Shops;