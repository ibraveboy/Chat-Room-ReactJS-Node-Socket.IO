import Axios from "axios"

const jwthandler = (AUTH_TOKEN) => {
    Axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    let AUTH_TOKEN_OLD = localStorage.getItem("authorization")
    if (AUTH_TOKEN_OLD != AUTH_TOKEN || !AUTH_TOKEN_OLD)
        localStorage.setItem("authorization",AUTH_TOKEN)
}

export default jwthandler;