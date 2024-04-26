const express =require('express');
const router=express.Router();
const paypal = require('paypal-rest-sdk');
require('dotenv').config();

paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_CLIENT_KEY,
    client_secret: process.env.PAYPAL_SECRET_KEY
})

router.post('/create-payment', async (req, res) => {
    const { finalPayment } = req.body; // Get cart items and final payment from request body

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": finalPayment 
            },
            "description": "Payment for your order." 
        }]
    };

    // Create PayPal payment
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to create PayPal payment.' });
        } else {
            // Redirect user to PayPal approval URL
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    return res.json({ approval_url: payment.links[i].href });
                }
            }
        }
    });
});

router.get('/success', (req, res) => {
    const { paymentId, PayerID } = req.query;

    // Execute PayPal payment
    paypal.payment.execute(paymentId, { payer_id: PayerID }, (error, payment) => {
        if (error) {
            console.error(error);
            return res.redirect('/cancel'); // Redirect to error page
        } else {
            return res.redirect('/success'); 
        }
    });
});

router.get('/cancel', (req, res) => {
    res.redirect('/cancel'); // Redirect to error page in case of payment cancellation
});

module.exports=router;
