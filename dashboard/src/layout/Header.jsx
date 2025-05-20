import React from 'react';
import { FaList } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Header = ({ showSidebar, setShowSidebar }) => {
  const {userInfo } = useSelector(state => state.auth)
  return (
    <div className='fixed top-0 left-0 w-full z-40'>
      <div className='ml-0 lg:ml-[260px] h-[80px] flex justify-between items-center bg-[#ffffff] px-5 transition-all shadow-lg'>
        {/* Sidebar Toggle Button */}
        <div
          onClick={() => setShowSidebar(!showSidebar)}
          className='w-[35px] flex lg:hidden h-[35px] rounded-sm bg-[#0077cc] shadow-lg hover:shadow-[#0077cc]/50 justify-center items-center cursor-pointer transition-all duration-300 hover:scale-105'
        >
          <span className='text-white'><FaList /></span>
        </div>

        {/* Search Bar */}
        <div className='hidden md:block'>
          <input
            className='px-3 py-2 outline-none border bg-transparent border-[#0077cc] rounded-md text-[#000000] placeholder-[#000000] focus:border-[#0077cc] overflow-hidden hover:shadow-md transition-all duration-300'
            type='text'
            name='search'
            placeholder='Search'
          />
        </div>

        {/* Profile Section */}
        <div className='flex justify-center items-center gap-8 relative'>
          <div className='flex justify-center items-center'>
            <div className='flex justify-center items-center gap-3'>
              <div className='flex justify-center items-center flex-col text-end'>
                <h2 className='text-md font-bold text-[#000000]'>{ userInfo.name }</h2>
                <span className='text-[14px] w-full font-normal text-[#000000]'>{ userInfo.role }</span>
              </div>
              {
                 userInfo.role === 'admin' ? <img className='w-[45px] h-[45px] rounded-full overflow-hidden' src="http://localhost:3001/images/admin.jpg" alt="" />  : <img className='w-[45px] h-[45px] rounded-full overflow-hidden' src={userInfo.image} alt="" />
               }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;