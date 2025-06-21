import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineMessage, AiOutlinePlus } from 'react-icons/ai';
import { GrEmoji } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { add_friend, messageClear, send_message, updateMessage } from '../../store/reducers/chatReducer';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { FaList } from 'react-icons/fa';

const socket = io('http://localhost:5000');

const Chat = () => {
    const scrollRef = useRef();
    const dispatch = useDispatch();
    const { sellerId } = useParams();
    const { userInfo } = useSelector(state => state.auth);
    const { fb_messages, currentFd, my_friends, successMessage } = useSelector(state => state.chat);
    
    const [text, setText] = useState('');
    const [receverMessage, setReceverMessage] = useState('');
    const [activeSeller, setActiveSeller] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        socket.emit('add_user', userInfo.id, userInfo);
    }, [userInfo.id]);

    useEffect(() => {
        dispatch(add_friend({
            sellerId: sellerId || "",
            userId: userInfo.id
        }));
    }, [sellerId, dispatch, userInfo.id]);

    const send = () => {
        if (text.trim()) {
            dispatch(send_message({
                userId: userInfo.id,
                text,
                sellerId,
                name: userInfo.name 
            }));
            setText('');
        }
    };

    useEffect(() => {
        socket.on('seller_message', msg => {
            setReceverMessage(msg);
        });
        socket.on('activeSeller', (sellers) => {
            setActiveSeller(sellers);
        });

        return () => {
            socket.off('seller_message');
            socket.off('activeSeller');
        };
    }, []);

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_customer_message', fb_messages[fb_messages.length - 1]);
            dispatch(messageClear());
        }
    }, [successMessage, fb_messages, dispatch]);

    useEffect(() => {
        if (receverMessage) {
            if (sellerId === receverMessage.senderId && userInfo.id === receverMessage.receverId) {
                dispatch(updateMessage(receverMessage));
            } else {
                toast.success(`${receverMessage.senderName} sent a message`);
                dispatch(messageClear());
            }
        }
    }, [receverMessage, sellerId, userInfo.id, dispatch]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [fb_messages]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    return (
        <div className='bg-white p-4 rounded-lg shadow-sm h-[calc(100vh-100px)]'>
            <div className='w-full flex flex-col md:flex-row h-full'>
                {/* Friends/Sellers List */}
                <div className={`w-full md:w-[230px] bg-white rounded-lg shadow-sm md:shadow-none ${show ? 'block' : 'hidden'} md:block`}>
                    <div className='flex items-center gap-3 p-3 border-b border-gray-200'>
                        <AiOutlineMessage className='text-xl text-[#0077cc]' />
                        <h2 className='text-lg font-semibold text-[#000033]'>Messages</h2>
                    </div>
                    <div className='h-[calc(100%-60px)] overflow-y-auto'>
                        <div className='min-h-full'>
                            {my_friends.map((f, i) => (
                                <Link 
                                    to={`/dashboard/chat/${f.fdId}`} 
                                    key={i}  
                                    className={`flex items-center gap-3 p-2 hover:bg-[#f0f5ff] ${currentFd?.fdId === f.fdId ? 'bg-[#f0f5ff]' : ''}`}
                                >
                                    <div className='relative'>
                                        <img 
                                            src={f.image || 'http://localhost:3000/images/user.png'} 
                                            alt={f.name} 
                                            className='w-8 h-8 rounded-full object-cover'
                                        />
                                        {activeSeller.some(c => c.sellerId === f.fdId) && (
                                            <div className='absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-white'></div>
                                        )}
                                    </div>
                                    <span className='text-sm font-medium text-[#000033]'>{f.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className='flex-1 md:ml-4 mt-4 md:mt-0 h-full'>
                    {currentFd ? (
                        <div className='h-full flex flex-col border rounded-lg'>
                            {/* Chat Header */}
                            <div className='flex justify-between items-center p-3 border-b border-gray-200'>
                                <div className='flex items-center gap-3'>
                                    <div className='relative'>
                                        <img 
                                            src={currentFd.image || 'http://localhost:3000/images/user.png'} 
                                            alt={currentFd.name} 
                                            className='w-8 h-8 rounded-full object-cover'
                                        />
                                        {activeSeller.some(c => c.sellerId === currentFd.fdId) && (
                                            <div className='absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-white'></div>
                                        )}
                                    </div>
                                    <span className='font-medium text-[#000033]'>{currentFd.name}</span>
                                </div>
                                <button 
                                    onClick={() => setShow(!show)} 
                                    className='md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-[#0077cc] text-white'
                                >
                                    <FaList />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className='flex-1 overflow-hidden'>
                                <div className='h-full p-3 bg-[#f8f9fa] overflow-y-auto'>
                                    <div className='min-h-full'>
                                        {fb_messages.map((m, i) => (
                                            <div 
                                                key={i} 
                                                ref={i === fb_messages.length - 1 ? scrollRef : null}
                                                className={`flex mb-3 ${currentFd?.fdId !== m.receverId ? 'justify-start' : 'justify-end'}`}
                                            >
                                                <div className={`flex items-start gap-2 max-w-[80%] ${currentFd?.fdId !== m.receverId ? 'flex-row' : 'flex-row-reverse'}`}>
                                                    <img 
                                                        src="http://localhost:3000/images/user.png" 
                                                        alt="User" 
                                                        className='w-6 h-6 rounded-full mt-1'
                                                    />
                                                    <div className={`p-2 rounded-lg ${currentFd?.fdId !== m.receverId ? 'bg-purple-500 text-white' : 'bg-cyan-500 text-white'}`}>
                                                        <span className='text-sm'>{m.message}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Message Input */}
                            <div className='p-3 border-t border-gray-200'>
                                <div className='flex items-center gap-2'>
                                    <button className='w-10 h-10 flex items-center justify-center rounded-full text-[#0077cc] hover:bg-[#f0f5ff]'>
                                        <AiOutlinePlus />
                                    </button>
                                    <div className='flex-1 relative'>
                                        <input
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            type="text"
                                            placeholder='Type your message...'
                                            className='w-full h-10 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0077cc] focus:border-transparent'
                                        />
                                        <button className='absolute right-2 top-2 text-gray-500 hover:text-[#0077cc]'>
                                            <GrEmoji />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={send}
                                        disabled={!text.trim()}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full ${text.trim() ? 'text-[#0077cc] hover:bg-[#f0f5ff]' : 'text-gray-400'}`}
                                    >
                                        <IoSend />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div 
                            onClick={() => setShow(true)}
                            className='h-full flex flex-col items-center justify-center bg-[#f8f9fa] rounded-lg cursor-pointer hover:bg-gray-100'
                        >
                            <AiOutlineMessage className='text-4xl text-gray-400 mb-2' />
                            <span className='text-lg font-medium text-gray-500'>Select a seller to start chatting</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;