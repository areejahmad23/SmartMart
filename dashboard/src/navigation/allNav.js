// import { AiOutlineDashboard, AiOutlineShoppingCart } from "react-icons/ai";
import { AiFillDashboard } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FaUserTimes } from "react-icons/fa";
import { FaCodePullRequest } from "react-icons/fa6";
import { IoChatbubblesSharp } from "react-icons/io5";
import { ImList2 } from "react-icons/im";
import { MdAdd } from "react-icons/md";
import { MdDiscount } from "react-icons/md";
import { BsCartCheckFill } from "react-icons/bs";
import { BsChatDotsFill } from "react-icons/bs";
import { FaCircleUser } from "react-icons/fa6";


export const allNav = [
    {
        id : 1, 
        title : 'Dashboard',
        icon : <AiFillDashboard />,
        role : 'admin',
        path : '/admin/dashboard'

    },
    {
        id : 2,
        title : 'Orders',
        icon : <FaShoppingCart />,
        role : 'admin',
        path: '/admin/dashboard/orders'
    },
    {
        id : 3,
        title : 'Category',
        icon : <BiSolidCategory />,
        role : 'admin',
        path: '/admin/dashboard/category'
    },
    {
        id : 4,
        title : 'Sellers',
        icon : <FaUsers />,
        role : 'admin',
        path: '/admin/dashboard/sellers'
    },
    {
        id : 5,
        title : 'Payment Request',
        icon : <MdPayment />,
        role : 'admin',
        path: '/admin/dashboard/payment-request'
    },
    {
        id : 6,
        title : 'Deactive Sellers',
        icon : <FaUserTimes />,
        role : 'admin',
        path: '/admin/dashboard/deactive-sellers'
    },
    {
        id : 7,
        title : 'Seller Request',
        icon : <FaCodePullRequest />,
        role : 'admin',
        path: '/admin/dashboard/seller-request'
    },
    {
        id : 8,
        title : 'Live Chat',
        icon : <IoChatbubblesSharp />,
        role : 'admin',
        path: '/admin/dashboard/chat-seller'
    },
    {
        id : 9, 
        title : 'Dashboard',
        icon : <AiFillDashboard />,
        role : 'seller',
        path : '/seller/dashboard'
    },
    {
        id : 10, 
        title : 'Add Products',
        icon : <MdAdd />,
        role : 'seller',
        path : '/seller/dashboard/add-products'
    },
    {
        id : 11, 
        title : 'All Products',
        icon : <ImList2 />,
        role : 'seller',
        path : '/seller/dashboard/products'
    },
    {
        id : 12, 
        title : 'Discount Products',
        icon : <MdDiscount />,
        role : 'seller',
        path : '/seller/dashboard/discount-products'
    },
    {
        id : 13, 
        title : 'Orders',
        icon : <BsCartCheckFill />,
        role : 'seller',
        path : '/seller/dashboard/orders'
    },
    {
        id : 14, 
        title : 'Payments',
        icon : <MdPayment />,
        role : 'seller',
        path : '/seller/dashboard/payments'
    },
    {
        id : 15, 
        title : 'Chat Customer',
        icon : <IoChatbubblesSharp />,
        role : 'seller',
        path : '/seller/dashboard/chat-customer'
    },
    {
        id : 16, 
        title : 'Chat Support',
        icon : <BsChatDotsFill />,
        role : 'seller',
        path : '/seller/dashboard/chat-support'
    },
    {
        id : 17, 
        title : 'Profile',
        icon : <FaCircleUser />,
        role : 'seller',
        path : '/seller/dashboard/profile'
    }
]