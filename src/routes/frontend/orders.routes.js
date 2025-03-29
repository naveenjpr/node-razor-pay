const express = require('express');
const route = express.Router();
const orderController = require('../../controllers/frontend/orders.controller');

module.exports = app => {

    route.post('/place-order', orderController.placeOrder);
    route.post('/confirm-order', orderController.confirmOrder);

    app.use('/api/frontend/orders', route);

}