const express = require('express');
const route = express.Router();
const orderController = require('../../controllers/frontend/orders.controller');

module.exports = app => {

    route.get('/place-order', orderController.placeOrder);
    route.get('/confirm-order', orderController.confirmOrder);

    app.use('/api/frontend/orders', route);

}