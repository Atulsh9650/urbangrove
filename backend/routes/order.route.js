const express =require('express');
const userprotectedroute = require('../middleware/protectedResource');
const { addorder, getOrderbycustid, getallorders, updateDeliveryStatus, cancelorder } = require('../controllers/ordercontroller');
const router=express.Router();


router.post("/addorder",userprotectedroute,addorder)
router.get("/getOrderbycustid",userprotectedroute,getOrderbycustid);
router.get("/getAllorders",userprotectedroute,getallorders)
router.put("/updateorder",userprotectedroute,updateDeliveryStatus)
router.delete('/cancelorder/:orderId',userprotectedroute,cancelorder)

module.exports=router;