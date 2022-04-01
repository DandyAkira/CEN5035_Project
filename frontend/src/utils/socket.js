import {io} from "socket.io-client";
import {ERROR} from "./socket-types";
import {message} from "antd";

let url;

console.log(process.env)

if (process.env.REACT_APP_HTTPS) {
    url = process.env.REACT_APP_SOCKET_HTTPS_URL
} else if (process.env.REACT_APP_SOCKET_HTTP_URL) {
    url = process.env.REACT_APP_SOCKET_HTTP_URL
}

if (!url) {
    url = "http://localhost:3001"
}

console.log("socket io use url: ", url)

const socket = io(url, {
    transports: ["websocket"]
})


socket.on(ERROR, (msg) => {
    message.error(msg, 2)
})

export default socket