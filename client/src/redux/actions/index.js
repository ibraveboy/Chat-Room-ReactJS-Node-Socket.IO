import Axios from "axios"
import jwtHandler from "../../utils/jwthandler"

//Login User
export const loginUser = (user) => (dispatch)=> {
    Axios.post("http://localhost:3000/login",user)
        .then(res => {
            jwtHandler(res.data)
            console.log(res.data)
            dispatch(getUser())
        })
        .catch(err => {
            alert(err)
            dispatch({
                type: "SET_ERRORS",
                payload:true
            })
        })
}

//Register User
export const registerUser = (user) => (dispatch)=> {
    Axios.post("http://localhost:3000/register",user)
        .then(res => {
            jwtHandler(res.data)
            dispatch(getUser())
        })
        .catch(err => {
            alert(err)
            dispatch({
                type: "SET_ERRORS",
                payload:true
            })
        })
}

//Set Socket 
export const setSocket = (socket) => {
    return {
        type: "SET_SOCKET",
        payload: socket
    }
}

// Initialize Get Current User Info 
export const getUser = () => (dispatch)=>{
    Axios.get("http://localhost:3000/me")
        .then((user) => {
            console.log(user)
            dispatch(setUser(user.data))
        })
        .catch(er => {
            console.log(er)
            dispatch({
                type: "SET_ERRORS",
                payload:true
            })
        })
}

// Initialize Current User Info
export const setUser = (user) => {
    return {
        type: "SET_USER",
        payload: user
    }
}

// Push New Message And New User 
export const pushMessageAndUser = (payload) => {
    return {
        type: "PUSH_BOTH_MESSAGE_AND_USER",
        payload
    }
}

// Push New Message
export const pushMessage = (payload) => {
    return {
        type: "PUSH_MESSAGE",
        payload
    }
}

// Set Current User Room
export const setRoom = (room) => {
    return (dispatch) => {
        Axios.post("http://localhost:3000/update", {room})
            .then(res => {
                dispatch ({
                    type: "SET_ROOM",
                    payload: room
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
}

//Set All Users
export const setUsers = (users) => {
    return {
        type: "SET_USERS",
        payload:users,
    }
}

//Set All Rooms
export const setRooms = (rooms) => {
    return {
        type: "SET_ROOMS",
        payload: rooms,
    }
}

//Set Default 
export const setDefault = (user) => {
    return {
        type: "SET_DEFAULT",
        payload: user
    }
}

// Set Errors True/False
export const setErrors = (bool) => {
    return {
        type: "SET_ERRORS",
        payload:bool,
    }
}

// Set Private User Data
export const setPrivateUser = (user) => {
    return {
        type: "SET_PRIVATE_USER",
        payload:user
    }
}

// Push Private Message 
export const pushPrivateMessage = (msg) => {
    return {
        type: "PUSH_PRIVATE_MESSAGE",
        payload:msg
    }
}

// Get Private Messages 
export const setPrivateMessages = (rUsername) => (dispatch)=> {
    Axios.get("http://localhost:3000/privateMessages/" + rUsername)
        .then(res => {
                console.log(res.data)
                dispatch({
                    type: "SET_PRIVATE_MESSAGES",
                    payload:(res.data[0].messages)?res.data[0].messages:[]
            })
        })
}