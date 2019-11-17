import React, { Component } from "react";
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { loginUser,setErrors } from "../../redux/actions/index"

class Login extends Component {
    state = {
        username: "",
        password:"",
        loader:false
    }
    inputChangeHandler = (e) => {
        if (e.target.name == "room") { 
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
        if ((this.state.username == "" || this.state.username == null)) {
            alert("Fill all fields.")
            return false
        } else {
            // this.props.history.push("/chatroom/"+this.state.username+"/"+this.state.room)
            this.setState({
                loader:true,
            })
            this.props.loginUser(this.state)
        }
    }

    componentDidUpdate() {
        console.log(this.props)
        if (!this.props.username && this.props.errors) {
            this.setState({
                loader:false
            })
            this.props.setErrors(false)
        }else if (this.props.username) {
            this.props.history.push("/room")
        }     
    }

    render() {
        
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
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password.."
                            className="form-control"
                            value={this.state.password}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    {/* <div className="input-group mb-3">
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
                    </div> */}
                    <div className="form-group">
                        <button
                            type="button"
                            className="btn btn-primary form-control"
                            onClick={this.chatroomButtonClickHandler}
                        >
                            {(this.state.loader ? (
                            <div className="spinner-border spinner-border-sm text-light" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            ):null)}
                            Enter Chatroom 
                        </button>
                    </div>
                    <div className="form-group">
                        <Link
                            type="button"
                            className="btn btn-primary form-control"
                            to="/register"
                        >
                            Register
                        </Link>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.username,
        errors:state.errors
    }
}

export default connect(mapStateToProps,{loginUser,setErrors})(Login);
