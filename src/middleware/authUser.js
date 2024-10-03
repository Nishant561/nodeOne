const {User} = require("./../config/schema/userModel")
const bcrypt  =require("bcrypt")
const { response } = require("express")
const jwt = require("jsonwebtoken")
exports.login = async (request , response ,next)=>{
    try {
        const {email , password} = request.body

        const user = await User.findOne({email})
    
        // checking if the user exists or not
        if(!user){
            throw new Error("User with this email not found")
        } 

        // checking if the password is correct or not
        const isPasswordCorrect = await bcrypt.compare(password , user.password)

        if(!isPasswordCorrect){
            throw new Error("Password dosent matched.")
        }

        // generating the web token 
            const token = await jwt.sign({_id:user._id},"nishant123",{
                expiresIn:'1h'
            })
             response.cookie("token" , token)



        // securing the user on the route
        request.user = user

        // calling the next middleware if all the condition is correct.
        next()
        

    } catch (error) {
        return response.status(404).json({
            status:"fail",
            message:"Error:: "+ error.message
        })
    }



}

exports.protect = async(request , response ,next)=>{
    try {
        const {token} = request.cookies
        // checking if the token is present or not
        if(!token){
            throw new Error ("please login to continue")
        }

        // if the token is valid we have to check if the token is valid or not
        const isTokenValid = await jwt.verify(token , "nishant123")
    

        //decoding the data from the token
         const{_id} = isTokenValid

        // checking if the user is present in the database or not

        const user = await User.findById(_id)

        request.user = user
        next()

    } catch (error) {
        return response.status(404).json({
            status:"fail",
            message:"Error:: "+ error.message
        })
    }
}