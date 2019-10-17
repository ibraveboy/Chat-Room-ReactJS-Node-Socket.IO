const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app)
const io = socketIo(server)
// Socket.io
const users=[]
io.on("connection", socket => {
    console.log("User Connected")
    // When User Login
    socket.on("user", user => {
        socket.join(user.room)
        socket.to(user.room).emit("newUserJoined",user)
        user.id=socket.id
        users.push(user)
    })

    //When User Will Emit Message
    socket.on("sendMessage", message => {
        socket.to(message.room).emit("messageReceived", message)
        socket.emit("messageReceived", message)
    })

    //When User Left
    socket.on("disconnect", () => {
        console.log("User left")
        let user = users.filter(user => {
            return user.id==socket.id
        })
        user=user[0]
        socket.broadcast.emit("userLeft",user)
    })
})



// Middlewares

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname,"../server")));


// All Routes

app.get("/*", (req, res) => {
    res.sendFile("../client/dist/index.html");
});

server.listen(port, () => {
    console.log("server is litening on port 3000");
});
