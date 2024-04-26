const productModel=require('../models/product.model')
const dotenv=require('dotenv').config();

const addproduct=async(req,res)=>{
    let products=await productModel.find({});
    
    const {name,image,category,new_price,old_price}=req.body;
    if(!name || !image || !category || !new_price || !old_price){
        return res.status(400).json({error:"All fiels are mandatory"});
    }

    const product=new productModel({
        name:name,
        image:image,
        category:category,
        new_price:new_price,
        old_price:old_price
    });
    const resp=await product.save();
    return res.status(201).json({ message: "product is created", resp })
}

const deleteproduct=async(req,res)=>{
    try {
        const productfound = await productModel.findOne({ _id: req.params.productId });
        
        if (!productfound) {
            return res.status(404).json({ error: "Product not found" });
        }

        //delete the post
        await productModel.deleteOne({ _id: req.params.productId });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getAllProduct=async(req,res)=>{
    productModel.find()
    .populate("ratingsandreview.ratedBy","_id fullname")
    .then((dbProducts)=>{
        res.status(200).json({products:dbProducts})
    })
    .catch((error)=>{
        console.log(error);
    })
}

const searchproduct=async(req,res)=>{
    const { query } = req.query;

    try {
        const regex = new RegExp(query, 'i');
        const products = await productModel.find({ name: regex });
        res.status(200).json({ products });
    } catch (error) {
        console.error('Error searching for products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

const editproduct = async (req, res) => {
    try {
        const _id = req.params.productId;
        const requestData = req.body; // Assuming the request body contains all fields to update

        const product = await productModel.findOne({ _id: _id });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Update each field individually
        product.name = requestData.name || product.name;
        product.image = requestData.image || product.image;
        product.category = requestData.category || product.category;
        product.new_price = requestData.new_price || product.new_price;
        product.old_price = requestData.old_price || product.old_price;
        product.isavailable=requestData.isavailable||product.isavailable;

        const updatedProduct = await product.save();

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const giveratingandreview=async(req,res)=>{
    try{
        const _id=req.params.productId;
        const product = await productModel.findOne({ _id: _id });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const ratingsandreview={rating:req.body.rating,reviewText:req.body.reviewText,ratedBy:req.user._id}
        const result=await productModel.findByIdAndUpdate(
             _id,
            {$push:{ratingsandreview:ratingsandreview}},
            {new:true}
        ).populate("ratingsandreview.ratedBy","_id fullname").exec(); //review owner

        res.status(200).json(result);
    }catch(error){
        res.status(400).json({error:error.message});
    }
}


module.exports={
    addproduct,
    deleteproduct,
    getAllProduct,
    editproduct,
    giveratingandreview,
    searchproduct
}