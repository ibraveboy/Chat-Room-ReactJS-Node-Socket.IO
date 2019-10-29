const mongoose = require("mongoose")
module.exports = function dbConnect () {
    mongoose.connect("mongodb://ameer:ahb11223@cluster0-shard-00-00-awx2g.mongodb.net:27017,cluster0-shard-00-01-awx2g.mongodb.net:27017,cluster0-shard-00-02-awx2g.mongodb.net:27017/chatroom?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority", {useNewUrlParser:true})
        .then(() => {
            console.log("Database is connected.")
    })
}
