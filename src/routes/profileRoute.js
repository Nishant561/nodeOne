const express = require("express")
const authUser = require("./../middleware/authUser")
const updateValidate = require("./../utils/updateValidate")
const profileRouter = express.Router()

profileRouter.get("/profile" , authUser.protect , async (request , response)=>{
    try {
      const user = Object.assign(request.user)

      return response.status(200).json({
        status:"success",
        data:{
          user
        }
      })



    } catch (error) {
      return response.status(404).json({
        status:"fail",
        message:"Error:: " + error.message
      })
    }
    
})


profileRouter.patch("/profile/edit", authUser.protect , async(request , response)=>{
    try {
        
        if(!updateValidate.updateValidate(request.body)){
            throw new Error("some requested field cannot be updated.")
        }

        const loggedInUser = request.user

        Object.keys(request.body).forEach(key => loggedInUser[key] = request.body[key])
        await loggedInUser.save()

        return response.status(200).json({
            status:"success",
            message:`${loggedInUser.firstName} you updated your profile successfully.`
        })


    } catch (error) {
        return response.status(404).json({
            status:"fail",
            message:"Error:: "+error.message 
        })
    }
})

module.exports = {profileRouter}