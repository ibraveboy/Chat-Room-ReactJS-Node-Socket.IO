import Axios from "axios"
import jwtHandler from "../../utils/jwthandler"
//Register User
export const registerUser = (user) => (dispatch)=> {
    Axios.post("http://localhost:3000/register",user)
        .then(res => {
            jwtHandler(res.data)
            dispatch(() => { getUser() })
        })
        .catch(err => {
            alert(err)
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
    Axios.get("/me")
        .then((user)=>{
            dispatch(() => { setUser(user) })
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
    return {
        type: "SET_ROOM",
        payload: room
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
