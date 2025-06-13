import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { customer_register, messageClear } from '../store/reducers/authReducer';
import toast from 'react-hot-toast';
import { FadeLoader } from 'react-spinners';

const Register = () => {
    const navigate = useNavigate();
    const { loader, errorMessage, successMessage, userInfo } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [state, setState] = useState({ 
        name: '',
        email: '',
        password: ''
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const register = (e) => {
        e.preventDefault();
        dispatch(customer_register(state));
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
        if (userInfo) {
            navigate('/');
        }
    }, [successMessage, errorMessage, userInfo, navigate, dispatch]);

    return (
        <div className="bg-[#f8f9fa] min-h-screen flex flex-col">
            <Header />
            {loader && (
                <div className='fixed inset-0 flex justify-center items-center bg-[#38303033] z-[999]'>
                    <FadeLoader color="#0077cc" />
                </div>
            )}
            
            <main className="flex-grow py-8">
                <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                        {/* Registration Form */}
                        <div className="w-full md:w-1/2 p-8">
                            <h2 className='text-2xl font-bold text-[#000033] text-center mb-6'>Register</h2> 
                            
                            <form onSubmit={register} className="space-y-4">
                                <div className="space-y-1">
                                    <label htmlFor="name" className="text-[#000033] font-medium">Name</label>
                                    <input 
                                        onChange={inputHandle} 
                                        value={state.name}  
                                        className="w-full px-4 py-2 border border-[#e2e2e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077cc]"
                                        type="text" 
                                        name="name" 
                                        id="name" 
                                        placeholder='Your name' 
                                        required 
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="email" className="text-[#000033] font-medium">Email</label>
                                    <input 
                                        onChange={inputHandle} 
                                        value={state.email}  
                                        className="w-full px-4 py-2 border border-[#e2e2e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077cc]"
                                        type="email" 
                                        name="email" 
                                        id="email" 
                                        placeholder='your@email.com' 
                                        required 
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="password" className="text-[#000033] font-medium">Password</label>
                                    <input 
                                        onChange={inputHandle} 
                                        value={state.password}  
                                        className="w-full px-4 py-2 border border-[#e2e2e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077cc]"
                                        type="password" 
                                        name="password" 
                                        id="password" 
                                        placeholder='••••••••' 
                                        required 
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full py-2 bg-[#0077cc] text-white font-medium rounded-md hover:bg-[#0055aa] transition-colors"
                                >
                                    Register
                                </button>
                            </form>

                            <div className="flex items-center my-6">
                                <div className="flex-grow border-t border-[#e2e2e2]"></div>
                                <span className="px-3 text-[#666]">Or</span>
                                <div className="flex-grow border-t border-[#e2e2e2]"></div>
                            </div>

                            {/* <div className="space-y-3">
                                <button className="w-full py-2 bg-[#3b5998] text-white rounded-md flex justify-center items-center gap-2 hover:bg-[#2d4373] transition-colors">
                                    <FaFacebookF />
                                    <span>Register with Facebook</span>
                                </button>

                                <button className="w-full py-2 bg-[#db4437] text-white rounded-md flex justify-center items-center gap-2 hover:bg-[#c1351d] transition-colors">
                                    <FaGoogle />
                                    <span>Register with Google</span>
                                </button>
                            </div> */}

                            <div className="text-center text-[#666] mt-6">
                                <p>Already have an account? <Link to='/login' className="text-[#0077cc] hover:underline">Login</Link></p>
                            </div>

                            <div className="mt-4 space-y-3">
                                <a 
                                    href="http://localhost:3001/login" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block w-full py-2 bg-[#000033] text-white text-center rounded-md hover:bg-[#000022] transition-colors"
                                >
                                    Login as a Seller
                                </a>
                                <a 
                                    href="http://localhost:3001/register" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block w-full py-2 bg-[#0077cc] text-white text-center rounded-md hover:bg-[#0055aa] transition-colors"
                                >
                                    Register as a Seller
                                </a>
                            </div>
                        </div>

                        {/* Registration Image */}
                        <div className="hidden md:block md:w-1/2 bg-[#0077cc]">
                            <img 
                                src="http://localhost:3000/images/login.jpg" 
                                alt="Registration visual" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Register;