import React, { Component } from 'react'
import { connect } from "react-redux"
import { setRoom } from "../../redux/actions"

class SelectRoom extends Component {
    state = {
        room: "Choose...",
        loader:false
    }
    inputChangeHandler = (e) => {
        let select = e.target
        this.setState({
            room:select.options[select.selectedIndex].value
        })
    }
    chatroomButtonClickHandler = () => {
        if ((this.state.room == "" || this.state.room == null || this.state.room=="Choose...")) {
            alert("Select A Room First.")
            return false
        } else {
            // this.props.history.push("/chatroom/"+this.state.username+"/"+this.state.room)
            this.setState({
                loader:true,
            })
            this.props.setRoom(this.state.room)
        }
    }
    componentDidUpdate() {
        if (!this.props.room && this.props.errors) {
            this.setState({
                loader:false
            })
        }else if(this.props.room) {
            this.props.history.push("/chatroom")
        }     
    }
    componentDidMount() {
        if (this.props.room && this.props.username) {
            this.props.setRoom("")
        }
    }
    render() {
        
        return (
            <div className="login-main d-flex align-items-center justify-content-center">
                <div className="login-form">
                    <div className="overlay-white"></div>
                    <div className="form-group">
                        <h1 className="display-4 mb-5">
                            Select A Room To Join
                        </h1>
                    </div>
                    <div className="input-group mb-3">
                        <select
                            className="custom-select"
                            name="room"
                            value={this.state.room}
                            onChange={this.inputChangeHandler}
                        >
                            <option>Choose...</option>
                            <option value="react">React</option>
                            <option value="node">Node</option>
                            <option value="javascript">Javascript</option>
                        </select>
                        <div className="input-group-append">
                            <label
                                className="input-group-text"
                            >
                                Chatrooms
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <button
                            type="button"
                            className="btn btn-primary form-control"
                            onClick={this.chatroomButtonClickHandler}
                        >
                            {(this.state.loader ? (
                            <div class="spinner-border spinner-border-sm text-light" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            ):null)}
                            Join Chatroom 
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.username,
        room: state.room,
        errors:state.errors
    }
}

export default connect(mapStateToProps,{setRoom})(SelectRoom)