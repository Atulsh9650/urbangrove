const mongoose=require('mongoose');
const userModel = require('./user.model');
const {ObjectId} =mongoose.Schema.Types;

const productSchema=new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   image:{
    type:String,
    required:true
   },
   category:{
    type:String,
    required:true
   },
   new_price:{
    type:Number,
    required:true
   },
   old_price:{
    type:Number,
    required:true
   },
   date:{
    type:Date,
    default:Date.now
   },
   isavailable:{
    type:Boolean,
    default:true
   },
   ratingsandreview:[
      {
      rating:Number,
      reviewText:String,
      ratedBy:{
          type:ObjectId,
          ref:"userModel"
      }
   }
   ]

})

const productModel=mongoose.model('productModel',productSchema);

module.exports=productModel;