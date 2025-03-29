const orderModel = require('../../models/order.schema');

const Razorpay = require('razorpay');

const instance = new Razorpay({
    key_id: 'rzp_test_sN9yGpladGdVuN',
    key_secret: 'zJA2kbTlknrj2gl6zmcTzlPA',
});

exports.placeOrder = async (request, response) => {

    var data = new orderModel({
        user_id: request.body.user_id,  // यूज़र का ID
        product_details: request.body.product_details, // प्रोडक्ट की जानकारी
        order_total: request.body.order_total,  // कुल ऑर्डर की कीमत
        shipping_details: request.body.shipping_details,  // डिलीवरी एड्रेस
        status: 1 // 1 का मतलब "Processing" स्टेटस
    })

    await data.save().then((result) => {

        var options = {
            amount: Math.round(result.order_total * 100), // Razorpay को पैसे की वैल्यू "पैसे" में चाहिए (₹10 = 1000 पैसे)
            currency: "INR",  // भारतीय रुपये (INR) में पेमेंट
            receipt: result._id.toString() // यूनीक ऑर्डर ID (MongoDB Object ID)
        };

        instance.orders.create(options, async function (err, order) {
            if (err || !order) {
                console.error("Razorpay Order Error:", err);
                return response.status(500).json({
                    status: false,
                    message: "Failed to create Razorpay order",
                    error: err
                });
            }

            await orderModel.updateOne(
                {
                    _id: result._id
                },
                {
                    $set: {
                        razorpay_order_id: order.id
                    }
                });
            // console.log(result);

            order.status = 1;
            var resp = {
                status: true,
                message: 'Order Placedd successfully !!',
                data: order
            }

            response.send(resp);

        })

    }).catch((error) => {
        console.error("Order Placement Error:", error);

        response.status(500).json({
            status: false,
            message: 'Something went wrong!',
            error: error.message
        });

    });
}

exports.confirmOrder = async (request, response) => {

    await orderModel.updateOne(
        {
            razorpay_order_id: request.body.order_id // Razorpay द्वारा दिया गया Order ID
        },
        {
            $set: {
                razorpay_payment_id: request.body.payment_id, // पेमेंट आईडी (Razorpay से मिली)
                status: request.body.status // पेमेंट का स्टेटस (Success/Failed)
            }
        }
    ).then((result) => {

        var resp = {
            status: true,
            message: 'Order Status update successfully !!',
        }

        response.send(resp);

    }).catch((error) => {

        var resp = {
            status: false,
            message: 'Something went wrong !!'
        }

        response.send(resp);

    });
}