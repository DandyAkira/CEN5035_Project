export const FILE = "file"
export const TEXT = "text"
export const AUDIO = "audio"

export const Success = 200
export const Error = -1

export function Msg(type, username, avatar, msgType, data) {
    return {
        type: type,
        username: username,
        avatar: avatar,
        date: new Date(),
        content: {
            type: msgType,
            data: data
        }
    }
}


export const ATTEMPT = "attempt"
export const CONNECT = "connect"

// 同意或者不同意
export const AGREE = "agree"
export const REJECT = "reject"
export const NOTSUPPORT = "not support"
// 没有找到该用户，存在此种极端情况
export const NOTFOUND = "not found"
// 忙碌中
export const BUSY = "busy"

export function VideoMsg(type, from, to, data) {
    return {
        // 请求建立连接，或者是请求之后开始建立连接
        // attempt, connect
        type: type,
        // 从哪里发出
        from: from,
        // 送到哪里
        to: to,
        // 携带的信息
        data: data
    }
}