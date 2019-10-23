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
const users = []
const rooms = [{name:"react"},{name:"node"},{name:"javascript"}]

// Find User 

const findUser = (userId) => {
    let user = users.find((user) => {
        return user.id==userId
    })
    return user?user:false
}

//On Connection

io.on("connection", socket => {
    console.log("User Connected")
    // When User Login
    socket.on("user", user => {
        socket.join(user.room)
        user.id = socket.id
        socket.to(user.room).emit("newUserJoined", user)
        socket.broadcast.emit("allRooms", rooms)
        socket.emit("allRooms", rooms)
        users.push(user)
        let roomMembers=users.filter((_user)=> _user.room == user.room )
        socket.to(user.room).emit("allUsers", roomMembers)
        socket.emit("allUsers", roomMembers)
        console.log("membersNew",roomMembers,"all",users)
    })

    //When User Will Emit Message
    socket.on("sendMessage", message => {
        socket.to(message.room).emit("messageReceived", message)
        socket.emit("messageReceived", message)
    })

    //When User change room
    socket.on("changeRoom", (roomsInfo) => {
        socket.leave(roomsInfo.old)
        socket.join(roomsInfo.new)
        let user = findUser(socket.id)
        user.room=roomsInfo.new
        socket.to(user.room).emit("joinOtherRoom", user)
        socket.to(roomsInfo.old).emit("leftForOtherRoom", user)
        let roomMembers=users.filter((_user)=> _user.room == user.room )
        socket.to(user.room).emit("allUsers", roomMembers)
        socket.emit("allUsers", roomMembers)
        roomMembers=users.filter((_user)=> _user.room == roomsInfo.old )
        socket.to(roomsInfo.old).emit("allUsers", roomMembers)
        console.log("all",users)
    })

    //When User Went Offline
    socket.on("disconnect", () => {
        console.log("User left")
        let user = users.filter(user => {
            return user.id==socket.id
        })
        user = user[0]
        socket.to(user.room).emit("userLeft", user)
        users.splice(users.findIndex(u=> u.id==socket.id),1)
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
