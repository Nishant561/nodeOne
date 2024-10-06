const mongoose = require("mongoose")


const connectionSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        requiured: true
        
    },

    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true
    },

    status:{
        type:String,
        enum:{
            values:["ignored","liked" , "accepted" ,"rejected"],
            message:"The given field cannot be accepted " + this.status +"."
        }
    }

},{
    timestamps:true,
})
connectionSchema.index({fromUserId:1 , toUserId:1})

const ConnectionRequestModel = mongoose.model("connection" , connectionSchema)

module.exports = ConnectionRequestModel
