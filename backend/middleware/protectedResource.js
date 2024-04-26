const jwt=require('jsonwebtoken');
const dotenv=require('dotenv').config();

const userModel = require('../models/user.model');


const userprotectedroute=(req,res,next)=>{
    const {authorization} =req.headers;
    //Bearer jdjfjgjgjngj
    if(!authorization){
        return res.status(401).json({error:"user not logged in"});
    }
   const token=authorization.replace("Bearer ","");
   jwt.verify(token,process.env.JWT_SECRET,(error,payload)=>{
      if(error){
        return res.status(401).json({error:"user not logged in"});
      }
      const {_id} =payload;
      userModel.findById(_id)
      .then((dbuser)=>{
        req.user=dbuser;
        next(); //goes to next middelware or goes to rest api
      })
   });
}



module.exports=userprotectedroute;