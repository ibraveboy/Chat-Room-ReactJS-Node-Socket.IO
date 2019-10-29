const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        minlength: 8,
    },
    socket_id: String,
    room: String,
})

module.exports = mongoose.model("user",userSchema);