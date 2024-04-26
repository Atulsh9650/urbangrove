const mongoose=require('mongoose');
const dotenv=require('dotenv').config();

mongoose.connect('mongodb+srv://atulsharma9650:Atul123@cluster0.trudvne.mongodb.net/urban-grove')
.then(()=>console.log("DB connected"))
.catch((err)=>console.log(err))
