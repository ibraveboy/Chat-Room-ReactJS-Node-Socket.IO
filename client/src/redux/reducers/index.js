const initialState = {
    socket: null,
    id:"",
    username: "",
    room: "",
    rooms: [],
    users: [],
    messages:[]
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_SOCKET":
            return {
                ...state,
                socket:action.payload
            }
        break;
        case "SET_USER":
            return {
                ...state,
                username: action.payload.username,
                room: action.payload.room
            }
        break;
        case "PUSH_BOTH_MESSAGE_AND_USER":
            return {
                ...state,
                messages: [...state.messages, action.payload.messageObj],
                users: [...state.users, action.payload.user]
            }
        break;
        case "PUSH_MESSAGE":
            return {
                ...state,
                messages: [...state.messages, action.payload]
            }
        break;
        case "SET_ROOM":
            return {
                ...state,
                room:action.payload
            }
        break;
        case "SET_USERS":
            return {
                ...state,
                users:[...action.payload]
            }
        break;
        case "SET_ROOMS":
            return {
                ...state,
                rooms:[...action.payload]
            }
        break;
        case "SET_DEFAULT":
            return {
                ...state,
                username: action.payload.username,
                room: action.payload.room,
                messages: [],
                users: [],
            }
        break;
    }
    return state
}