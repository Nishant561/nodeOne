const express = require("express");
const userConnectionRouter = express.Router();
const { User } = require("./../config/schema/userModel");
const authUser = require("./../middleware/authUser");
const ConnectionRequestModel = require("./../config/schema/connectionModel");
userConnectionRouter.get(
  "/user/connections",
  authUser.protect,
  async (request, response) => {
    try {
      const loggedInUser = request.user;

      const connections = await ConnectionRequestModel.find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      }).populate("fromUserId", "firstName " ).populate("toUserId" , "firstName ");
      

      const data = connections.map(items =>{
        if(items.fromUserId._id.toString()=== loggedInUser._id.toString()){
            return items.toUserId
        }
        return items.fromUserId
      })
      
      return response.status(200).json({
        status:"success",
        length: connections.length,
        data:data

      })







    } catch (error) {
      return response.status(404).json({
        status: "fail",
        message: "Error:: " + error.message,
      });
    }
  }
);

userConnectionRouter.get("/user/request" , authUser.protect , async(request , response)=>{
    try {
        
        const loggedInUser = request.user
        
        const existingRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id , status:"liked"
        }).populate("fromUserId" , "firstName ")

        const data = existingRequest.map(items =>{
            return items.fromUserId
        })

        return response.status(200).json({
            status:"success",
            data:data
        })




    } catch (error) {
        return response.status(404).json({
            status:'fail',
            message:"Error:: " + error.message
        })
    }
})

userConnectionRouter.get("/user/feed" , authUser.protect , async(request , response)=>{
  try {

    const loggedInUser = request.user
    const page = parseInt(request.query.page) || 1
    let limit = parseInt(request.query.limit) || 10
    let skip = (page - 1)*limit

    limit = limit>50? 10 : limit


    const totalUserOnTheConnection = await ConnectionRequestModel.find({
      $or:[
        {fromUserId:loggedInUser._id},
        {toUserId:loggedInUser._id}
      ]
    }).select("fromUserId toUserId")

    const hideUsers = new Set()

    totalUserOnTheConnection.forEach((items)=>(
      hideUsers.add(items.fromUserId.toString()),
      hideUsers.add(items.toUserId.toString())
    ))

    const user = await User.find({
      $and:[
        {_id:{$nin:Array.from(hideUsers)}},
        {_id:{$ne:loggedInUser._id}}
      ]
    }).skip(skip).limit(limit)



    return response.status(200).json({
      status:"success",
      data: user
    })







  } catch (error) {
    return response.status(404).json({
      status:'fail',
      message:"Error:: " + error.message
    })
  }
})



module.exports = userConnectionRouter;
