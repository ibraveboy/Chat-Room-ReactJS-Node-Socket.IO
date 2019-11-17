const dotenv = require('dotenv');
const mongoose = require("mongoose")
dotenv.config()
module.exports = function dbConnect () {
    mongoose.connect(process.env.DEV_DB, {useNewUrlParser:true})
        .then(() => {
            console.log("Database is connected.")
    })
}
