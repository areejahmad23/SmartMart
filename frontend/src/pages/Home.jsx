import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Categorys from '../components/Categorys';
import FeatureProducts from '../components/products/FeatureProducts';
import Products from '../components/products/Products';
import Footer from '../components/Footer';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_products } from '../store/reducers/homeReducer';

const Home = () => {
    const dispatch = useDispatch()
    const { products, latest_product, topRated_product, discount_product } = useSelector(state => state.home)
    
    useEffect(() => {
        dispatch(get_products())
    }, [dispatch])

    return (
        <div className='w-full bg-white'>
            <Header />
            <Banner />
            <Categorys />
            
            {/* Featured Products Section */}
            <div className='py-12 lg:py-10 md:py-8 sm:py-6'>
                <div className='w-[85%] xl:w-[90%] lg:w-[95%] md:w-[95%] sm:w-[95%] mx-auto'>
                    <FeatureProducts products={products} />
                </div>
            </div>

            {/* Product Grid Section */}
            <div className='w-[85%] xl:w-[90%] lg:w-[95%] md:w-[95%] sm:w-[95%] mx-auto pb-16 lg:pb-12 md:pb-10 sm:pb-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6 sm:gap-4'>
                    <div className='overflow-hidden'>
                        <Products title='Latest Products' products={latest_product} />
                    </div>
                    <div className='overflow-hidden'>
                        <Products title='Top Rated Products' products={topRated_product} />
                    </div>
                    <div className='overflow-hidden'>
                        <Products title='Discount Products' products={discount_product} />
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default Home;