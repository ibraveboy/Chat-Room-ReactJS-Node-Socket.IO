const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const passport = require("passport")
const JwtSrategy = require("./authentication/jwtstrategy")
const dbConnect = require("./Database/connection")
const UserModel = require("./models/UserModel")
const PrivateChatModel = require("./models/PrivateChat")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const port = process.env.PORT || 3000;
dbConnect();
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
        console.log(users)
    })

    //When User Will Emit Message
    socket.on("sendMessage", message => {
        socket.to(message.room).emit("messageReceived", message)
        socket.emit("messageReceived", message)
    })

    //When User Will Emit Private Message
    socket.on("sendPrivateMessage", message => {
        
        const rUser = users.find((user) => user.username == message.recieverUsername)
        PrivateChatModel.find(
            {
                $or: [{
                    $and: [{ senderUsername: message.senderUsername }, { recieverUsername: message.recieverUsername }]
                }, {
                        $and: [{ recieverUsername: message.senderUsername }, { senderUsername: message.recieverUsername }]
                    }
                ]
            },
            {
                senderUsername: 1,
                recieverUsername:1,
            }
        ).then(chat => {
            
            if (chat.length) {
                let messageObj = {
                    senderUsername: message.senderUsername,
                    text: message.text,
                    time:Date.now()
                }
                PrivateChatModel.findOneAndUpdate({ senderUsername: chat[0].senderUsername, recieverUsername: chat[0].recieverUsername }, {
                    $push:{messages:messageObj}
                }, { new: true, projection: { messages: { $elemMatch: {time:messageObj.time}}}})
                    .then(chatSingle => {
                    console.log(chatSingle)
                    if(rUser)
                        socket.to(`${rUser.id}`).emit("recievedPrivateMessage", chatSingle)
                    socket.emit("recievedPrivateMessage", chatSingle)
                })
            } else {
                let chatObj = {
                    senderUsername: message.senderUsername,
                    recieverUsername: message.recieverUsername,
                    messages: [{
                        senderUsername: message.senderUsername,
                        text:message.text
                    }]
                }
                const newChat = new PrivateChatModel(chatObj)
                newChat.save().then(chat => {
                    if(rUser)
                        socket.to(`${rUser.id}`).emit("recievedPrivateMessage", chat)
                    socket.emit("recievedPrivateMessage", chat)
                })
            }
        })
    })

    //When User change room
    socket.on("changeRoom", (roomsInfo) => {
        console.log("roomchange",roomsInfo)
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
        
    })

    //When User Leave Room
    socket.on("leaveRoom", (roomInfo) => {
        socket.to(roomInfo.roomName).emit("leaveRoom", roomInfo)
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
passport.use(JwtSrategy)

// All Routes

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    UserModel.findOne({ username })
        .then((user) => {
            if (user) {
                bcrypt.compare(password, user.password, (err, isSame) => {
                    if (isSame) {
                        jwt.sign({
                            id: user._id
                        },
                            "secret",
                            (err,token) => {
                                res.json("Bearer "+token)
                            }
                        )
                    } else {
                        res.json(err)
                    }
                }
                )
            }else {
                res.status(404).send("No User Found.")    
            }
        })
})


app.post("/register", (req,res) => {
    const { username, password,room } = req.body;
    bcrypt.hash(password, 4, (err,hash) => {
        if (!err) {
            const newUser = new UserModel({ username, password:hash,room })
            newUser
                .save()
                .then((user) => {
                    jwt.sign({
                        id:user._id
                    },
                        "secret",
                        (err,token) => {
                            if (!err)
                                res.json(token)
                        }
                    )
                })
                .catch(err => {
                    res.status(404).send(`"${username}" is not available`)
                })
        }
    })
})

app.get("/me", passport.authenticate("jwt", { session: false }), (req,res) => {
    res.json(req.user)
})

app.post("/update", passport.authenticate("jwt", { session: false }), (req,res) => {
    const { room } = req.body
    console.log(req.user,room)
    UserModel.findOneAndUpdate({ _id: req.user._id }, { room })
        .then(u => {
            res.send(room)
        })
        .catch(err => {
            res.status(404).send("Room Not Updated.")
        })
})

//Get Private Messages

app.get("/privateMessages/:rUsername",passport.authenticate("jwt", { session: false }), (req,res) => {
    const rUsername = req.params.rUsername
    const sUsername = req.user.username
    PrivateChatModel.find({ $or: [{ $and: [{ senderUsername: sUsername }, { recieverUsername: rUsername }] }, {$and: [{ recieverUsername: sUsername }, { senderUsername: rUsername }] }] }).then(chat => {
        res.json(chat)
    })
})

// app.get("/*", (req, res) => {
//     res.sendFile("../client/dist/index.html");
// });

server.listen(port, () => {
    console.log("server is litening on port 3000");
});
