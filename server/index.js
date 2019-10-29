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
                                res.json(token)
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
    const { username, password } = req.body;
    bcrypt.hash(password, 4, (err,hash) => {
        if (!err) {
            const newUser = new UserModel({ username, password:hash })
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

app.get("/*", (req, res) => {
    res.sendFile("../client/dist/index.html");
});

server.listen(port, () => {
    console.log("server is litening on port 3000");
});
