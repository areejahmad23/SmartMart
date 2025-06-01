import React from 'react';
import { FaList } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Header = ({ showSidebar, setShowSidebar }) => {
  const { userInfo } = useSelector(state => state.auth);
  
  return (
    <div className='fixed top-0 left-0 w-full z-40'>
      <div className='ml-0 lg:ml-[260px] h-[80px] flex justify-between items-center bg-[#ffffff] px-5 transition-all shadow-lg'>
        {/* Left side - Sidebar toggle (mobile only) */}
        <div
          onClick={() => setShowSidebar(!showSidebar)}
          className='w-[35px] flex lg:hidden h-[35px] rounded-sm bg-[#0077cc] shadow-lg hover:shadow-[#0077cc]/50 justify-center items-center cursor-pointer transition-all duration-300 hover:scale-105'
        >
          <span className='text-white'><FaList /></span>
        </div>

        {/* Middle spacer - Takes up remaining space */}
        <div className='flex-1'></div>

        {/* Right side - Profile section */}
        <div className='flex justify-center items-center gap-8'>
          <div className='flex items-center gap-3'>
            {/* User info text */}
            <div className='text-right'>
              <h2 className='text-md font-bold text-[#000000]'>{userInfo.name}</h2>
              <span className='text-[14px] font-normal text-[#000000]'>{userInfo.role}</span>
            </div>
            
            {/* User avatar */}
            {userInfo.role === 'admin' ? (
              <img 
                className='w-[45px] h-[45px] rounded-full object-cover border-2 border-[#0077cc]'
                src="http://localhost:3001/images/admin.jpg" 
                alt="Admin" 
              />
            ) : (
              <img 
                className='w-[45px] h-[45px] rounded-full object-cover border-2 border-[#0077cc]'
                src={userInfo.image} 
                alt="User" 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;