const { responseReturn } = require("../../utiles/response") 
const myShopWallet = require('../../models/myShopWallet')
const productModel = require('../../models/productModel')
const customerOrder = require('../../models/customerOrder')
const sellerModel = require('../../models/sellerModel') 
const adminSellerMessage = require('../../models/chat/adminSellerMessage') 
const sellerWallet = require('../../models/sellerWallet') 
const authOrder = require('../../models/authOrder')
const bannerModel = require('../../models/bannerModel') 
const sellerCustomerMessage = require('../../models/chat/sellerCustomerMessage') 
const { mongo: {ObjectId}} = require('mongoose')
const cloudinary = require('cloudinary').v2
const formidable = require('formidable')

class dashboardController {
    get_admin_dashboard_data = async(req, res) => {
        const {id} = req 
        try {
            const totalSale = await myShopWallet.aggregate([
                {
                    $group :{
                        _id:null,
                        totalAmount: {$sum: '$amount'}
                    }
                }
            ])
            const totalProduct = await productModel.find({}).countDocuments()
            const totalOrder = await customerOrder.find({}).countDocuments()
            const totalSeller = await sellerModel.find({}).countDocuments()
            const messages = await adminSellerMessage.find({}).limit(3)
            const recentOrders = await customerOrder.find({}).limit(5)
            responseReturn(res, 200, {
                totalProduct,
                totalOrder,
                totalSeller,
                messages,
                recentOrders,
                totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
            })
        } catch (error) {
            console.log(error.message)
        }
    }
    //end Method 

    get_seller_dashboard_data = async (req, res) => {
        const {id} = req 
        try {
            const totalSale = await sellerWallet.aggregate([
                {
                    $match: { 
                        sellerId: {
                            $eq: id
                        } 
                    }
                },{
                    $group: {
                        _id:null,
                        totalAmount: {$sum: '$amount'}
                    }
                }
            ])

            const totalProduct = await productModel.find({ 
                sellerId: new ObjectId(id) }).countDocuments()

            const totalOrder = await authOrder.find({
                sellerId: new ObjectId(id) }).countDocuments()

            const totalPendingOrder = await authOrder.find({
                $and:[
                    {
                        sellerId: {
                            $eq: new ObjectId(id)
                        }
                    },
                    {
                        delivery_status :{
                            $eq: 'pending'
                        }
                    }
                ]
            }).countDocuments()

            const messages = await sellerCustomerMessage.find({
                $or: [
                    {
                        senderId: {
                            $eq: id
                        } 
                    },{
                        receverId: {
                            $eq: id
                        }
                    }
                ]
            }).limit(3)   

            const recentOrders = await authOrder.find({
                sellerId: new ObjectId(id)
            }).limit(5)

            responseReturn(res, 200, {
                totalProduct,
                totalOrder,
                totalPendingOrder,
                messages,
                recentOrders,
                totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
            })

        } catch (error) {
            console.log(error.message)
        }
    }
    //end Method 


    // daily
    get_daily_stats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow
    tomorrow.setHours(0, 0, 0, 0);

    // Aggregate orders created today
    const ordersStats = await authOrder.aggregate([
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

    // Aggregate new sellers registered today
    const sellersStats = await sellerModel.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          sellers: { $sum: 1 }
        }
      }
    ]);

    const result = {
      date: today.toISOString().slice(0, 10), // e.g. "2025-05-28"
      orders: ordersStats.length > 0 ? ordersStats[0].orders : 0,
      revenue: ordersStats.length > 0 ? ordersStats[0].revenue : 0,
      sellers: sellersStats.length > 0 ? sellersStats[0].sellers : 0
    };

    responseReturn(res, 200, result);
  } catch (error) {
    console.error(error);
    responseReturn(res, 500, { error: error.message });
  }
};


    // NEW: Add weekly stats method

// get_weekly_stats = async (req, res) => {
//   try {
//     const today = new Date();
//     const lastWeek = new Date(today);
//     lastWeek.setDate(lastWeek.getDate() - 6); // last 7 days including today

//     // Aggregate orders by day of week
//     const ordersStats = await authOrder.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: lastWeek, $lte: today }
//         }
//       },
//       {
//         $group: {
//           _id: { $dayOfWeek: "$createdAt" }, // 1=Sunday ... 7=Saturday
//           orders: { $sum: 1 },
//           revenue: { $sum: "$price" }
//         }
//       }
//     ]);

//     // Aggregate new sellers by day of week (registered in last 7 days)
//     const sellersStats = await sellerModel.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: lastWeek, $lte: today }
//         }
//       },
//       {
//         $group: {
//           _id: { $dayOfWeek: "$createdAt" },
//           sellers: { $sum: 1 }
//         }
//       }
//     ]);

