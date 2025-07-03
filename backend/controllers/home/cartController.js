const cartModel = require('../../models/cartModel');
const { responseReturn } = require('../../utiles/response');
const { mongo: { ObjectId } } = require('mongoose');
const wishlistModel = require('../../models/wishlistModel');

class cartController {
    // ==================== CART METHODS (ORIGINAL WORKING VERSION) ====================

    add_to_cart = async (req, res) => {
        console.log(req.body);
        const { userId, productId, quantity } = req.body;
        try {
            const product = await cartModel.findOne({
                $and: [{
                    productId: {
                        $eq: productId
                    }
                },
                {
                    userId: {
                        $eq: userId
                    }
                }
                ]
            });

            if (product) {
                responseReturn(res, 404, { error: "Product Already Added To Cart" });
            } else {
                const product = await cartModel.create({
                    userId,
                    productId,
                    quantity
                });
                responseReturn(res, 201, { message: "Added To Cart Successfully", product });
            }

        } catch (error) {
            console.log(error.message);
        }
    };

    get_cart_products = async (req, res) => {
        const co = 5;
        const { userId } = req.params;
        try {
            const cart_products = await cartModel.aggregate([{
                $match: {
                    userId: {
                        $eq: new ObjectId(userId)
                    }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: "_id",
                    as: 'products'
                }
            }
            ]);

            let buy_product_item = 0;
            let calculatePrice = 0;
            let cart_product_count = 0;
            const outOfStockProduct = cart_products.filter(p => p.products[0].stock < p.quantity);
            for (let i = 0; i < outOfStockProduct.length; i++) {
                cart_product_count = cart_product_count + outOfStockProduct[i].quantity;
            }
            const stockProduct = cart_products.filter(p => p.products[0].stock >= p.quantity);
            for (let i = 0; i < stockProduct.length; i++) {
                const { quantity } = stockProduct[i];
                cart_product_count = buy_product_item + quantity;
                buy_product_item = buy_product_item + quantity;
                const { price, discount } = stockProduct[i].products[0];
                if (discount !== 0) {
                    calculatePrice = calculatePrice + quantity * (price - Math.floor((price * discount) / 100));
                } else {
                    calculatePrice = calculatePrice + quantity * price;
                }
            } //end for
            let p = [];
            let unique = [...new Set(stockProduct.map(p => p.products[0].sellerId.toString()))];
            for (let i = 0; i < unique.length; i++) {
                let price = 0;
                for (let j = 0; j < stockProduct.length; j++) {
                    const tempProduct = stockProduct[j].products[0];
                    if (unique[i] === tempProduct.sellerId.toString()) {
                        let pri = 0;
                        if (tempProduct.discount !== 0) {
                            pri = tempProduct.price - Math.floor((tempProduct.price * tempProduct.discount) / 100);
                        } else {
                            pri = tempProduct.price;
                        }
                        pri = pri - Math.floor((pri * co) / 100);
                        price = price + pri * stockProduct[j].quantity;
                        p[i] = {
                            sellerId: unique[i],
                            shopName: tempProduct.shopName,
                            price,
                            products: p[i] ? [
                                ...p[i].products,
                                {
                                    _id: stockProduct[j]._id,
                                    quantity: stockProduct[j].quantity,
                                    productInfo: tempProduct
                                }
                            ] : [{
                                _id: stockProduct[j]._id,
                                quantity: stockProduct[j].quantity,
                                productInfo: tempProduct
                            }]
                        };
                    }
                }
            }
            responseReturn(res, 200, {
                cart_products: p,
                price: calculatePrice,
                cart_product_count,
                shipping_fee: 20 * p.length,
                outOfStockProduct,
                buy_product_item
            });

        } catch (error) {
            console.log(error.message);
        }
    };

    delete_cart_products = async (req, res) => {
        const { cart_id } = req.params;
        try {
            await cartModel.findByIdAndDelete(cart_id);
            responseReturn(res, 200, { message: "Product Removed Successfully" });
        } catch (error) {
            console.log(error.message);
        }
    };

    quantity_inc = async (req, res) => {
        const { cart_id } = req.params;
        try {
            const product = await cartModel.findById(cart_id);
            const { quantity } = product;
            await cartModel.findByIdAndUpdate(cart_id, { quantity: quantity + 1 });
            responseReturn(res, 200, { message: "Qty Updated" });

        } catch (error) {
            console.log(error.message);
        }
    };

    quantity_dec = async (req, res) => {
        const { cart_id } = req.params;
        try {
            const product = await cartModel.findById(cart_id);
            const { quantity } = product;
            await cartModel.findByIdAndUpdate(cart_id, { quantity: quantity - 1 });
            responseReturn(res, 200, { message: "Qty Updated" });
        } catch (error) {
            console.log(error.message);
        }
    };

    // ==================== WISHLIST METHODS (IMPROVED VERSION) ====================

    add_wishlist = async (req, res) => {
        const { userId, productId, slug } = req.body;
        try {
            if (!ObjectId.isValid(userId) || !ObjectId.isValid(productId)) {
                return responseReturn(res, 400, { error: "Invalid user or product ID" });
            }

            const existingItem = await wishlistModel.findOne({
                slug,
                userId: new ObjectId(userId)
            });

            if (existingItem) {
                return responseReturn(res, 409, { error: "Product already in wishlist" });
            }

            const newWishlistItem = await wishlistModel.create({
                ...req.body,
                userId: new ObjectId(userId),
                productId: new ObjectId(productId)
            });

            return responseReturn(res, 201, {
                message: "Product added to wishlist successfully",
                wishlistItem: newWishlistItem
            });

        } catch (error) {
            console.error("Add to wishlist error:", error.message);
            return responseReturn(res, 500, { error: "Server error while adding to wishlist" });
        }
    };

    get_wishlist = async (req, res) => {
        const { userId } = req.params;
        try {
            if (!ObjectId.isValid(userId)) {
                return responseReturn(res, 400, { error: "Invalid user ID" });
            }

            const wishlist = await wishlistModel.find({
                userId: new ObjectId(userId)
            }).populate('productId');

            return responseReturn(res, 200, {
                wishlistCount: wishlist.length,
                wishlist
            });

        } catch (error) {
            console.error("Get wishlist error:", error.message);
            return responseReturn(res, 500, {
                error: "Server error while fetching wishlist",
                wishlistCount: 0,
                wishlist: []
            });
        }
    };

    remove_wishlist = async (req, res) => {
        const { wishlistId } = req.params;
        try {
            if (!ObjectId.isValid(wishlistId)) {
                return responseReturn(res, 400, { error: "Invalid wishlist ID" });
            }

            const deletedItem = await wishlistModel.findByIdAndDelete(wishlistId);
            if (!deletedItem) {
                return responseReturn(res, 404, { error: "Wishlist item not found" });
            }

            return responseReturn(res, 200, {
                message: "Product removed from wishlist successfully",
                deletedItem
            });

        } catch (error) {
            console.error("Remove from wishlist error:", error.message);
            return responseReturn(res, 500, { error: "Server error while removing from wishlist" });
        }
    };
}

module.exports = new cartController();