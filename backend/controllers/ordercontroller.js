const dotenv=require('dotenv').config();
const orderModel=require('../models/order.model')

const addorder=async(req,res)=>{
    try {
        const { amount, address, products ,payment_mode} = req.body;

        if(!amount || !address || !products|| !payment_mode){
            return res.status(400).json({error:"All fiels are mandatory"});
        }


        // Create a new order
        const order = new orderModel({
            custId:req.user._id,
            amount:amount,
            address:address,
            payment_mode:payment_mode,
            products:products
        });

        // Save the order to the database
        const resp=await order.save();

        // Send success response
        res.status(201).json({ success: true, message: 'Order placed successfully' });
    } catch (error) {
        // Send error response
        res.status(500).json({ success: false, message: 'Failed to add order', error: error.message });
    }

}


const getOrderbycustid = async (req, res) => {
    try {
        const orders = await orderModel.find({ custId: req.user._id }).populate('products.product');
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

const cancelorder=async(req,res)=>{
    try {
        const orderfound = await orderModel.findOne({ _id: req.params.orderId });
        
        if (!orderfound) {
            return res.status(404).json({ error: "order not found" });
        }

        //delete the order
        await orderModel.deleteOne({ _id: req.params.orderId });
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getallorders= async (req, res) => {
    orderModel.find()
    .populate('products.product')
    .then((dborders)=>{
        res.status(200).json({orders:dborders})
    })
    .catch((error)=>{
        console.log(error);
    })
};
const updateDeliveryStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ error: "Both orderId and status are required" });
        }

        // Update the delivery status of the order in the database
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { del_status: status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({ success: true, message: 'Delivery status updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating delivery status:', error);
        res.status(500).json({ error: 'Failed to update delivery status' });
    }
};


module.exports={
    addorder,getOrderbycustid,getallorders,updateDeliveryStatus
    ,cancelorder
}