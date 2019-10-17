import React, { Component } from "react";

class Login extends Component {
    state = {
        username: "",
        room:"Choose..."
    }
    inputChangeHandler = (e) => {
        if (e.target.name != "username") { 
            let select = e.target
            this.setState({
                room:select.options[select.selectedIndex].value
            })
            return true;
        }
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    chatroomButtonClickHandler = () => {
        if ((this.state.room == "" || this.state.room == null || this.state.room=="Choose...") || (this.state.username == "" || this.state.username == null)) {
            alert("Fill all fields.")
            return false
        } else {
            this.props.history.push("/chatroom?username="+this.state.username+"&&room="+this.state.room)
        }
    }

    render() {
        console.log(this.state)
        return (
            <div className="login-main d-flex align-items-center justify-content-center">
                <form className="login-form">
                    <div className="overlay-white"></div>
                    <div className="form-group">
                        <h1 className="display-4">
                            Login Form
                        </h1>
                        <p className="mb-5 text-center">
                            Fill all fields to enter the room.
                        </p>
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder="ibraveboy etc.."
                            value={this.state.username}
                            onChange={this.inputChangeHandler}
                        />
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
                            Enter Chatroom
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;
