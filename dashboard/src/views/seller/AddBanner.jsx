import React, { useState, useEffect } from 'react';
import { FaRegImage } from "react-icons/fa";
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_banner, messageClear, get_banner,update_banner } from '../../store/Reducers/bannerReducer';
import toast from 'react-hot-toast';

const AddBanner = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const { loader, successMessage, errorMessage, banner } = useSelector(state => state.banner);

    const [imageShow, setImageShow] = useState('');
    const [image, setImage] = useState('');

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

    useEffect(() => {
        dispatch(get_banner(productId));
    }, [productId, dispatch]);

    const imageHandle = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setImage(files[0]);
            setImageShow(URL.createObjectURL(files[0]));
        }
    };

    const add = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('productId', productId);
        formData.append('mainban', image);
        dispatch(add_banner(formData));
    };

    const update = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('mainban',image)
        dispatch(update_banner({info:formData,bannerId: banner._id}))
    }



    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[#000000] font-semibold text-lg mb-3'>Add Banner</h1>
            <div className='w-full p-4 bg-[#ffffff] rounded-md border border-[#000033]'>
                <div className='flex justify-between items-center pb-4'>
                    {!banner ? (
                        <form onSubmit={add}>
                            <div className='mb-4'>
                                <label
                                    className='flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-[#000033] w-full text-[#000033]'
                                    htmlFor="image"
                                >
                                    <span className='text-4xl'><FaRegImage /></span>
                                    <span>Select Banner Image</span>
                                </label>
                                <input required onChange={imageHandle} className='hidden' type="file" id='image' />
                            </div>
                            {imageShow && (
                                <div className='mb-4'>
                                    <img className='w-full h-[300px]' src={imageShow} alt="Preview" />
                                </div>
                            )}
                            <button
                                disabled={loader}
                                className='bg-[#0077cc] w-[280px] hover:shadow-[#0077cc]/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'
                            >
                                {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Update Banner'}
                            </button>
                        </form>
                    ) : (
                        <div className='w-full'>
                            <div className='mb-4'>
                                <img className='w-full h-[300px]' src={banner.banner} alt="Current Banner" />
                            </div>
                            <form onSubmit={update}>
                                <div className='mb-4'>
                                    <label
                                        className='flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-[#1c2b36] w-full text-white'
                                        htmlFor="image"
                                    >
                                        <span className='text-4xl'><FaRegImage /></span>
                                        <span>Select New Banner Image</span>
                                    </label>
                                    <input required onChange={imageHandle} className='hidden' type="file" id='image' />
                                </div>
                                {imageShow && (
                                    <div className='mb-4'>
                                        <img className='w-full h-[300px]' src={imageShow} alt="Preview" />
                                    </div>
                                )}
                                <button
                                    disabled={loader}
                                    className='bg-[#0077cc] w-[280px] hover:shadow-red-300/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'
                                >
                                    {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Update Banner'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddBanner;
