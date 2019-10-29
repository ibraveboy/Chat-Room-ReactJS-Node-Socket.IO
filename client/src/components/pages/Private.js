import React, { Component } from 'react'

export default class Private extends Component {

    
    render() {
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
