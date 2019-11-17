import React, { Component } from 'react'
import { connect } from "react-redux"
import { animateScroll } from "react-scroll"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { setRoom,setPrivateUser,setPrivateMessages,pushPrivateMessage } from "../../redux/actions/index"
import {Link} from "react-router-dom"
import Axios from 'axios'

class Private extends Component {
    state = {
        text: "",
        showOnlineUsers: false,
        showAllGroups: false,
        isSocketInit:false
    }
    
    initSocket = () => {

        this.props.socket.on("recieveUserData", (user) => {
            this.props.setPrivateUser(user)  
        })

        //Recieve Private Message
        this.props.socket.on("recievedPrivateMessage", (chat) => {
            console.log("chat",chat)
            let message=chat.messages[0]
            this.props.pushPrivateMessage(message)
        })
        this.setState({
            isSocketInit:true
        })
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
        
        if (this.props.room != roomName) {
            let roomsInfo = {
                old: this.props.room,
                new: roomName,
                username: this.props.username
            }
            this.props.setRoom(roomName)
            this.setState({
                    text: "",
                    showOnlineUsers: false,
                    showAllGroups: false,
            })
            this.props.socket.emit("changeRoom", roomsInfo)
        }
        else
            alert("You are alredy in this room.")
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
            senderUsername: this.props.username,
            text: this.state.text,
            recieverUsername:this.props.private.username
        }
        this.props.socket.emit("sendPrivateMessage", messageObj)
        this.setState({
            text:""
        },this.scrollToBottom)
    }


    //Press Enter To Send Message
    sendButtonKeyPressHandler = (e) => {
        if (e.key == "Enter"&&!e.shiftKey) {
            e.preventDefault()
            this.sendButtonClickHandler()
        }
    }

    // Scroll To Bottom
    scrollToBottom = () => {
        animateScroll.scrollToBottom({
            containerId:"chat-box"
        })
    }

    componentDidMount() {
        if (!this.state.isSocketInit) {
            this.initSocket()
        }
        if (!this.props.private.username) {
            const privateUser = this.props.match.params.rID
            this.props.socket.emit("sendUserData", {username:privateUser})
        }
        this.props.setPrivateMessages(this.props.private.username)
        
    }

    render() {
        
        console.log(this.props)
        // Messages Mapped In Html 
        let messagesTemplate = this.props.messages.map((message) => {
            console.log(message)
            return (
                <div key={message.senderUsername+(Math.random()*10)} className={((message.senderUsername==this.props.username)?"message-left":"message-right")}>
                    <div className="body">
                        
                        <h6>
                            {message.senderUsername}
                        </h6>
                        <p>
                            {message.text}
                        </p>
                    </div>
                </div>
            )
        })

        // All rooms htmlmapping
        
        let roomList = this.props.rooms.map((room) => {
            let letters = room.name.split(" ")
            letters=letters[0][0]+((letters.length-1)!=0?letters[letters.length-1][0]:"")
            return (
                <div
                    className="room-list"
                    key={room.name + (Math.random() * 10)}
                    onClick={() => { this.roomClickHandler(this.props.username,room.name) }}
                >
                    <div>
                        <span className="rounded-circle avatar bg-primary">
                            {letters}
                        </span> 
                    </div>
                    <div className="pl-3">
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
                    {/* {userList} */}
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

const mapStateToProps = (state) => {
    return {
        username: state.username,
        id: state.id,
        socket:state.socket,
        private: state.private,
        messages: state.pMessages,
        rooms:state.rooms
    }
}

export default connect(mapStateToProps, {setRoom,setPrivateUser,setPrivateMessages,pushPrivateMessage})(Private);