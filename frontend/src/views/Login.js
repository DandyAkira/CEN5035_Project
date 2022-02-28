import React, {createRef} from "react"
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {PropTypes} from "prop-types";
import {Button, Form, Image, Input, message, Radio, Tabs} from "antd"
import {LockOutlined, UserOutlined} from '@ant-design/icons'
//import {CommentOutlined, LockOutlined, UserOutlined} from '@ant-design/icons'
import "./Login.css";
import socket from "../utils/socket"
import {LOGIN, REGISTER} from "../utils/socket-types"
import {avatar} from "../mock/avatar";
import {Error, Success} from "../utils/request";
import {setAvatar, setChatRoom, setLogin, setUsername} from "../redux/action/actions";

// const {ipcRenderer} = window.require('electron')

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            chatRoom: "",
            loading: false,
            activeKey: "1",
        }

        this.loginForm = createRef();
        this.registerForm = createRef();

        this.handleLogin = this.handleLogin.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleTabClick = this.handleTabClick.bind(this)
    }

    componentDidMount() {
        console.log(this.props)
        const {history} = this.props
        document.title = "Login"

        socket.on(LOGIN, res => {
            console.log("res: ", res)
            if (res.code === Success) {
                message.success(res.msg, 1)
                sessionStorage.setItem("login", "true")
                console.log(this.props)
                const {setUsername, setChatRoom, setAvatar, setLogin} = this.props
                setUsername(this.state.username)
                // setChatRoom(this.state.chatRoom)
                setAvatar(res.data.avatar)
                setLogin(true)
                history.push("/chatroom")
                // ipcRenderer.send("chat-page")
            } else {
                message.error(res.msg, 1)
                this.setState({
                    loading: false
                })
            }

        })

        socket.on(REGISTER, res => {
            if (res.code === Error) {
                message.error(res.msg, 1)
            } else {
                message.success(res.msg, 1)
                this.setState({
                    activeKey: "1"
                })
            }
        })
    }

    handleLogin(value) {
        this.setState(value, () => {
            const {username, password, chatRoom} = value
            console.log(value)
            this.setState({
                loading: true,
                username: username,
                chatRoom: chatRoom,
            }, () => {
                console.log("this.state: ", this.state)
            })
            socket.emit(LOGIN, {username, password, chatRoom})
        })
    }

    handleRegister(value) {
        socket.emit(REGISTER, value)
    }

    handleTabClick(key) {
        this.setState({
            activeKey: key,
            loading: false,
        })
        if (key === "1") {
            this.registerForm.current.resetFields()
        } else {
            this.loginForm.current.resetFields()
        }
    }

    handleOnChange(activeKey) {
        if (activeKey === 1 && activeKey !== this.state.activeKey) {
            this.registerForm.current.resetFields()
        } else {
            this.loginForm.current.resetFields()
        }
    }

    render() {
        return <>
            <div className={"chat-room-login-container"}>
                <Tabs type="card" activeKey={this.state.activeKey} onTabClick={this.handleTabClick} animated centered>
                    <Tabs.TabPane tab="Login" key={"1"}>
                        <Form name="login" onFinish={this.handleLogin} ref={this.loginForm}>
                            <Form.Item name="username" rules={[{required: true, message: 'Please type in user name'}]}>
                                <Input prefix={<UserOutlined className={"chat-room-login-icon"}/>} placeholder="user name"/>
                            </Form.Item>
                            <Form.Item name="password" rules={[{required: true, message: 'Please type in your password!'}]}>
                                <Input
                                    prefix={<LockOutlined className={"chat-room-login-icon"}/>}
                                    type="password"
                                    placeholder="password"
                                />
                            </Form.Item>
                            {/* <Form.Item name="chatRoom" rules={[{required: true, message: 'Please type in the room number'}]}>
                                <Input
                                    prefix={<CommentOutlined className={"chat-room-login-icon"}/>}
                                    placeholder="Room number"
                                />
                            </Form.Item> */}
                            <Form.Item>
                                <Button htmlType="submit" loading={this.state.loading} type="primary" block>
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Register" key={"2"}>
                        <Form name="register" onFinish={this.handleRegister} ref={this.registerForm}
                              initialValues={{avatar: avatar[0]}}>
                            <Form.Item name="username" rules={[{required: true, message: 'Please type in user name!'}]}>
                                <Input prefix={<UserOutlined className={"chat-room-login-icon"}/>} placeholder="user name"/>
                            </Form.Item>
                            <Form.Item name="password" rules={[{required: true, message: 'Please type in your password!'}]}>
                                <Input
                                    prefix={<LockOutlined className={"chat-room-login-icon"}/>}
                                    type="password"
                                    placeholder="password"
                                />
                            </Form.Item>
                            <Form.Item name="avatar" label={"Profile"} rules={[{message: 'Please select a profile'}]}>
                                <Radio.Group>
                                    {avatar.map((src, index) => <Radio value={src} key={index}><Image width={43}
                                                                                                      preview={false}
                                                                                                      src={src}/></Radio>)}
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" loading={this.state.loading} type="primary" block>
                                    Register
                                </Button>
                            </Form.Item>
                        </Form>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </>
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setUsername: (username) => dispatch(setUsername(username)),
        // setChatRoom: (room) => dispatch(setChatRoom(room)),
        setAvatar: (avatar) => dispatch(setAvatar(avatar)),
        setLogin: (flag) => dispatch(setLogin(flag)),
    }
}

Login.propTypes = {
    history: PropTypes.object.isRequired
}

export default connect(null, mapDispatchToProps)(withRouter(Login))
