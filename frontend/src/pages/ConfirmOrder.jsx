import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Link } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Assets
import errorImg from '../assets/error.png';
import successImg from '../assets/success.png';

const stripePromise = loadStripe('pk_test_51R7tPePFfbtPCbFPfCAKmyMECVzGeu0qOGTfrm0cdkGvhsDCnVDVDIXtwWKZd2sE0bgPzyLNa8SleSiFPlW7TeWs00Z9Iznl1Y');

const ConfirmOrder = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stripe, setStripe] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const initializeStripe = async () => {
            try {
                const stripeInstance = await stripePromise;
                setStripe(stripeInstance);
            } catch (error) {
                console.error('Error initializing Stripe:', error);
                setErrorMessage('Failed to initialize payment processor');
                setIsLoading(false);
            }
        };

        initializeStripe();
    }, []);

    useEffect(() => {
        if (!stripe) return;

        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
        );

        if (!clientSecret) {
            setErrorMessage('Payment information not found');
            setIsLoading(false);
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            let status;
            switch (paymentIntent.status) {
                case "succeeded":
                    status = 'succeeded';
                    break;
                case "processing":
                    status = 'processing';
                    break;
                case "requires_payment_method":
                    status = 'failed';
                    break;
                default:
                    status = 'failed';
            }
            setPaymentStatus(status);
            
            // Only set loading to false if not succeeded (succeeded will be handled by updatePaymentStatus)
            if (status !== 'succeeded') {
                setIsLoading(false);
            }
        }).catch(error => {
            console.error('Error retrieving payment intent:', error);
            setPaymentStatus('failed');
            setErrorMessage('Failed to verify payment status');
            setIsLoading(false);
        });
    }, [stripe]);

    const updatePaymentStatus = async () => {
        const orderId = localStorage.getItem('orderId');
        if (!orderId) {
            setIsLoading(false);
            return;
        }

        try {
            await axios.get(`http://localhost:5000/api/order/confirm/${orderId}`);
            localStorage.removeItem('orderId');
        } catch (error) {
            console.error('Error confirming order:', error.response?.data || error.message);
            setErrorMessage('Failed to update order status');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (paymentStatus === 'succeeded') {
            updatePaymentStatus();
        }
    }, [paymentStatus]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center gap-4">
                    <FadeLoader color="#0077cc" />
                    <p className="text-[#000033]">Processing your payment...</p>
                </div>
            );
        }

        if (errorMessage) {
            return (
                <div className="flex flex-col items-center justify-center gap-6 text-center">
                    <img src={errorImg} alt="Error" className="w-32 h-32" />
                    <p className="text-red-500 text-lg">{errorMessage}</p>
                    <Link 
                        to="/dashboard/my-orders" 
                        className="px-6 py-2 bg-[#0077cc] text-white rounded-md hover:bg-[#0055aa] transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            );
        }

        switch (paymentStatus) {
            case 'succeeded':
                return (
                    <div className="flex flex-col items-center justify-center gap-6 text-center">
                        <img src={successImg} alt="Success" className="w-32 h-32" />
                        <h2 className="text-2xl font-bold text-[#0077cc]">Payment Successful!</h2>
                        <p className="text-[#000033]">Your order has been confirmed.</p>
                        <Link 
                            to="/dashboard/my-orders" 
                            className="px-6 py-2 bg-[#0077cc] text-white rounded-md hover:bg-[#0055aa] transition-colors"
                        >
                            View Your Orders
                        </Link>
                    </div>
                );
            case 'processing':
                return (
                    <div className="flex flex-col items-center justify-center gap-6 text-center">
                        <img src={successImg} alt="Processing" className="w-32 h-32" />
                        <h2 className="text-2xl font-bold text-[#0077cc]">Payment Processing</h2>
                        <p className="text-[#000033]">Your payment is being processed. Please check back later.</p>
                        <Link 
                            to="/dashboard/my-orders" 
                            className="px-6 py-2 bg-[#0077cc] text-white rounded-md hover:bg-[#0055aa] transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex flex-col items-center justify-center gap-6 text-center">
                        <img src={errorImg} alt="Failed" className="w-32 h-32" />
                        <h2 className="text-2xl font-bold text-red-500">Payment Failed</h2>
                        <p className="text-[#000033]">We couldn't process your payment. Please try again.</p>
                        <div className="flex gap-4">
                            <Link 
                                to="/dashboard/my-orders" 
                                className="px-6 py-2 bg-[#0077cc] text-white rounded-md hover:bg-[#0055aa] transition-colors"
                            >
                                Back to Dashboard
                            </Link>
                            <Link 
                                to="/checkout" 
                                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                                Try Again
                            </Link>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center gap-6 text-center">
                        <img src={errorImg} alt="Error" className="w-32 h-32" />
                        <h2 className="text-2xl font-bold text-red-500">Payment Status Unknown</h2>
                        <p className="text-[#000033]">We couldn't verify your payment status. Please check your orders.</p>
                        <Link 
                            to="/dashboard/my-orders" 
                            className="px-6 py-2 bg-[#0077cc] text-white rounded-md hover:bg-[#0055aa] transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                );
        }
    };

    return (
        <div className="bg-[#f8f9fa] min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center py-12 px-4">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    {renderContent()}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ConfirmOrder;