const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
    senderUsername: String,
    recieverUsername: String,
    messages: [{
        senderUsername:String,
        text: String,
        time: {
            type: Date,
            default:Date.now(),
        }
    }]
})

module.exports=mongoose.model("privatechat",chatSchema)