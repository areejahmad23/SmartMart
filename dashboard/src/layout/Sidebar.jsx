import React, { useEffect, useState } from 'react';
import { getNav } from '../navigation/index';
import { RiLogoutBoxLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../store/Reducers/authReducer';
import logo from '../assets/logo.png'


const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();
  const { role } = useSelector(state => state.auth);
  const { pathname } = useLocation();
  const [allNav, setAllNav] = useState([]);
  const navigate = useNavigate()
  
  useEffect(() => {
    const navs = getNav(role);
    setAllNav(navs);
  }, [role]);

  return (
    <div>
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed duration-200 ${!showSidebar ? 'invisible' : 'visible'} w-screen h-screen bg-[#8cbce780] top-0 left-0 z-10`}
      ></div>
      <div
        className={`w-[260px] fixed bg-[#ffffff] z-50 top-0 h-screen shadow-[0_0_15px_0_rgb(34_41_47_/_5%)] transition-all ${showSidebar ? 'left-0' : '-left-[260px] lg:left-0'}`}
      >
        <div className='h-[70px] flex justify-center items-center'>
          <Link to='/' className='w-[180px] h-[50px]'>
            <img className='w-full h-full' src={logo} alt="SmartMart Logo" />
          </Link>
        </div>
        <div className='px-[16px]'>
          <ul>
            {allNav.map((n, i) => (
              <li key={i}>
                <Link
                  to={n.path}
                  className={`${pathname === n.path ? 'bg-[#0077cc] shadow-[#0077cc]/50 text-white duration-500' : 'text-[#000000] font-bold duration-200'} px-[12px] py-[9px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1 hover:bg-[#0077cc] hover:text-white`}
                >
                  <span>{n.icon}</span>
                  <span>{n.title}</span>
                </Link>
              </li>
            ))}
            <li>
              <button onClick={() => dispatch(logout({navigate,role }))} className='text-[#000000] font-bold duration-200 px-[12px] py-[9px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1 hover:bg-[#0077cc] hover:text-white'>
                <span><RiLogoutBoxLine /></span>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;