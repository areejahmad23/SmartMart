const stripeModel = require('../../models/stripeModel')
const sellerModel = require('../../models/sellerModel')
const sellerWallet = require('../../models/sellerWallet')
const withdrowRequest = require('../../models/withdrowRequest') 
const { mongo: {ObjectId}} = require('mongoose')
const {v4: uuidv4} = require('uuid')
const stripe = require('stripe')('sk_test_51R7tPePFfbtPCbFPTjoNJrFC9jt1yTBn2CR3dKaXfO5qQbiGhGelIxY5TQw8G2b4adoqSJ8FhzHmoTfuPnBv0J7g008Hf42med')
const { responseReturn } = require('../../utiles/response')

 

class paymentController{
 
    create_stripe_connect_account = async(req,res) => {
        
        const {id} = req 
        const uid = uuidv4()

try {
    
    const stripeInfo = await stripeModel.findOne({ sellerId: id })

    if (stripeInfo) {
        await stripeModel.deleteOne({ sellerId: id })   
        const account = await stripe.accounts.create({ type: 'express' })

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: 'http://localhost:3001/refresh',
            return_url:  `http://localhost:3001/success?activeCode=${uid}`,
            type: 'account_onboarding'
        })  

        await stripeModel.create({
            sellerId: id,
            stripeId: account.id,
            code: uid
        })
        responseReturn(res,201,{url:accountLink.url })                      

    }
    else{
        const account = await stripe.accounts.create({ type: 'express' }) 
 
             const accountLink = await stripe.accountLinks.create({
                 account: account.id,
                 refresh_url: 'http://localhost:3001/refresh',
                 return_url:  `http://localhost:3001/success?activeCode=${uid}`,
                 type: 'account_onboarding'
             })
             await stripeModel.create({
                 sellerId: id,
                 stripeId: account.id,
                 code: uid
             })
             responseReturn(res,201,{url:accountLink.url })
    }

} catch (error) {
    console.log('stripe connect account errror' + error.message)
}
}

// End Method 

active_stripe_connect_account = async (req, res) => {
        const {activeCode} = req.params 
        const {id} = req
 
        try {
             const userStripeInfo = await stripeModel.findOne({ code: activeCode })
 
             if (userStripeInfo) {
                 await sellerModel.findByIdAndUpdate(id,{  
                   payment: 'active'
                 })
                 responseReturn(res, 200, {message: 'Payment Activated'})
             } else {
                 responseReturn(res, 404, {message: 'Payment Activation Fails'})
             } 
 
        } catch (error) {
         responseReturn(res, 500, {message: 'Internal Server Error'})
        } 
 
     }
       // End Method 

       sumAmount = (data) => {
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum = sum + data[i].amount;            
        }
        return sum
    }  


       get_seller_payment_details = async (req, res) => {
        const {sellerId} = req.params
        
        try {
            const payments = await sellerWallet.find({ sellerId }) 

            const pendingWithdrows = await withdrowRequest.find({
                $and: [
                    {
                        sellerId: {
                            $eq: sellerId
                        }
                    },
                    {
                        status: {
                            $eq: 'pending'
                        }
                    }
                ]
            })
            const successWithdrows = await withdrowRequest.find({
                $and: [
                    {
                        sellerId: {
                            $eq: sellerId
                        }
                    },
                    {
                        status: {
                            $eq: 'success'
                        }
                    }
                ]
            })
    
            const pendingAmount = this.sumAmount(pendingWithdrows)
            const withdrowAmount = this.sumAmount(successWithdrows)
            const totalAmount = this.sumAmount(payments)
    
            let availableAmount = 0;
    
            if (totalAmount > 0) {
                availableAmount = totalAmount - (pendingAmount + withdrowAmount)
            }
    
            responseReturn(res, 200,{
                totalAmount,
                pendingAmount,
                withdrowAmount,
                availableAmount,
                pendingWithdrows,
                successWithdrows 
            })
            
        } catch (error) {   
            console.log(error.message)
        } 

         
        }
        // End Method 

        withdrowal_request = async (req, res) => {
            const {amount,sellerId} = req.body
    
            try {
                const withdrowal = await withdrowRequest.create({
                    sellerId,
                    amount: parseInt(amount)
                })
                responseReturn(res, 200,{ withdrowal, message: 'Withdrowal Request Send'})
            } catch (error) {
                responseReturn(res, 500,{ message: 'Internal Server Error'})
            }
        }
      // End Method 

      get_payment_request = async (req, res) => {
        try {
            const withdrowalRequest = await withdrowRequest.find({ status: 'pending'})
            responseReturn(res, 200, {withdrowalRequest })
        } catch (error) {
            responseReturn(res, 500,{ message: 'Internal Server Error'})
        }
      }
        // End Method 

        // old
        // payment_request_confirm = async (req, res) => {
        //     const { paymentId } = req.body;
        
        //     try {
        //         const payment = await withdrowRequest.findById(paymentId);
        //         if (!payment) {
        //             return responseReturn(res, 404, { message: 'Payment request not found' });
        //         }
        
        //         const sellerStripe = await stripeModel.findOne({ sellerId: new ObjectId(payment.sellerId) });
        //         if (!sellerStripe || !sellerStripe.stripeId) {
        //             return responseReturn(res, 404, { message: 'Seller Stripe account not found' });
        //         }
        
        //         await stripe.transfers.create({
        //             amount: payment.amount * 100,
        //             currency: 'usd',
        //             destination: sellerStripe.stripeId
        //         });
        
        //         await withdrowRequest.findByIdAndUpdate(paymentId, { status: 'success' });
        
        //         responseReturn(res, 200, { payment, message: 'Request Confirm Success' });
        
        //     } catch (error) {
        //         console.error('Stripe Payment Error:', error);
        //         responseReturn(res, 500, { message: 'Internal Server Error' });
        //     }
        // };

        // New
        payment_request_confirm = async (req, res) => {
    const { paymentId } = req.body;
    console.log('Confirming payment for ID:', paymentId);
 
    try {
        const payment = await withdrowRequest.findById(paymentId);
        if (!payment) {
            return responseReturn(res, 404, { message: 'Payment request not found' });
        }
 
        console.log('Found Payment:', payment);
 
        const sellerStripe = await stripeModel.findOne({ sellerId: payment.sellerId });
        console.log('Seller Stripe Account:', sellerStripe);
 
        if (!sellerStripe || !sellerStripe.stripeId) {
            return responseReturn(res, 404, { message: 'Seller Stripe account not found' });
        }
 
        const transfer = await stripe.transfers.create({
            amount: payment.amount * 100,
            currency: 'usd',
            destination: sellerStripe.stripeId
        });
 
        console.log('Stripe Transfer:', transfer);
 
        await withdrowRequest.findByIdAndUpdate(paymentId, { status: 'success' });
 
        responseReturn(res, 200, { payment, message: 'Request Confirm Success' });
 
    } catch (error) {
        console.error('Stripe Payment Error:', error);
        responseReturn(res, 500, { message: 'Internal Server Error' });
    }
};

      // End Method 
    }


module.exports = new paymentController()