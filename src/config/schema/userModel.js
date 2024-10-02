const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        minLength:4,
        maxLength:20,
        required:[true , "First Name of the user is required"]
    },
    email:{
        type:String,
        required:[true , "Email is required."],
        unique:[true , "User with this email already exist."]
    },
    password:{
        type:String,
        required:[true , "Password is required"],
        minLength:4,
        maxLength:20
    }
}{
    timestamps:true
})

const User = mongoose.model("users" , userSchema)
 module.exports = {
    User
 }