//     const daysMap = {
//       1: 'Sun',
//       2: 'Mon',
//       3: 'Tue',
//       4: 'Wed',
//       5: 'Thu',
//       6: 'Fri',
//       7: 'Sat'
//     };

//     // Combine data for each day of week (Sun to Sat)
//     const result = [1, 2, 3, 4, 5, 6, 7].map(dayNum => {
//       const orderDay = ordersStats.find(o => o._id === dayNum);
//       const sellerDay = sellersStats.find(s => s._id === dayNum);

//       return {
//         day: daysMap[dayNum],
//         orders: orderDay ? orderDay.orders : 0,
//         revenue: orderDay ? orderDay.revenue : 0,
//         sellers: sellerDay ? sellerDay.sellers : 0
//       };
//     });

//     responseReturn(res, 200, result);
//   } catch (error) {
//     console.error(error);
//     responseReturn(res, 500, { error: error.message });
//   }
// };
get_weekly_stats = async (req, res) => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek); // Go to previous Sunday
    startOfWeek.setHours(0, 0, 0, 0); // Beginning of day

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999); // End of day

    // Aggregate orders
    const ordersStats = await authOrder.aggregate([
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

    // Aggregate new sellers
    const sellersStats = await sellerModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lte: endOfWeek }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          sellers: { $sum: 1 }
        }
      }
    ]);

    const daysMap = {
      1: 'Sun',
      2: 'Mon',
      3: 'Tue',
      4: 'Wed',
      5: 'Thu',
      6: 'Fri',
      7: 'Sat'
    };

    const result = [1, 2, 3, 4, 5, 6, 7].map(dayNum => {
      const orderDay = ordersStats.find(o => o._id === dayNum);
      const sellerDay = sellersStats.find(s => s._id === dayNum);
      return {
        day: daysMap[dayNum],
        orders: orderDay ? orderDay.orders : 0,
        revenue: orderDay ? orderDay.revenue : 0,
        sellers: sellerDay ? sellerDay.sellers : 0
      };
    });

    responseReturn(res, 200, result);
  } catch (error) {
    console.error(error);
    responseReturn(res, 500, { error: error.message });
  }
};


    //end Method 


get_monthly_stats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Orders per month for current year
    const ordersStats = await authOrder.aggregate([
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

    // Sellers registered per month for current year
    const sellersStats = await sellerModel.aggregate([
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
          sellers: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const result = months.map((monthName, idx) => {
      const monthNumber = idx + 1;
      const orderMonth = ordersStats.find(o => o._id === monthNumber);
      const sellerMonth = sellersStats.find(s => s._id === monthNumber);

      return {
        month: monthName,
        orders: orderMonth ? orderMonth.orders : 0,
        revenue: orderMonth ? orderMonth.revenue : 0,
        sellers: sellerMonth ? sellerMonth.sellers : 0
      };
    });

    responseReturn(res, 200, result);
  } catch (error) {
    console.error(error);
    responseReturn(res, 500, { error: error.message });
  }
};



    add_banner = async(req,res) =>{
        const form = formidable({
            multiples:true
        })
        form.parse(req, async(err, field, files) => {
            const {productId } = field
            const {mainban} = files
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

    get_banner = async(req,res) => {
        const {productId} = req.params
        try {
            const banner = await bannerModel.findOne({ productId: new ObjectId(productId) })
            responseReturn(res,200, {banner})
        } catch (error) {
            responseReturn(res, 500, { error: error.message})
        }
    
     }
      //end Method 

      update_banner = async(req, res) => {
        const { bannerId } = req.params
        const form = formidable({})
    
        form.parse(req, async(err,_,files)=> {
            const {mainban} = files
    
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
    
                const {url } =  await cloudinary.uploader.upload(mainban.filepath, {folder: 'banners'})
    
                await bannerModel.findByIdAndUpdate(bannerId,{
                    banner: url
                })
    
                banner = await bannerModel.findById(bannerId)
                responseReturn(res,200, {banner, message: "Banner Updated Success"})
    
            } catch (error) {
                responseReturn(res, 500, { error: error.message})
            }
    
        })
      }
        //end Method 

        get_banners = async(req, res) => {
            try {
                const banners = await bannerModel.aggregate([
                    {
                        $sample: {
                            size: 5
                        }
                    }
                ])
                responseReturn(res,200,{ banners })
            } catch (error) {
                responseReturn(res, 500, { error: error.message})
            }
        }
        //end Method 
}

module.exports = new dashboardController()