const sellerModel = require('../../models/sellerModel');
const customerModel = require('../../models/customerModel');
const sellerCustomerModel = require('../../models/chat/sellerCustomerModel');
const sellerCustomerMessage = require('../../models/chat/sellerCustomerMessage');
const { responseReturn } = require('../../utiles/response');
const adminSellerMessage = require('../../models/chat/adminSellerMessage');

class ChatController {
    add_customer_friend = async (req, res) => {
        const { sellerId, userId } = req.body;

        try {
            if (sellerId !== '') {
                const seller = await sellerModel.findById(sellerId);
                const user = await customerModel.findById(userId);

                if (!seller || !user) {
                    return responseReturn(res, 404, { error: 'Seller or user not found' });
                }

                // Check or create user's friend list
                let userFriends = await sellerCustomerModel.findOne({ myId: userId });
                if (!userFriends) {
                    userFriends = await sellerCustomerModel.create({
                        myId: userId,
                        myFriends: []
                    });
                }

                // Add seller to user's friends if not already present
                if (!userFriends.myFriends.some(f => f.fdId === sellerId)) {
                    await sellerCustomerModel.updateOne(
                        { myId: userId },
                        {
                            $push: {
                                myFriends: {
                                    fdId: sellerId,
                                    name: seller.shopInfo?.shopName || 'Unknown Shop',
                                    image: seller.image || ''
                                }
                            }
                        }
                    );
                }

                // Check or create seller's friend list
                let sellerFriends = await sellerCustomerModel.findOne({ myId: sellerId });
                if (!sellerFriends) {
                    sellerFriends = await sellerCustomerModel.create({
                        myId: sellerId,
                        myFriends: []
                    });
                }

                // Add user to seller's friends if not already present
                if (!sellerFriends.myFriends.some(f => f.fdId === userId)) {
                    await sellerCustomerModel.updateOne(
                        { myId: sellerId },
                        {
                            $push: {
                                myFriends: {
                                    fdId: userId,
                                    name: user.name,
                                    image: ""
                                }
                            }
                        }
                    );
                }

                // Get messages between user and seller
                const messages = await sellerCustomerMessage.find({
                    $or: [
                        {
                            $and: [
                                { receverId: { $eq: sellerId } },
                                { senderId: { $eq: userId } }
                            ]
                        },
                        {
                            $and: [
                                { receverId: { $eq: userId } },
                                { senderId: { $eq: sellerId } }
                            ]
                        }
                    ]
                });

                // Get updated friend list
                const updatedUserFriends = await sellerCustomerModel.findOne({ myId: userId });
                const currentFd = updatedUserFriends.myFriends.find(s => s.fdId === sellerId);

                responseReturn(res, 200, {
                    MyFriends: updatedUserFriends.myFriends,
                    currentFd,
                    messages
                });
            } else {
                const MyFriends = await sellerCustomerModel.findOne({ myId: userId });
                responseReturn(res, 200, {
                    MyFriends: MyFriends ? MyFriends.myFriends : []
                });
            }
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    customer_message_add = async (req, res) => {
        const { userId, text, sellerId, name } = req.body;

        try {
            const message = await sellerCustomerMessage.create({
                senderId: userId,
                senderName: name,
                receverId: sellerId,
                message: text
            });

            // Update user's friend list order
            const userData = await sellerCustomerModel.findOne({ myId: userId });
            if (userData) {
                let myFriends = userData.myFriends;
                const index = myFriends.findIndex(f => f.fdId === sellerId);
                if (index > 0) {
                    [myFriends[0], myFriends[index]] = [myFriends[index], myFriends[0]];
                    await sellerCustomerModel.updateOne(
                        { myId: userId },
                        { myFriends }
                    );
                }
            }

            // Update seller's friend list order
            const sellerData = await sellerCustomerModel.findOne({ myId: sellerId });
            if (sellerData) {
                let myFriends1 = sellerData.myFriends;
                const index1 = myFriends1.findIndex(f => f.fdId === userId);
                if (index1 > 0) {
                    [myFriends1[0], myFriends1[index1]] = [myFriends1[index1], myFriends1[0]];
                    await sellerCustomerModel.updateOne(
                        { myId: sellerId },
                        { myFriends: myFriends1 }
                    );
                }
            }

            responseReturn(res, 201, { message });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    get_customers = async (req, res) => {
        const { sellerId } = req.params;
        try {
            const data = await sellerCustomerModel.findOne({ myId: sellerId });
            responseReturn(res, 200, {
                customers: data ? data.myFriends : []
            });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    get_customers_seller_message = async (req, res) => {
        const { id } = req;
        const { customerId } = req.params;

        try {
            const messages = await sellerCustomerMessage.find({
                $or: [
                    {
                        $and: [
                            { receverId: { $eq: customerId } },
                            { senderId: { $eq: id } }
                        ]
                    },
                    {
                        $and: [
                            { receverId: { $eq: id } },
                            { senderId: { $eq: customerId } }
                        ]
                    }
                ]
            });

            const currentCustomer = await customerModel.findById(customerId);
            responseReturn(res, 200, {
                messages,
                currentCustomer: currentCustomer || null
            });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    seller_message_add = async (req, res) => {
        const { senderId, receverId, text, name } = req.body;
        try {
            const message = await sellerCustomerMessage.create({
                senderId: senderId,
                senderName: name,
                receverId: receverId,
                message: text
            });

            // Update sender's friend list order
            const senderData = await sellerCustomerModel.findOne({ myId: senderId });
            if (senderData) {
                let myFriends = senderData.myFriends;
                const index = myFriends.findIndex(f => f.fdId === receverId);
                if (index > 0) {
                    [myFriends[0], myFriends[index]] = [myFriends[index], myFriends[0]];
                    await sellerCustomerModel.updateOne(
                        { myId: senderId },
                        { myFriends }
                    );
                }
            }

            // Update receiver's friend list order
            const receiverData = await sellerCustomerModel.findOne({ myId: receverId });
            if (receiverData) {
                let myFriends1 = receiverData.myFriends;
                const index1 = myFriends1.findIndex(f => f.fdId === senderId);
                if (index1 > 0) {
                    [myFriends1[0], myFriends1[index1]] = [myFriends1[index1], myFriends1[0]];
                    await sellerCustomerModel.updateOne(
                        { myId: receverId },
                        { myFriends: myFriends1 }
                    );
                }
            }

            responseReturn(res, 201, { message });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    get_sellers = async (req, res) => {
        try {
            const sellers = await sellerModel.find({});
            responseReturn(res, 200, {
                sellers: sellers || []
            });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    seller_admin_message_insert = async (req, res) => {
        const { senderId, receverId, message, senderName } = req.body;

        try {
            const messageData = await adminSellerMessage.create({
                senderId,
                receverId,
                message,
                senderName
            });

            responseReturn(res, 200, { message: messageData });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    get_admin_messages = async (req, res) => {
        const { receverId } = req.params;
        const id = "";

        try {
            const messages = await adminSellerMessage.find({
                $or: [
                    {
                        $and: [
                            { receverId: { $eq: receverId } },
                            { senderId: { $eq: id } }
                        ]
                    },
                    {
                        $and: [
                            { receverId: { $eq: id } },
                            { senderId: { $eq: receverId } }
                        ]
                    }
                ]
            });

            let currentSeller = {};
            if (receverId) {
                currentSeller = await sellerModel.findById(receverId);
            }
            responseReturn(res, 200, {
                messages,
                currentSeller: currentSeller || null
            });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    get_seller_messages = async (req, res) => {
        const receverId = "";
        const { id } = req;

        try {
            const messages = await adminSellerMessage.find({
                $or: [
                    {
                        $and: [
                            { receverId: { $eq: receverId } },
                            { senderId: { $eq: id } }
                        ]
                    },
                    {
                        $and: [
                            { receverId: { $eq: id } },
                            { senderId: { $eq: receverId } }
                        ]
                    }
                ]
            });

            responseReturn(res, 200, {
                messages: messages || []
            });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }
}

module.exports = new ChatController();