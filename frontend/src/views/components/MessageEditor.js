import React, {createRef} from 'react';
import {PropTypes} from 'prop-types';
import {connect} from "react-redux";
import {Button, Col, message, Modal, Popover, Row, Space, Tooltip, Upload} from 'antd';
import {AudioOutlined, FolderOutlined, SmileOutlined, VideoCameraOutlined} from '@ant-design/icons';

import "./MessageEditor.css";
import Emoji from "./Emoji";
import FilePreviewIcon from "./FilePreviewIcon";
import socket from "../../utils/socket";
import {MSG} from "../../utils/socket-types";
import {AUDIO, FILE, Msg, TEXT} from "../../utils/request";
import Video from "./Video";
import {checkSupport, isGroup} from "../../utils/tools";

let recorderData = []

let mediaRecorder;

class MessageEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "text",
            text: "",
            file: null,
            audio: null,
            startBtn: false,
            sendBtn: true,
            hidden: true,
            visible: false,
            videoVisible: false,
            time: 0,
            isConnected: false,
        }
        this.video = createRef()
        this.text = createRef()
        this.audioIcon = createRef()

        this.handleSendMsg = this.handleSendMsg.bind(this)
        this.handleEmojiClick = this.handleEmojiClick.bind(this)
        this.handleSendFile = this.handleSendFile.bind(this)
        this.handleVoiceClick = this.handleVoiceClick.bind(this)
        this.handleVideoClick = this.handleVideoClick.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)

        this.deleteFile = this.deleteFile.bind(this)

        this.handleOk = this.handleOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleClose = this.handleClose.bind(this)

        this.handleVideoClose = this.handleVideoClose.bind(this)
        this.handleVideoUIShow = this.handleVideoUIShow.bind(this);
        this.clearMsg = this.clearMsg.bind(this);
    }

    // clear message
    clearMsg() {
        this.text.current.value = ""
    }

    handleSendMsg() {
        const {current, username, avatar, handleMsg} = this.props
        const {type} = this.state
        if (!current) {
            message.info("Please pick the people you would like send to")
            return
        }
        if (type !== "text") {
            if (type === "file") {
                this.handleSendFile()
            }
            return
        }
        if (this.text.current.value.trim() === "") {
            message.info("The message can't be null")
            this.clearMsg()
            return
        }

        handleMsg(Msg("send", username, avatar, TEXT, this.text.current.value))

        if (this.state.type === "text") {
            let msg_ = Msg("receive", username, avatar, TEXT, this.text.current.value)
            if (isGroup(current)) {
                socket.emit(MSG, {isGroup: true, data: {user: current, msg: msg_}})
            } else {
                socket.emit(MSG, {isGroup: false, data: {user: current, msg: msg_}})
            }
        }

        this.clearMsg()
    }

    handleEmojiClick(emoji) {
        const cursorStart = this.text.current.selectionStart;
        this.text.current.value = this.text.current.value.slice(0, cursorStart) + emoji + this.text.current.value.slice(cursorStart)
    }


    handleSendFile() {
        const {username, avatar, current, handleMsg} = this.props
        const {file} = this.state

        if (file.size > 1024 * 1024 * 50) {
            message.error("The size of file can't over 50M")
            return
        }

        const formatFilesize = (filesize) => {
            console.log("filesize: ", filesize)
            if (filesize < 1024) {
                return +"B"
            } else if (filesize < 1024 * 1024) {
                return Number(filesize / 1024).toFixed(1) + "KB"
            } else if (filesize < 1024 * 1024 * 50) {
                return Number(filesize / 1024 / 1024).toFixed(1) + "MB"
            } else {
                return "NaN"
            }
        }

        handleMsg(Msg("send", username, avatar, FILE, {
            filesize: formatFilesize(file.size),
            filename: file.name,
            type: /image.*?/.test(file.name) ? "image" : "file",
            file: file
        }))

        socket.emit(MSG, {
            isGroup: isGroup(current), data: {
                user: current, msg: Msg("receive", username, avatar, FILE, {
                    filesize: formatFilesize(file.size),
                    filename: file.name,
                    type: /image.*?/.test(file.name) ? "image" : "file",
                    file: file
                })
            }
        })
        this.deleteFile()
    }

    // voice
    handleVoiceClick() {
        if (!checkSupport()) {
            return
        }
        const {current} = this.props
        if (!current) {
            message.info("Please pick the people you would like send to")
            return
        }
        this.setState({
            visible: true,
        })
    }

    handleOk() {
        message.info("Start recording", 1)
        this.setState({
            startBtn: true,
            sendBtn: false,
        })
        const {username, avatar, current, handleMsg} = this.props

        navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
            console.log(stream)
            mediaRecorder = new MediaRecorder(stream)
            mediaRecorder.start();
            this.audioIcon.current.className = "active"
            this.setState({
                time: Date.now()
            })

            mediaRecorder.ondataavailable = (evt) => {
                recorderData.push(evt.data)
            }

            mediaRecorder.onstop = () => {
                let time = Date.now() - this.state.time
                window.r = mediaRecorder

                handleMsg(Msg("send", username, avatar, AUDIO, {
                    duration: Math.ceil(time / 1000) + `"`,
                    buffer: recorderData,
                }))

                socket.emit(MSG, {
                    isGroup: isGroup(current), data: {
                        user: current, msg: Msg("receive", username, avatar, AUDIO, {
                            duration: Math.ceil(time / 1000) + `"`,
                            buffer: recorderData,
                        })
                    }
                })
                this.setState({
                    visible: false,
                    sendBtn: true,
                    startBtn: false,
                })
                for (let track of stream.getTracks()) {
                    console.log("stop ", track)
                    track.stop()
                }
            }
        }).catch(err => {
            console.log(err)
            message.error("Faild to get audio device")
        })

    }

    handleCancel() {
        this.audioIcon.current.className = ""
        if (mediaRecorder && mediaRecorder.state === "recording") {
            console.log("stop record")
            mediaRecorder.stop()
        }
        this.setState({
            visible: false,
        })
    }

    handleClose() {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            let config = {
                title: "It will close the audio and clear it, do you continue?",
                onOk: () => {
                    this.audioIcon.current.className = null

                    this.setState({
                        visible: false,
                        startBtn: false,
                        sendBtn: true,
                    })
                    mediaRecorder = null
                }
            }
            Modal.confirm(config)
        } else {
            this.audioIcon.current.className = null
            this.setState({
                visible: false,
                startBtn: false,
                sendBtn: true,
            })
        }


    }

    handleVideoClick() {
        if (!checkSupport()) {
            return
        }
        const {current} = this.props
        if (isGroup(current)) {
            message.info("Don't support video call on the group chatting", 2)
            return
        }
        this.video.current.handleCall()
    }

    handleVideoUIShow(flag) {
        this.setState({
            videoVisible: flag
        })
    }

    handleVideoClose() {
        if (this.state.isConnected) {
            let config = {
                title: "It will disconnect the video call, do you continue?",
                onOk: () => {
                    this.setState({
                        videoVisible: false
                    })
                    this.video.current.handleHangUp(true)
                }
            }
            Modal.confirm(config)
        } else {
            this.setState({
                videoVisible: false
            })
            this.video.current.handleHangUp(false)
        }
    }

    handleKeyDown(e) {
        if (e.ctrlKey && e.keyCode === 13) {
            this.handleSendMsg()
        }
    }

    deleteFile() {
        console.log("delete file")
        this.setState({
            file: null,
            hidden: true,
            text: "",
            type: "text",
        })
    }

    render() {
        const props = {
            beforeUpload: file => {
                this.setState({
                    file: file,
                    hidden: false,
                    type: "file",
                }, () => {
                    window.file = this.state.file
                });
                return false;
            },
            showUploadList: false,
        }

        return <div className={"chat-room-message-editor"}>
            <div className="chat-room-message-editor-toolbox">
                <Space size={"middle"}>
                    <Popover placement="topLeft" title={false}
                             content={<Emoji handleEmojiClick={this.handleEmojiClick}/>} trigger="hover">
                        <SmileOutlined className={"chat-room-message-editor-toolbox-item"}/>
                    </Popover>
                    {}
                    <Upload {...props}>
                        <FolderOutlined
                            className={"chat-room-message-editor-toolbox-item"}/>
                    </Upload>

                    <Tooltip title={"audio"}>
                        <AudioOutlined onClick={this.handleVoiceClick}
                                       className={"chat-room-message-editor-toolbox-item"}/>
                    </Tooltip>

                    <Modal
                        visible={this.state.visible}
                        onCancel={this.handleClose}
                        centered
                        maskClosable={false}
                        footer={null}
                        width={300}
                        bodyStyle={{padding: 10}}
                    >
                        <Row>
                            <Col span={24}>
                                <div className={"chat-room-modal-audio"}>
                                    <AudioOutlined ref={this.audioIcon}/>
                                </div>
                            </Col>
                            <Col span={24} style={{textAlign: "center"}}>
                                <Space>
                                    <Button onClick={this.handleOk} disabled={this.state.startBtn}>Start</Button>
                                    <Button type={"primary"} onClick={this.handleCancel}
                                            disabled={this.state.sendBtn}>Send</Button>
                                </Space>
                            </Col>
                        </Row>

                    </Modal>

                    <Tooltip title={"Video call"}>
                        <VideoCameraOutlined onClick={this.handleVideoClick}
                                             className={"chat-room-message-editor-toolbox-item"}/>
                    </Tooltip>
                    <Modal
                        visible={this.state.videoVisible}
                        onCancel={this.handleVideoClose}
                        footer={null}
                        maskClosable={false}
                        width={600}
                        centered
                        closable={false}
                        bodyStyle={{padding: 0, height: 450}}
                        forceRender
                    >
                        <Video ref={this.video}
                               openVideo={this.handleVideoUIShow}
                               setConnect={(flag) => this.setState({isConnected: flag})}/>

                    </Modal>
                </Space>
            </div>
            <textarea hidden={!this.state.hidden} onKeyDown={this.handleKeyDown} ref={this.text}
                      className={"chat-room-message-editor-textarea"}
                      placeholder={"Please type in the message"}/>
            <div hidden={this.state.hidden}>
                {this.state.file ?
                    <FilePreviewIcon type={this.state.file.type}
                                     filename={this.state.file.name} deleteFile={this.deleteFile}/>
                    : <></>}
            </div>
            <div className={"chat-room-message-editor-btn"}>
                <Button onClick={this.handleSendMsg}>Send</Button>
            </div>
        </div>
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setCurrent: (current) => dispatch(current),
    }
}

const mapStateToProps = (state) => ({
        username: state.username,
        avatar: state.avatar,
        current: state.current,
    }
)

MessageEditor.propTypes = {
    handleMsg: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(MessageEditor)