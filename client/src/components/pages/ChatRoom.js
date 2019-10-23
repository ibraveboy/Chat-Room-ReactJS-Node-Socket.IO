import React, { Component } from 'react'
import io from "socket.io-client"
import { animateScroll } from "react-scroll"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"

class ChatRoom extends Component {
    state = {
        username: "ibraveboy",
        room: "react",
        messages: [],
        newUser: {
            username: "",
        },
        users: [],
        rooms:[],
        text: "",
        showOnlineUsers: false,
        showAllGroups: false,
        roomChange:false
    }
    socket = io("http://localhost:3000/")

    initSocket = () => {

        let username = this.props.match.params.username
        let room = this.props.match.params.room
        
        this.setState({
            username: username,
            room:room
        })
    
        this.socket.emit("user", { username: username, room: room })

        //User Joined
        this.socket.on("newUserJoined", (user) => {
            let message = `${user.username} has joined this room`;
            let messageObj = {
                message,
                type: "newUser",
                name:user.username
            }
            this.setState(
                {
                    messages: [...this.state.messages, messageObj],
                    users:[...this.state.users,user]
                }
            )
        })

        //User Changed Room
        this.socket.on("joinOtherRoom", (user) => {
            let message = `${user.username} has joined this room`;
            let messageObj = {
                message,
                type: "newUser",
                name:user.username
            }
            this.setState(
                {
                    messages: [...this.state.messages, messageObj],
                }
            )
        })

        //User Left Room Message On Joining other Room

        this.socket.on("leftForOtherRoom", (user) => {
            let message = `${user.username} has left this room`;
            let messageObj = {
                message,
                type: "newUser",
                name:user.username
            }
            this.setState(
                {
                    messages: [...this.state.messages, messageObj],
                }
            )
        })

        // User Went Offline 
        this.socket.on("userLeft", (user) => {
            let message = `${user.username} has left this room`;
            let messageObj = {
                message,
                type: "newUser",
                name:user.username
            }
            let users = [...this.state.users]
            users.splice(users.findIndex(u => u.id==user.id),1)
            this.setState(
                {
                    messages: [...this.state.messages, messageObj],
                    users:[...users]
                }
            )
        })

        // RoomsUpdate
        this.socket.on("allRooms", (rooms) => {
            console.log("rooms server",rooms)
            this.setState(
                {
                    rooms
                }
            )
        })

        // UsersUpdate
        this.socket.on("allUsers", (users) => {
            let others=users.filter(user => user.id!=this.socket.id)
            this.setState(
                {
                    users:[...others]
                }
            )
        })

        //Message Received
        this.socket.on("messageReceived", message => {
            let msg = {
                message: message.message,
                name: message.username,
                type:(this.state.username==message.username?"left":"right")
            }
            this.setState({
                messages:[...this.state.messages,msg]
            },this.scrollToBottom)
        })
    }
    scrollToBottom = () => {
        animateScroll.scrollToBottom({
            containerId:"chat-box"
        })
    }


    //Message Text Change Handler
    messageTextChangeHandler = (e) => {
        this.setState({
            text:e.target.value
        })
    }


    // Message Send Handler Code
    sendButtonClickHandler = () => {
        let messageObj = {
            username: this.state.username,
            message: this.state.text,
            room:this.state.room
        }
        this.socket.emit("sendMessage", messageObj)
        this.setState({
            text:""
        })
    }


    //Press Enter To Send Message
    sendButtonKeyPressHandler = (e) => {
        if (e.key == "Enter"&&!e.shiftKey) {
            e.preventDefault()
            this.sendButtonClickHandler()
        }
    }

    //Click to toggle All-Users sidebar
    onlineUserTextClickHandler = () => {
        this.setState({
            showOnlineUsers:!this.state.showOnlineUsers
        })
    }

    //Click to toggle All-Groups sidebar
    allGroupsClickHandler = () => {
        this.setState({
            showAllGroups:!this.state.showAllGroups
        })
    }

    //Click Handler To Change Room
    roomClickHandler = (userName, roomName) => {
        if(this.props.match.params.room!=roomName || this.props.match.params.username != userName )
            this.props.history.replace("/chatroom/" + userName + "/" + roomName)
        else
            alert("You are alredy in this room.")
    }

    //Click Handler To Change Room
    privateChatClickHandler = (senderID) => {
        this.props.history.push("/private/"+senderID+"/"+this.socket.id)
    }

