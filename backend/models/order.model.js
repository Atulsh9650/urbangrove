const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
    custId: {
        type: ObjectId,
        ref: "userModel"
    },
    amount: {
        type: Number,
        required: true
    },
    del_status: {
        type: String,
        default: 'pending'
    },
    address: {
        type: String,
        required: true
    },
    payment_mode:{
        type: String,
        required: true
    },
    products: [
        {
            product: {
                type: ObjectId,
                ref: "productModel"
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
},{ timestamps: true } );

const orderModel = mongoose.model('orderModel', orderSchema);

module.exports = orderModel;
