const { responseReturn } = require("../../utiles/response");
const myShopWallet = require('../../models/myShopWallet');
const productModel = require('../../models/productModel');
const customerOrder = require('../../models/customerOrder');
const sellerModel = require('../../models/sellerModel');
const adminSellerMessage = require('../../models/chat/adminSellerMessage');
const sellerWallet = require('../../models/sellerWallet');
const authOrder = require('../../models/authOrder');
const bannerModel = require('../../models/bannerModel');
const sellerCustomerMessage = require('../../models/chat/sellerCustomerMessage');
const { mongo: { ObjectId } } = require('mongoose');
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');

class dashboardController {
    // Admin Dashboard Data
    get_admin_dashboard_data = async (req, res) => {
        const { id } = req;
        try {
            // Get total from customerOrders (what customers paid)
            const totalSale = await customerOrder.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$price' }
                    }
                }
            ]);

            const totalProduct = await productModel.find({}).countDocuments();
            const totalOrder = await customerOrder.find({}).countDocuments();
            const totalSeller = await sellerModel.find({}).countDocuments();
            const messages = await adminSellerMessage.find({}).limit(3);
            const recentOrders = await customerOrder.find({}).limit(5);

            responseReturn(res, 200, {
                totalProduct,
                totalOrder,
                totalSeller,
                messages,
                recentOrders,
                totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
            });
        } catch (error) {
            console.log(error.message);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    // Seller Dashboard Data
    get_seller_dashboard_data = async (req, res) => {
        const { id } = req;
        try {
            // Get total from sellerWallet (seller's earnings after commission)
            const totalSale = await sellerWallet.aggregate([
                {
                    $match: {
                        sellerId: {
                            $eq: id
                        }
                    }
                }, {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' }
                    }
                }
            ]);

            const totalProduct = await productModel.find({
                sellerId: new ObjectId(id)
            }).countDocuments();

            const totalOrder = await authOrder.find({
                sellerId: new ObjectId(id)
            }).countDocuments();

            const totalPendingOrder = await authOrder.find({
                $and: [
                    {
                        sellerId: {
                            $eq: new ObjectId(id)
                        }
                    },
                    {
                        delivery_status: {
                            $eq: 'pending'
                        }
                    }
                ]
            }).countDocuments();

            const messages = await sellerCustomerMessage.find({
                $or: [
                    {
                        senderId: {
                            $eq: id
                        }
                    }, {
                        receverId: {
                            $eq: id
                        }
                    }
                ]
            }).limit(3);

            const recentOrders = await authOrder.find({
                sellerId: new ObjectId(id)
            }).limit(5);

            responseReturn(res, 200, {
                totalProduct,
                totalOrder,
                totalPendingOrder,
                messages,
                recentOrders,
                totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
            });

        } catch (error) {
            console.log(error.message);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    // Admin Daily Stats
    get_daily_stats = async (req, res) => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            // Admin sees full order amount from customerOrders
            const ordersStats = await customerOrder.aggregate([
                {
                    $match: {
                        createdAt: { $gte: today, $lt: tomorrow }
                    }
                },
                {
                    $group: {
                        _id: null,
                        orders: { $sum: 1 },
                        revenue: { $sum: "$price" }
                    }
                }
            ]);

            const result = {
                date: today.toISOString().slice(0, 10),
                orders: ordersStats.length > 0 ? ordersStats[0].orders : 0,
                revenue: ordersStats.length > 0 ? ordersStats[0].revenue : 0
            };

            responseReturn(res, 200, result);
        } catch (error) {
            console.error(error);
            responseReturn(res, 500, { error: error.message });
        }
    }

    // Admin Weekly Stats
    get_weekly_stats = async (req, res) => {
        try {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - dayOfWeek);
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            // Admin sees full order amount from customerOrders
            const ordersStats = await customerOrder.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startOfWeek, $lte: endOfWeek }
                    }
                },
                {
                    $group: {
                        _id: { $dayOfWeek: "$createdAt" },
                        orders: { $sum: 1 },
                        revenue: { $sum: "$price" }
                    }
                }
            ]);

            const daysMap = {
                1: 'Sun', 2: 'Mon', 3: 'Tue', 4: 'Wed', 5: 'Thu', 6: 'Fri', 7: 'Sat'
            };

            const result = [1, 2, 3, 4, 5, 6, 7].map(dayNum => {
                const orderDay = ordersStats.find(o => o._id === dayNum);
                return {
                    day: daysMap[dayNum],
                    orders: orderDay ? orderDay.orders : 0,
                    revenue: orderDay ? orderDay.revenue : 0
                };
            });

            responseReturn(res, 200, result);
        } catch (error) {
            console.error(error);
            responseReturn(res, 500, { error: error.message });
        }
    }

    // Admin Monthly Stats
    get_monthly_stats = async (req, res) => {
        try {
            const currentYear = new Date().getFullYear();

            // Admin sees full order amount from customerOrders
            const ordersStats = await customerOrder.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(`${currentYear}-01-01`),
                            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        orders: { $sum: 1 },
                        revenue: { $sum: "$price" }
                    }
                },
                { $sort: { "_id": 1 } }
            ]);

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            const result = months.map((monthName, idx) => {
                const monthNumber = idx + 1;
                const monthData = ordersStats.find(o => o._id === monthNumber);
                return {
                    month: monthName,
                    orders: monthData ? monthData.orders : 0,
                    revenue: monthData ? monthData.revenue : 0
                };
            });

            responseReturn(res, 200, result);
        } catch (error) {
            console.error(error);
            responseReturn(res, 500, { error: error.message });
        }
    }

    // Seller Daily Stats
    get_seller_daily_stats = async (req, res) => {
        try {
            const { id } = req;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            // Seller sees their earnings from sellerWallet
            const walletStats = await sellerWallet.aggregate([
                {
                    $match: {
                        sellerId: id,
                        createdAt: { $gte: today, $lt: tomorrow }
                    }
                },
                {
                    $group: {
                        _id: null,
                        revenue: { $sum: "$amount" }
                    }
                }
            ]);

            // Count orders from authOrder
            const orderStats = await authOrder.aggregate([
                {
                    $match: {
                        sellerId: new ObjectId(id),
                        createdAt: { $gte: today, $lt: tomorrow }
                    }
                },
                {
                    $group: {
                        _id: null,
                        orders: { $sum: 1 }
                    }
                }
            ]);

            const result = {
                date: today.toISOString().slice(0, 10),
                orders: orderStats.length > 0 ? orderStats[0].orders : 0,
                revenue: walletStats.length > 0 ? walletStats[0].revenue : 0
            };

            responseReturn(res, 200, result);
        } catch (error) {
            console.error('Seller daily stats error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }

    // Seller Weekly Stats
    get_seller_weekly_stats = async (req, res) => {
        try {
            const { id } = req;
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            // Seller earnings grouped by day
            const walletStats = await sellerWallet.aggregate([
                {
                    $match: {
                        sellerId: id,
                        createdAt: { $gte: startOfWeek, $lte: endOfWeek }
                    }
                },
                {
                    $group: {
                        _id: { $dayOfWeek: "$createdAt" },
                        revenue: { $sum: "$amount" }
                    }
                }
            ]);

            // Order counts grouped by day
            const orderStats = await authOrder.aggregate([
                {
                    $match: {
                        sellerId: new ObjectId(id),
                        createdAt: { $gte: startOfWeek, $lte: endOfWeek }
                    }
                },
                {
                    $group: {
                        _id: { $dayOfWeek: "$createdAt" },
                        orders: { $sum: 1 }
                    }
                }
            ]);

            const daysMap = {
                1: 'Sun', 2: 'Mon', 3: 'Tue', 4: 'Wed', 5: 'Thu', 6: 'Fri', 7: 'Sat'
            };

            const result = [1, 2, 3, 4, 5, 6, 7].map(dayNum => {
                const orderDay = orderStats.find(o => o._id === dayNum);
                const walletDay = walletStats.find(w => w._id === dayNum);
                return {
                    day: daysMap[dayNum],
                    orders: orderDay ? orderDay.orders : 0,
                    revenue: walletDay ? walletDay.revenue : 0
                };
            });

            responseReturn(res, 200, result);
        } catch (error) {
            console.error('Seller weekly stats error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }

    // Seller Monthly Stats
    get_seller_monthly_stats = async (req, res) => {
        try {
            const { id } = req;
            const currentYear = new Date().getFullYear();

            // Seller earnings grouped by month
            const walletStats = await sellerWallet.aggregate([
                {
                    $match: {
                        sellerId: id,
                        createdAt: {
                            $gte: new Date(`${currentYear}-01-01`),
                            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        revenue: { $sum: "$amount" }
                    }
                },
                { $sort: { "_id": 1 } }
            ]);

            // Order counts grouped by month
            const orderStats = await authOrder.aggregate([
                {
                    $match: {
                        sellerId: new ObjectId(id),
                        createdAt: {
                            $gte: new Date(`${currentYear}-01-01`),
                            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        orders: { $sum: 1 }
                    }
                },
                { $sort: { "_id": 1 } }
            ]);

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            const result = months.map((monthName, idx) => {
                const monthNumber = idx + 1;
                const orderMonth = orderStats.find(o => o._id === monthNumber);
                const walletMonth = walletStats.find(w => w._id === monthNumber);
                return {
                    month: monthName,
                    orders: orderMonth ? orderMonth.orders : 0,
                    revenue: walletMonth ? walletMonth.revenue : 0
                };
            });

            responseReturn(res, 200, result);
        } catch (error) {
            console.error('Seller monthly stats error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }

    // Banner Management
    add_banner = async (req, res) => {
        const form = formidable({
            multiples: true
        })
        form.parse(req, async (err, field, files) => {
            const { productId } = field
            const { mainban } = files
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            })
            try {
                const product = await productModel.findById(productId)
                const slug = product.slug
                const result = await cloudinary.uploader.upload(mainban.filepath, { folder: 'banners' })
                const banner = await bannerModel.create({
                    productId,
                    banner: result.url,
                    link: slug
                })
                responseReturn(res, 200, { banner, message: "Banner add success" })
            }
            catch (error) {
                responseReturn(res, 500, { error: error.message })
            }
        })
    }

    get_banner = async (req, res) => {
        const { productId } = req.params
        try {
            const banner = await bannerModel.findOne({ productId: new ObjectId(productId) })
            responseReturn(res, 200, { banner })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    update_banner = async (req, res) => {
        const { bannerId } = req.params
        const form = formidable({})

        form.parse(req, async (err, _, files) => {
            const { mainban } = files

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            })

            try {
                let banner = await bannerModel.findById(bannerId)
                let temp = banner.banner.split('/')
                temp = temp[temp.length - 1]
                const imageName = temp.split('.')[0]
                await cloudinary.uploader.destroy(imageName)

                const { url } = await cloudinary.uploader.upload(mainban.filepath, { folder: 'banners' })

                await bannerModel.findByIdAndUpdate(bannerId, {
                    banner: url
                })

                banner = await bannerModel.findById(bannerId)
                responseReturn(res, 200, { banner, message: "Banner Updated Success" })

            } catch (error) {
                responseReturn(res, 500, { error: error.message })
            }
        })
    }

    get_banners = async (req, res) => {
        try {
            const banners = await bannerModel.aggregate([
                {
                    $sample: {
                        size: 5
                    }
                }
            ])
            responseReturn(res, 200, { banners })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Sales Report
getSalesReport = async (req, res) => {
    try {
        const { startDate = new Date(0), endDate = new Date() } = req.query;
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        // Get paid orders with complete product details
        const reportData = await customerOrder.aggregate([
            {
                $match: {
                    payment_status: 'paid',
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: adjustedEndDate
                    }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $project: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    orderId: "$_id",
                    customerName: 1,
                    products: {
                        $map: {
                            input: "$products",
                            as: "orderProduct",
                            in: {
                                $mergeObjects: [
                                    "$$orderProduct",
                                    {
                                        $arrayElemAt: [
                                            "$productDetails",
                                            {
                                                $indexOfArray: [
                                                    "$productDetails._id",
                                                    "$$orderProduct.productId"
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    orderTotal: { $sum: "$products.price" },
                    delivery_status: 1
                }
            },
            { $sort: { date: 1 } }
        ]);

        // Calculate accurate totals
        const totalRevenue = reportData.reduce((sum, order) => sum + order.orderTotal, 0);
        const totalOrders = reportData.length;

        responseReturn(res, 200, {
            success: true,
            data: reportData,
            summary: {
                totalOrders,
                totalRevenue,
                averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders) : 0,
                dateRange: {
                    start: startDate,
                    end: endDate,
                    adjustedEnd: adjustedEndDate
                }
            }
        });

    } catch (error) {
        console.error('Admin sales report error:', error);
        responseReturn(res, 500, {
            success: false,
            error: error.message
        });
    }
}

// Add to your existing dashboardController class
get_seller_sales_report = async (req, res) => {
    const { id } = req;
    try {
        const { startDate = new Date(0), endDate = new Date() } = req.query;
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        // Get seller's orders with calculated earnings
        const orders = await authOrder.aggregate([
            {
                $match: {
                    sellerId: new ObjectId(id),
                    createdAt: { $gte: new Date(startDate), $lte: adjustedEndDate },
                    payment_status: 'paid'
                }
            },
            {
                $project: {
                    createdAt: 1,
                    products: 1,
                    delivery_status: 1,
                    sellerEarnings: {
                        $sum: {
                            $map: {
                                input: "$products",
                                as: "product",
                                in: { $multiply: ["$$product.price", "$$product.quantity", 0.8] }
                            }
                        }
                    }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        // Calculate totals
        const totalEarnings = orders.reduce((sum, order) => sum + order.sellerEarnings, 0);

        responseReturn(res, 200, {
            success: true,
            data: orders,
            summary: {
                totalOrders: orders.length,
                totalRevenue: totalEarnings,
                averageOrderValue: orders.length > 0 ? (totalEarnings / orders.length) : 0,
                startDate: startDate,
                endDate: endDate
            }
        });

    } catch (error) {
        console.error('Seller sales report error:', error);
        responseReturn(res, 500, {
            success: false,
            error: error.message
        });
    }
}

}

module.exports = new dashboardController();