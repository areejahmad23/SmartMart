const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/home/cartController');
// const { isAuthenticated } = require('../../middleware/authMiddleware');

// Cart routes
router.post('/home/product/add-to-cart', cartController.add_to_cart);
router.get('/home/product/get-cart-product/:userId', cartController.get_cart_products);
router.delete('/home/product/delete-cart-product/:cart_id', cartController.delete_cart_products); // Note plural method name
router.put('/home/product/quantity-inc/:cart_id', cartController.quantity_inc);
router.put('/home/product/quantity-dec/:cart_id', cartController.quantity_dec);

// Wishlist routes
router.post('/home/product/add-to-wishlist', cartController.add_wishlist); // Changed to match controller
router.get('/home/product/get-wishlist-products/:userId', cartController.get_wishlist);
router.delete('/home/product/remove-wishlist-product/:wishlistId', cartController.remove_wishlist); // Changed to match controller

module.exports = router;