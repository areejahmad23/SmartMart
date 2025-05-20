import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { admin_login, messageClear } from '../../store/Reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector((state) => state.auth);

  const [state, setState] = useState({
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
    dispatch(admin_login(state));
  };

  const overrideStyle = {
    display: 'flex',
    margin: '0 auto',
    height: '24px',
    justifyContent: 'center',
    alignItems: 'center',
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate('/');
    }
  }, [errorMessage, dispatch, successMessage, navigate]);

  return (
    <div className='min-w-screen min-h-screen bg-[#f2f2f2] flex justify-center items-center'>
      <div className='w-[350px] p-2 text-[#000000]'>
        <div className='bg-[#ffffff] p-6 rounded-md shadow-lg'>
          {/* Logo Section */}
          <div className='h-[70px] flex justify-center items-center'>
            <div className='w-[180px] h-[50px]'>
              <img
                className='w-full h-full'
                src='http://localhost:3000/images/logo.png'
                alt='logo'
              />
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={submit}>
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

            {/* Login Button */}
            <button
              disabled={loader}
              className='bg-[#0077cc] w-full hover:shadow-[#0077cc]/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'
            >
              {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;