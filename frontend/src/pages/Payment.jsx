import React, { useState } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import { useLocation } from 'react-router-dom';
import Stripe from '../components/Stripe';

const Payment = () => {
    const { state: { price, items, orderId } } = useLocation();
    const [paymentMethod, setPaymentMethod] = useState('stripe');

    const paymentMethods = [
        {
            id: 'stripe',
            name: 'Stripe',
            logo: 'http://localhost:3000/images/payment/stripe.png',
            alt: 'Stripe Payment'
        },
        {
            id: 'cod',
            name: 'Cash on Delivery',
            logo: 'http://localhost:3000/images/payment/cod.jpg',
            alt: 'Cash on Delivery'
        }
    ];

    return (
        <div className="bg-[#f8f9fa] min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow py-8">
                <div className="w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[85%] 2xl:w-[85%] mx-auto">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Order Summary */}
                        <div className="w-full lg:w-2/5">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold text-[#000033] mb-4">Order Summary</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-[#666]">{items} Items</span>
                                        <span className="font-medium">${price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#666]">Shipping Fee</span>
                                        <span className="font-medium">$0.00</span>
                                    </div>
                                    <div className="border-t border-[#e2e2e2] pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">Total Amount</span>
                                            <span className="text-xl font-bold text-[#0077cc]">${price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="w-full lg:w-3/5">
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <h2 className="text-xl font-bold text-[#000033] p-6 border-b border-[#e2e2e2]">
                                    Payment Method
                                </h2>
                                
                                {/* Payment Options */}
                                <div className="flex border-b border-[#e2e2e2]">
                                    {paymentMethods.map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={`flex-1 py-4 flex flex-col items-center justify-center transition-colors ${paymentMethod === method.id ? 'bg-[#f0f5ff]' : 'bg-white hover:bg-gray-50'}`}
                                        >
                                            <img 
                                                src={method.logo} 
                                                alt={method.alt} 
                                                className="h-8 mb-2 object-contain"
                                            />
                                            <span className="text-[#000033]">{method.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Payment Form */}
                                <div className="p-6">
                                    {paymentMethod === 'stripe' && (
                                        <Stripe orderId={orderId} price={price} />
                                    )}

                                    {paymentMethod === 'cod' && (
                                        <div className="text-center">
                                            <p className="text-[#666] mb-6">You'll pay when you receive the order</p>
                                            <button 
                                                className="px-8 py-3 bg-[#0077cc] text-white rounded-md
                                                 hover:bg-[#0055aa] transition-colors"
                                            >
                                                Confirm Order
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Payment;