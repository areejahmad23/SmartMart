import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  FaList, 
  FaHeart, 
  FaBorderAll 
} from 'react-icons/fa';
import { 
  IoIosHome,
  IoMdLogOut,
  IoMdChatboxes 
} from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import api from '../api/api';
import { useDispatch } from 'react-redux';
import { user_reset } from '../store/reducers/authReducer';
import { reset_count } from '../store/reducers/cartReducer';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logout = async () => {
        try {
            await api.get('/customer/logout');
            localStorage.removeItem('customerToken');
            dispatch(user_reset());
            dispatch(reset_count());
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            if (error.response) {
                console.error("Server response:", error.response.data);
            }
        }
    };

    const menuItems = [
        { icon: <IoIosHome />, label: 'Dashboard', path: '/dashboard' },
        { icon: <FaBorderAll />, label: 'My Orders', path: '/dashboard/my-orders' },
        { icon: <FaHeart />, label: 'Wishlist', path: '/dashboard/my-wishlist' },
        { icon: <IoMdChatboxes />, label: 'Chat', path: '/dashboard/chat' }, // Updated icon here
        { icon: <RiLockPasswordLine />, label: 'Change Password', path: '/dashboard/change-password' },
    ];

    return (
        <div className="bg-[#f8f9fa] min-h-screen flex flex-col">
            <Header />
            
            <div className="flex-grow mt-5">
                <div className="w-[90%] mx-auto">
                    {/* Mobile Toggle Button */}
                    <div className="md:hidden mb-4">
                        <button 
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="px-4 py-2 bg-[#0077cc] text-white rounded-md flex items-center gap-2"
                        >
                            <FaList />
                            <span>Menu</span>
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sidebar */}
                        <div className={`md:w-[270px] bg-white rounded-md shadow-sm transition-all duration-300
                            ${sidebarOpen ? 'block' : 'hidden'} md:block`}
                        >
                            <ul className="py-4">
                                {menuItems.map((item, index) => (
                                    <li key={index} className="border-b border-[#e2e2e2] last:border-0">
                                        <Link 
                                            to={item.path}
                                            className="flex items-center gap-3 px-4 py-3 text-[#000033] hover:bg-[#f0f5ff] transition-colors"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span className="text-xl text-[#0077cc]">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                                <li className="border-b border-[#e2e2e2] last:border-0">
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-[#000033] hover:bg-[#f0f5ff] transition-colors text-left"
                                    >
                                        <span className="text-xl text-[#0077cc]"><IoMdLogOut /></span>
                                        <span>Logout</span>
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 bg-white rounded-md shadow-sm p-6">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;