const initialState = {
    socket: null,
    id:"",
    username: "",
    room: "",
    rooms: [],
    users: [],
    messages: [],
    errors: false,
    private: {
        username: "",
        socket_id: "",
    },
    pMessages:[]
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
                room: action.payload.room,
                errors:false,
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
                room: action.payload,
                users: [],
                messages:[]
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
        case "SET_ERRORS":
            return {
                ...state,
                errors:action.payload
            }
        break;
        case "SET_PRIVATE_USER":
            return {
                ...state,
                room:"",
                private: {
                    username: action.payload.username,
                    socket_id: action.payload.id
                },
                pMessages: [],
                messages:[]
            }
        break;
        case "PUSH_PRIVATE_MESSAGE":
            return {
                ...state,
                pMessages:[...state.pMessages,action.payload]
            }
        break;
        case "SET_PRIVATE_MESSAGES":
            return {
                ...state,
                pMessages:[...action.payload]
            }
        break;
    }
    return state
}