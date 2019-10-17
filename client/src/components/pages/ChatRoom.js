import React, { Component } from 'react'
import io from "socket.io-client"
import { animateScroll } from "react-scroll"

class ChatRoom extends Component {
    state = {
        username: "ibraveboy",
        room: "react",
        messages: [],
        newUser: {
            username: "",
        },
        text:""
    }
    socket = io("http://localhost:3000/")
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
    componentDidMount() {
        let params = new URLSearchParams(this.props.location.search)
        this.socket.emit("user", { username: params.get("username"), room: params.get("room") })
        this.setState({
            username: params.get("username"),
            room:params.get("room")
        })
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
                    messages:[...this.state.messages,messageObj]
                }
            )
        })

        // User Left 
        this.socket.on("userLeft", (user) => {
            let message = `${user.username} has left this room`;
            let messageObj = {
                message,
                type: "newUser",
                name:user.username
            }
            this.setState(
                {
                    messages:[...this.state.messages,messageObj]
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

    render() {
        
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
        return (
            <div className="chatroom-main">
                <div className="overlay-white"></div>
                <div className="container position-relative pt-5">
                    <h1 className="display-4 text-center text-capitalize">
                        Welcome To {this.state.room} ChatRoom
                    </h1>
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