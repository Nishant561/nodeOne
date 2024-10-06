const express = require("express");
const connectionRouter = express.Router();
const authUser = require("./../middleware/authUser");
const { User } = require("./../config/schema/userModel");
const ConnectionRequestModel = require("./../config/schema/connectionModel");
connectionRouter.post(
  "/connection/:status/:userId",
  authUser.protect,
  async (request, response) => {
    try {
      const loggedInUser = request.user;
        const fromUserId = loggedInUser._id

      const { status, userId } = request.params;
        const toUserId = userId
      const allowedStatus = ["ignored", "liked"];
      const isAllowedStatus = allowedStatus.includes(status);

      if (!isAllowedStatus) {
        throw new Error(`The field is not allowed. Field is ` + status);
      }

      const toSendUser = await User.findById(userId);

      if (!toSendUser) {
        throw new Error(
          "The requested id cannot be found. Please try again later."
        );
      }

      if (loggedInUser._id.toString() === toSendUser._id.toString()) {
        throw new Error("You cannot send a connection request to yourself.");
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or:[
            {fromUserId , toUserId},
            {fromUserId:toUserId , toUserId:fromUserId}
        ]
      })

      if(existingConnectionRequest){
        throw new Error ("Request already exist.")
      }

      const connectionRequest = await ConnectionRequestModel({
        fromUserId: loggedInUser._id,
        toUserId: userId,
        status: status,
      });


      await connectionRequest.save();

      return response.status(201).json({
        status: "success",
        message: `${loggedInUser.firstName} sends a connection request to ${toSendUser.firstName}`,
      });
    } catch (error) {
      return response.status(400).json({
        status: "fail",
        message: "Error:: " + error.message,
      });
    }
  }
);


connectionRouter.post("/connection/review/:status/:userId" , authUser.protect , async (request , response)=>{
   try {
    const status = request.params.status
    const userId = request.params.userId
    const loggedInUser = request.user
    const allowedReview = ["accepted" , "rejected"]

    const isReviewAllowed = allowedReview.includes(status)

    if(!isReviewAllowed){
        throw new Error ("The request " + status +" is not allowed.")
    }

    

    const isThereRequestFromTheId = await ConnectionRequestModel.findOne({
        fromUserId:userId,
        toUserId:loggedInUser._id
    })

    if(!isThereRequestFromTheId){
        throw new Error ("We could not found any connection request with this id.")
    }

    isThereRequestFromTheId.status = status
    await isThereRequestFromTheId.save()

    return response.status(200).json({
        status:"success",
        message:`The request is ` + status
    })
    
   } catch (error) {
        return response.status(404).json({
            status:"fail",
            message:"Error:: " + error.message
        })
   }



})


module.exports = connectionRouter;
