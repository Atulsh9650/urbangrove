const express =require('express');
const { addproduct, deleteproduct, getAllProduct, giveratingandreview, editproduct, searchproduct } = require('../controllers/productcontroller');
const userprotectedroute = require('../middleware/protectedResource');
const router=express.Router();


router.post("/addproduct",userprotectedroute,addproduct)
router.delete("/deleteproduct/:productId",userprotectedroute,deleteproduct)
router.put("/editproduct/:productId",userprotectedroute,editproduct)
router.get("/getallproducts",getAllProduct)
router.put("/givereview/:productId",userprotectedroute,giveratingandreview)
router.get("/search",searchproduct)


module.exports=router;