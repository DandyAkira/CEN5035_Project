import React, {createRef} from 'react';
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {PropTypes} from "prop-types";
import "./ChatRoom.css";
import logo from "../images/logo.png";
import MemberList from "./components/MemberList";
import {Col, message, Row, Tooltip} from "antd";
import {LogoutOutlined} from "@ant-design/icons";
import MessageContainer from "./components/MessageContainer";
import MessageEditor from "./components/MessageEditor";
import socket from "../utils/socket";
import {JOIN, LEAVE, MSG, ONLINE_USERS} from "../utils/socket-types";
import {copyMap, formatString, GroupPrefix} from "../utils/tools";
import {reset, setCurrent} from "../redux/action/actions";


class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memberList: [],
            messageMap: new Map(),
            filter: "",
        }
        this.input = createRef()
        this.handleKeyEnter = this.handleKeyEnter.bind(this)
        this.handleSendMsg = this.handleSendMsg.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.handleSetUnread = this.handleSetUnread.bind(this)
    }

    componentDidMount() {
        document.title = "Chat room"
        const {login} = this.props

        if (!login) {
            message.info("Please login")
            this.props.history.push("/login")
            return
        }
        const {chatRoom} = this.props
        this.setState({
            memberList: [{username: "Group" + chatRoom, avatar: logo, unread: 0}],
        }, () => {
            console.log("in chat room: ", this.state, this.props)
        })

        socket.on(MSG, res => {
            const {chatRoom, current} = this.props

            console.log("Receiving the message: ", res)
            let map = copyMap(this.state.messageMap)
            let username;

            const {isGroup, msg} = res.data
            if (isGroup) {
                username = GroupPrefix + chatRoom
                console.log("isGroup username: ", username)
            } else {
                username = msg.username
                console.log("not group, username: ", username)
            }

            const userMsg = map.get(username)

            if (typeof userMsg === "undefined") {
                map.set(username, [msg])
            } else {
                userMsg.push(msg)
            }
            let tempList = [...this.state.memberList]
            console.log("username: ", username, " current: ", current)
            tempList.forEach(value => {
                if (value.username === username && current !== username) {
                    value.unread += 1
                }
            })
            console.log("Before receiving the message: this.state", this.state)
            this.setState({
                messageMap: map,
                memberList: tempList
            }, () => {
                console.log("After receiving the message: ", this.state)
            })
        })

        socket.on(JOIN, res => {
            console.log("JOIN res: ", res)
            let temp = [...this.state.memberList]
            temp.push(res)
            this.setState({
                memberList: temp
            }, () => {
                console.log("after join: ", this.state.memberList)
            })
        })

        socket.on(LEAVE, res => {
            console.log("LEAVE: ", res)
            const {memberList, messageMap} = this.state

            let temp = [...memberList].filter(value => {
                return value.username !== res.data;
            })

            let tempMessageMap = messageMap
            tempMessageMap.delete(res.data)

            this.setState({
                memberList: temp,
                messageMap: tempMessageMap
            })
        })

        socket.on(ONLINE_USERS, res => {
            const {chatRoom, username} = this.props

            console.log("ONLINE_USERS", res)
            let temp = []
            temp.push({username: GroupPrefix + chatRoom, avatar: logo, unread: 0})
            for (let user of res.data) {
                if (user.username !== username) {
                    temp.push({username: user.username, avatar: user.avatar, unread: 0})
                }
            }
            this.setState({
                memberList: temp,
            })
            console.log(this.state)
        })
    }

    handleKeyEnter(e) {
        this.setState({
            filter: this.input.current.value
        })
        const {setCurrent} = this.props
        setCurrent("")
    }

    handleSendMsg(msg) {
        const {current} = this.props
        let tempMessageMap = copyMap(this.state.messageMap)
        if (tempMessageMap.get(current)) {
            tempMessageMap.get(current).push(msg)
        } else {
            tempMessageMap.set(current, [msg])
        }
        console.log("after send msg: ", tempMessageMap)

        this.setState({
            messageMap: tempMessageMap
        })
    }

    handleSetUnread(username) {
        let tempList = [...this.state.memberList]
        console.log(tempList)
        for (let el of tempList) {
            console.log(el.username)
            if (el.username === username) {
                el.unread = 0
            }
        }

        this.setState({
            memberList: tempList
        }, () => {
            console.log(this.state.memberList)
        })

        this.editor.clearMsg()
    }

    handleLogout() {
        const {reset, username} = this.props
        reset()
        socket.emit(LEAVE, {username: username})
        this.props.history.push("/login")
    }


    render() {
        console.log(new Date(), "ChatRoom render...")
        const {current, username, avatar} = this.props
        const {messageMap, memberList} = this.state

        return <>
            <Row className={"chat-room"}>
                <Col span={2}>
                    <div className={"chat-room-sidebar"}>
                        <Tooltip title={username}>
                            <img src={avatar} className={"chat-room-avatar"} alt=""/>
                        </Tooltip>
                        <div className={"chat-room-username"} title={username}>
                            {formatString(4, username)}
                        </div>
                        <div className={"chat-room-logout"} title={"Logout"}>
                            <LogoutOutlined onClick={this.handleLogout}/>
                        </div>
                    </div>
                </Col>
                <Col span={5}>
                    <div className="chat-room-container">
                        <div className="chat-room-group">
                            <div className={"chat-room-search"}>
                                <input ref={this.input} type="text" placeholder={"Search"} className={"chat-room-input"}
                                       onChange={this.handleKeyEnter}/>
                            </div>
                            <MemberList setUnread={this.handleSetUnread} memberList={memberList}
                                        filter={this.state.filter}
                            />
                        </div>
                    </div>
                </Col>
                <Col span={17}>
                    <div style={{height: "70%"}}>
                        <MessageContainer message={messageMap.get(current) ? messageMap.get(current) : []}/>
                    </div>
                    <div style={{height: "30%"}}>
                        <MessageEditor ref={ref => {
                            this.editor = ref
                        }} handleMsg={this.handleSendMsg}
                        />
                    </div>
                </Col>
            </Row>
        </>
    }
}

ChatRoom.propTypes = {
    history: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
    return {
        username: state.username,
        chatRoom: state.chatRoom,
        current: state.current,
        avatar: state.avatar,
        login: state.login
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setCurrent: (current) => dispatch(setCurrent(current)),
        reset: () => dispatch(reset()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChatRoom))