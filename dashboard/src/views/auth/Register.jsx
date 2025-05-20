import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { seller_register, messageClear } from '../../store/Reducers/authReducer';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage } = useSelector((state) => state.auth);

  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    dispatch(seller_register(state));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate('/');
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  return (
    <div className='min-w-screen min-h-screen bg-[#f2f2f2] flex justify-center items-center'>
      <div className='w-[350px] p-2 text-[#000000]'>
        <div className='bg-[#ffffff] p-6 rounded-md shadow-lg'>
          <h2 className='text-xl font-bold mb-3 text-center'>Welcome to SmartMart</h2>
          <p className='text-sm mb-3 font-medium text-center'>Please register your account</p>
          <form onSubmit={submit}>
            {/* Name Input */}
            <div className='flex flex-col w-full gap-1 mb-3'>
              <label htmlFor='name'>Name</label>
              <input
                onChange={inputHandle}
                value={state.name}
                className='px-3 py-2 outline-none border border-[#0077cc] bg-transparent rounded-md'
                type='text'
                name='name'
                placeholder='Name'
                id='name'
                required
              />
            </div>

            {/* Email Input */}
            <div className='flex flex-col w-full gap-1 mb-3'>
              <label htmlFor='email'>Email</label>
              <input
                onChange={inputHandle}
                value={state.email}
                className='px-3 py-2 outline-none border border-[#0077cc] bg-transparent rounded-md'
                type='email'
                name='email'
                placeholder='Email'
                id='email'
                required
              />
            </div>

            {/* Password Input */}
            <div className='flex flex-col w-full gap-1 mb-3'>
              <label htmlFor='password'>Password</label>
              <input
                onChange={inputHandle}
                value={state.password}
                className='px-3 py-2 outline-none border border-[#0077cc] bg-transparent rounded-md'
                type='password'
                name='password'
                placeholder='Password'
                id='password'
                required
              />
            </div>

            {/* Terms and Conditions */}
            <div className='flex items-center w-full gap-3 mb-3'>
              <input
                className='w-4 h-4 text-[#0077cc] overflow-hidden bg-gray-200 rounded border-gray-300 focus:ring-[#0077cc]'
                type='checkbox'
                name='checkbox'
                id='checkbox'
                required
              />
              <label htmlFor='checkbox'>I agree to privacy policy & terms</label>
            </div>

            {/* Sign Up Button */}
            <button
              disabled={loader}
              className='bg-[#0077cc] w-full hover:shadow-[#0077cc]/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'
            >
              {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Sign Up'}
            </button>

            {/* Login Link */}
            <div className='flex items-center mb-3 gap-3 justify-center'>
              <p>
                Already have an account?{' '}
                <Link className='font-bold text-[#0077cc]' to='/login'>
                  Sign In
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className='w-full flex justify-center items-center mb-3'>
              <div className='w-[45%] bg-[#0077cc] h-[1px]'></div>
              <div className='w-[10%] flex justify-center items-center'>
                <span className='pb-1'>Or</span>
              </div>
              <div className='w-[45%] bg-[#0077cc] h-[1px]'></div>
            </div>

            {/* Social Login Buttons */}
            <div className='flex justify-center items-center gap-3'>
              <div className='w-[40px] h-[35px] flex rounded-sm bg-[#ff0000] shadow-lg hover:shadow-[#ff0000]/50 justify-center cursor-pointer items-center overflow-hidden'>
                <span>
                  <FaGoogle className='text-[#ffffff]' />
                </span>
              </div>

              <div className='w-[40px] h-[35px] flex rounded-sm bg-[#3b5998] shadow-lg hover:shadow-[#3b5998]/50 justify-center cursor-pointer items-center overflow-hidden'>
                <span>
                  <FaFacebookF className='text-[#ffffff]' />
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;