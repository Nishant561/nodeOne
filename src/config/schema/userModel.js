const mongoose = require("mongoose")
const validator = require('validator')
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        minLength:4,
        maxLength:20,
        trim:true,
        required:[true , "First Name of the user is required"]
    },
    email:{
        type:String,
        required:[true , "Email is required."],
        trim:true,
        unique:[true , "User with this email already exist."],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid.")
            }
        }
    },
    password:{
        type:String,
        trim:true,
        required:[true , "Password is required"],
        minLength:4,
        
       
    },
    skills:{
        type:[String],
        default:["javascript" , "c" ,"c++"]
    },
    age:{
        type:Number,
        default:18
    }
},{
    timestamps:true
})

const User = mongoose.model("users" , userSchema)
 module.exports = {
    User
 }