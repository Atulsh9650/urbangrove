const {getsignup,getlogin, getadminaccess, removeadminaccess, getprofile, editprofile, getAllProfiles, deleteprofile} =require('../controllers/usercontroller');
const express =require('express');
const userprotectedroute = require('../middleware/protectedResource');
const router=express.Router();


router.post("/signup",getsignup)
router.post("/login",getlogin)
router.put("/getadminaccess",userprotectedroute,getadminaccess)
router.put("/removeadminaccess",userprotectedroute,removeadminaccess)
router.get("/getprofile",userprotectedroute,getprofile)
router.post("/editprofile",userprotectedroute,editprofile)
router.get("/getallprofiles",userprotectedroute,getAllProfiles)
router.delete("/deleteprofile/:userId",userprotectedroute,deleteprofile)

module.exports=router;