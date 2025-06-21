import React from 'react';
import { FaLock } from "react-icons/fa";

const ChangePassword = () => {
    return (
        <div className='p-6 bg-white rounded-md shadow-sm'>
            <h2 className='text-2xl font-bold text-[#000033] pb-5'>Change Password</h2>
            
            <form className='max-w-md'>
                <div className='flex flex-col gap-2 mb-4'>
                    <label htmlFor="old_password" className='text-sm font-medium text-[#000033]'>Old Password</label>
                    <div className='relative'>
                        <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0077cc]'>
                            <FaLock />
                        </span>
                        <input 
                            className='w-full px-10 py-2 border border-[#0077cc] rounded-md text-[#000033] focus:outline-none focus:ring-2 focus:ring-[#0077cc]/50' 
                            type="password" 
                            name="old_password" 
                            id="old_password"  
                            placeholder='Old Password'
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-2 mb-4'>
                    <label htmlFor="new_password" className='text-sm font-medium text-[#000033]'>New Password</label>
                    <div className='relative'>
                        <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0077cc]'>
                            <FaLock />
                        </span>
                        <input 
                            className='w-full px-10 py-2 border border-[#0077cc] rounded-md text-[#000033] focus:outline-none focus:ring-2 focus:ring-[#0077cc]/50' 
                            type="password" 
                            name="new_password" 
                            id="new_password"  
                            placeholder='New Password'
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-2 mb-6'>
                    <label htmlFor="confirm_password" className='text-sm font-medium text-[#000033]'>Confirm Password</label>
                    <div className='relative'>
                        <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0077cc]'>
                            <FaLock />
                        </span>
                        <input 
                            className='w-full px-10 py-2 border border-[#0077cc] rounded-md text-[#000033] focus:outline-none focus:ring-2 focus:ring-[#0077cc]/50' 
                            type="password" 
                            name="confirm_password" 
                            id="confirm_password"  
                            placeholder='Confirm Password'
                        />
                    </div>
                </div>
                
                <div>
                    <button 
                        className='px-8 py-2 bg-gradient-to-r from-[#000022] to-[#0055aa] text-white rounded-md font-medium hover:from-[#001144] hover:to-[#0066cc] transition-colors shadow-md hover:shadow-[#0077cc]/30'
                    >
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;