    //Component Did Update
    componentDidUpdate() {

        // If User Change Room

        if (this.props.match.params.room != this.state.room || this.props.match.params.username != this.state.username) {
            // this.socket.disconnect()
            // this.socket = io("http://localhost:3000/")
            let roomsInfo = {
                old: this.state.room,
                new: this.props.match.params.room,
                username: this.state.username
            }
            let username = this.props.match.params.username
            let room = this.props.match.params.room
            this.setState({
                username: username,
                room:room,
                 messages: [],
                 newUser: {
                     username: "",
                 },
                 users: [],
                 text: "",
                 showOnlineUsers: false,
                 showAllGroups: false,
             })
            
            this.socket.emit("changeRoom", roomsInfo)

        }
    }

    // Did Mount 
    componentDidMount() {
        // let params = new URLSearchParams(this.props.location.search)
        this.initSocket()
    }

    render() {
        // console.log(this.state)
        // Messages Mapped In Html 
        let messagesTemplate = this.state.messages.map((message) => {
            return (
                <div key={message.name+(Math.random()*10)} className={message.type=="newUser"?"message-center":((message.type=="right")?"message-right":"message-left")}>
                    <div className="body">
                        {message.type == "newUser" ? null : (
                            <h6>
                                {message.name}
                            </h6>
                        )}
                        <p>
                            {message.message}
                        </p>
                    </div>
                </div>
            )
        })

        // All users htmlmapping
        
        let userList = this.state.users.map((user) => {
            let letters = user.username.split(" ")
            letters=letters[0][0]+((letters.length-1)!=0?letters[letters.length-1][0]:"")
            return (
                <div
                    className="user-list"
                    key={user.username + (Math.random() * 10)}
                    onClick={()=>this.privateChatClickHandler(user.id)}
                >
                    <div>
                        <span className="rounded-circle avatar bg-primary">
                            {letters}
                        </span> 
                    </div>
                    <div className="pl-3">
                        <h5 className="m-0">
                            @{user.username}
                        </h5>
                        <small>
                            UserID: {user.id}
                        </small>
                    </div>
                </div>
            )
        })

        // All rooms htmlmapping
        
        let roomList = this.state.rooms.map((room) => {
            let letters = room.name.split(" ")
            letters=letters[0][0]+((letters.length-1)!=0?letters[letters.length-1][0]:"")
            return (
                <div className="room-list" key={room.name+(Math.random()*10)}>
                    <div>
                        <span className="rounded-circle avatar bg-primary">
                            {letters}
                        </span> 
                    </div>
                    <div className="pl-3" onClick={() => { this.roomClickHandler(this.state.username,room.name) }}>
                        <h5 className="m-0 text-capitalize">
                            @{room.name}
                        </h5>
                        <small>
                            <a href="#"> click to join the room. </a>
                        </small>
                    </div>
                </div>
            )
        })

        return (
            <div className="chatroom-main">
                <div className="overlay-white"></div>
                <div className="online-users"
                    style={{ left: this.state.showOnlineUsers?"0%":"-100%" }}
                >
                    <div className="online-users-header bg-primary">
                        <div className="back">
                            <FaArrowLeft
                                color="white"
                                size={20}
                                cursor="pointer"
                                onClick={this.onlineUserTextClickHandler}
                            />
                        </div>
                        <h3 className="text-center">
                            All Users
                        </h3>
                    </div>
                    {userList}
                </div>
                <div className="all-groups"
                    style={{ right: this.state.showAllGroups?"0%":"-100%" }}
                >
                    <div className="all-groups-header bg-primary">
                        <div className="back">
                            <FaArrowRight
                                color="white"
                                size={20}
                                cursor="pointer"
                                onClick={this.allGroupsClickHandler}
                            />
                        </div>
                        <h3 className="text-center">
                            All Rooms
                        </h3>
                    </div>
                    {roomList}
                </div>
                <div className="container position-relative pt-5">
                    <h1 className="display-4 text-center text-capitalize">
                        Welcome To {this.state.room||""} ChatRoom
                    </h1>
                    <div className="chatroom-sub">
                        <h5 className="text-white bg-primary p-2 rounded"
                            onClick={this.onlineUserTextClickHandler}
                        >
                            View All Users
                        </h5>
                        <h5 className="text-white bg-primary p-2 rounded"
                            onClick={this.allGroupsClickHandler}
                        >
                            View All Rooms
                        </h5>
                    </div>
                    <div className="chat-box" id="chat-box">
                        {messagesTemplate}
                    </div>
                    <div className="form-group mt-2 msg-box">
                        <div className="input-group" >
                            <textarea
                                className="form-control"
                                placeholder="Hi! John. How are you?"
                                onChange={this.messageTextChangeHandler}
                                value={this.state.text}
                                onKeyPress={this.sendButtonKeyPressHandler}
                            ></textarea>
                            <div className="input-group-append">
                                <button
                                    type="button"
                                    onClick={this.sendButtonClickHandler}
                                    className="input-group-text btn btn-primary bg-primary"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChatRoom