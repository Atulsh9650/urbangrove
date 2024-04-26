const userModel = require('../models/user.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv').config();

const getsignup = async (req, res) => {
    // Implement logic to signup
    const {fullname,email,password}=req.body;
     if(!fullname||!email||!password){
        return res.status(400).json({error:"one or more mandatory fields are empty"});
     }
     try{
     const user=await userModel.findOne({email:email});
     if(user){
        return res.status(500).json({error:"user already exist"});
     }
       const hashpass=await bcrypt.hash(password,12);
       const newUser=new userModel({fullname,email,password:hashpass});
       const resp = await newUser.save();
       return res.status(201).send({ message: "User created", resp });
     }
     catch(error){
        console.log(error);
        return res.send({message:"error occured"},error);
     }
}

const getlogin = async (req, res) => {
    // Implement logic to signup
    const {email,password}=req.body;
     if(!email||!password){
        return res.status(400).json({error:"one or more mandatory fields are empty"});
     }
     try{
     const user=await userModel.findOne({email:email});
     if(!user){
        return res.status(401).json({error:"INVALID CREDENTIALS"});
     }
       const checkpassword=await bcrypt.compare(password,user.password);
       if(checkpassword){
        const jwttoken=jwt.sign({_id:user._id},process.env.JWT_SECRET);
        const userInfo={"email":user.email,"fullname":user.fullname,"_id":user._id,"isAdmin":user.isAdmin};

        return res.status(200).json({result:{token:jwttoken,user:userInfo}});
       }
       else{
        return res.status(401).json({error:"INVALID CREDENTIALS"});
       }
     }
     catch(error){
        console.log(error);
        return res.status(500).json({message:"error occured during login"},error);
     }
}

const getadminaccess=async(req,res)=>{
   try{
      const result=await userModel.findByIdAndUpdate(
         req.body.userId,
         {isAdmin:1},
         {new:true}
      ).exec();
      return res.status(200).json({message:"admin access granted",result});
   }
   catch(error){
      res.status(400).json({error:error.message});
   }
}

const removeadminaccess=async(req,res)=>{
   try{
      const result=await userModel.findByIdAndUpdate(
         { _id: req.body.userId },
         {isAdmin:0},
         {new:true}
      ).exec();
      return res.status(200).json({message:"admin access deleted",result});
   }
   catch(error){
      res.status(400).json({error:error.message});
   }
}

const getAllProfiles = async (req, res) => {
   try {
      if (req.user.isAdmin === 1) {
         const profiles = await userModel.find();
         res.status(200).json({ profiles: profiles });
      } else {
         res.status(400).json({ error: "You are not authorized" });
      }
   } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
   }
};


const getprofile=async(req,res)=>{
   try{
   const profile = await userModel.findOne({ _id:req.user._id });
   if(!profile){
      return res.status(404).json({error:"profile not found"});
   }
   return res.status(200).json({profile});
   }
   catch(error){
      return res.status(400).json({error:error.message});
   }
}

const editprofile = async (req, res) => {
   try {
       const _id = req.user._id;
       const requestData = req.body; 

       const profile = await userModel.findOne({ _id: _id });

       if (!profile) {
           return res.status(404).json({ error: "profile not found" });
       }
        
       const checkpassword=await bcrypt.compare(requestData.password,profile.password);

       if(checkpassword){
       const hashpass=await bcrypt.hash(requestData.newpassword,12);
       profile.fullname = requestData.fullname || profile.fullname;
       profile.email = requestData.email || profile.email;
       profile.password = hashpass || profile.password;
       }
       else{
           return res.status(400).json({ error: "password is incorrect" });
       }

       const updatedProfile = await profile.save();

       res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });
   }
   catch (error) {
       console.log(error);
       res.status(500).json({ error: "Internal server error" });
   }
};

const deleteprofile = async (req, res) => {
   try {
       const userId = req.params.userId; // Extract user ID from query parameters
       const user = await userModel.findOne({ _id: userId });
       if (!user) {
           return res.status(404).json({ error: "No User Found" });
       }
       const resp = await userModel.findByIdAndDelete({ _id: userId });
       return res.status(200).json({ message: "User deleted successfully", resp });
   } catch (error) {
       console.error(error);
       res.status(500).json({ error: "Internal server error" });
   }
}


module.exports = {
    getsignup,
    getlogin,
    getadminaccess,
    removeadminaccess,
    getprofile,editprofile,
    getAllProfiles,
    deleteprofile
}