import {message} from "antd";

export function checkSupport() {
    if (!navigator.mediaDevices) {
        message.info("Don't support this function on the environment")
        return false
    }
    return true
}

export function formatString(len, value) {
    if (!value || value.length <= len) {
        return value
    }
    if (value.length > len) {
        return value.slice(0, len) + "…"
    }
}

export const GroupPrefix = "Group"

export function isGroup(value) {
    return value.indexOf(GroupPrefix) >= 0;
}

export function copyMap(map) {
    let temp = new Map()
    for (let key of map.keys()) {
        temp.set(key, [...map.get(key)])
    }
    return temp
}