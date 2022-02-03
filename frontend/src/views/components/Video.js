import React from "react";
import {connect} from "react-redux";
import {PropTypes} from "prop-types";
import {Button, message, Modal, Space} from "antd";
import {CloseCircleOutlined } from "@ant-design/icons";
import Draggable from "react-draggable";
import "./Video.css";
import socket from "../../utils/socket";
import {
    PEER_CONNECTION_CANDIDATE,
    PEER_CONNECTION_HANGUP,
    PEER_CONNECTION_REQUEST,
    PEER_CONNECTION_RESPONSE
} from "../../utils/socket-types";
import {AGREE, ATTEMPT, BUSY, CONNECT, NOTFOUND, NOTSUPPORT, REJECT, Success, VideoMsg} from "../../utils/request";
import {checkSupport, isGroup} from "../../utils/tools";

let servers = {iceServers: [{urls: 'stun:stun1.l.google.com:19302'}]};

const offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};


class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: false,
            isCanceled: false,
            remote: "",
        };
        this.pc = null;
        this.localStream = null;
        this.message = null;

        this.handleCall = this.handleCall.bind(this);
        this.handleHangUp = this.handleHangUp.bind(this);
        this.createPeerConnection = this.createPeerConnection.bind(this);
        this.createAnswerToOffer = this.createAnswerToOffer.bind(this);
        this.createOffer = this.createOffer.bind(this);
        this.handleConnectionFailed = this.handleConnectionFailed.bind(this);
        this.handleMinorVideoClick = this.handleMinorVideoClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }


    componentDidMount() {
        socket.on(PEER_CONNECTION_REQUEST, (req) => {
            if (this.state.isConnected) {
                socket.emit(PEER_CONNECTION_RESPONSE, VideoMsg(ATTEMPT, this.props.username, req.from, {
                    msg: BUSY
                }))
                return
            }
            console.log("receive req: ", req)
            if (req.type === ATTEMPT) {
                let config = {
                    title: `${req.from} Request for video call`,
                    onOk: () => {
                        if (!checkSupport()) {
                            socket.emit(PEER_CONNECTION_RESPONSE, VideoMsg(ATTEMPT, this.props.username, req.from, {
                                msg: NOTSUPPORT
                            }))
                            return
                        }
                        socket.emit(PEER_CONNECTION_RESPONSE, VideoMsg(ATTEMPT, this.props.username, req.from, {
                            msg: AGREE
                        }))
                        this.pc = this.createPeerConnection(req.from)
                        this.setState({
                            remote: req.from
                        })
                    },
                    onCancel: () => {
                        socket.emit(PEER_CONNECTION_RESPONSE, VideoMsg(ATTEMPT, this.props.username, req.from, {
                            msg: REJECT
                        }))
                    }
                }
                Modal.confirm(config)
            }

            else if (req.type === CONNECT) {
                if(this.state.isCanceled){
                    
                }
                console.log(`Start to connect with${req.from}`)
                this.createAnswerToOffer(req)
            } else {
                message.error("The type of request is error")
                console.log("The type of request is error")
            }
        });

        socket.on(PEER_CONNECTION_RESPONSE, (res) => {
            if (this.message){
                this.message();
            }
            console.log("receive res: ", res);
            if (res.type === ATTEMPT) {
                if(this.state.isCanceled){
                    this.handleConnectionFailed(res, "The people has canceled the call")
                    return
                }
                if (res.data.msg === AGREE) {
                    this.createOffer()
                } else if (res.data.msg === BUSY) {
                    message.info("The people is in a call")
                } else if (res.data.msg === NOTSUPPORT) {
                    message.info("The people's device does not support video call")
                } else if (res.data.msg === NOTFOUND) {
                    message.info("Don't find the people")
                } else {
                    message.info("The people might be busy now")
                }

            } else if (res.type === CONNECT) {
                if (res.data.code === Success) {
                    this.props.openVideo(true)
                    this.local.srcObject = this.localStream
                    this.pc.setRemoteDescription(new RTCSessionDescription(res.data.data.sdp)).then(() => {
                        console.log("local set remote sdp success")
                    }).catch(err => {
                        console.log("local set remote sdp err: ", err)
                    })
                } else {
                    message.info(res.data.msg)
                }
            }
        });

        socket.on(PEER_CONNECTION_CANDIDATE, res => {
            console.log(`this pc: ${this.pc === null}`)
            if (this.pc) {
                this.pc.addIceCandidate(new RTCIceCandidate(res.data.candidate)).then(() => {
                    console.log("add candidate success")
                }).catch(err => {
                    console.log("add iceCandidate error: ", err.toString())
                })
            } else {
                console.error("no peerConnection available")
            }
        })

        socket.on(PEER_CONNECTION_HANGUP, () => {
            message.info("Disconnected with the people")
            this.handleHangUp(false)
        })
    }

    handleCancel(){
        this.setState({
            isCanceled: true
        }, ()=>{
            if(this.message){
                this.message()
            }
            console.log(this.state)
        })
    }

    handleCall() {
        this.setState({
            isConnected: false,
            isCanceled: false,
            remote: "",
        })
        const {current, username} = this.props
        if (current) {
            if (isGroup(current)) {
                message.info("Don't support video call on the group chat")
                return
            }
            this.message = message.loading(<>Requesting <CloseCircleOutlined onClick={this.handleCancel}/></>, 30, ()=>this.handleCancel)
            console.log(`${username} want to call ${current}`)
            socket.emit(PEER_CONNECTION_REQUEST, VideoMsg(ATTEMPT, username, current, null))
        } else {
            message.info("Please select someone to video with")
        }
    }

    createOffer() {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        }).then(stream => {
            console.log("local get stream ...")
            this.localStream = stream
            this.local.srcObject = stream;

            this.pc = this.createPeerConnection(this.props.current)
            this.pc.oniceconnectionstatechange = (ev) => {
                console.log("oniceconnectionstatechange", ev)
                console.log("iceConnectionState: ", this.pc.iceConnectionState)
                if (this.pc.iceConnectionState === "disconnected") {
                    message.info("Disconnected with the people", 2)
                    this.handleHangUp(false)
                    this.props.openVideo(false)
                    this.setState({
                        isConnected: false
                    })
                }
                if(this.pc.iceConnectionState === "connected"){
                    this.setState({
                        isConnected: true
                    })
                    this.props.setConnect(true)
                }
            }

            this.localStream.getTracks().forEach(track => {
                console.log("add local stream")
                this.pc.addTrack(track, this.localStream)
            })

            console.log("create offer, and send to remote")
            this.pc.createOffer(offerOptions).then(offer => {
                this.pc.setLocalDescription(offer).then(() => {
                    console.log(offer.sdp)
                    const {username, current} = this.props
                    socket.emit(PEER_CONNECTION_REQUEST, VideoMsg(CONNECT, username, current, {
                        data: {
                            sdp: offer
                        }
                    }))
                })
            })
        }).catch(err => {
            console.log("Faild to get the midia device", err)
            if (err.name === "NotReadableError") {
                message.error("Cannot get the device")
            } else if (err.name === "NotAllowedError") {
                message.error("No access to the media device")
            } else {
                message.error("Get the media device error", err.message)
            }
            this.handleHangUp(false)
            this.props.openVideo(false)
        })

    }

    createPeerConnection(to) {

        this.setState({
            remote: to
        })
        let pc = new RTCPeerConnection(servers)
        pc.onicecandidate = ev => {
            console.log(" onicecandidate ev: ", ev)
            if (ev.candidate) {
                socket.emit(PEER_CONNECTION_CANDIDATE, {
                    to: to,
                    from: this.props.username,
                    data: {
                        candidate: ev.candidate
                    }
                })
            }
        }

        pc.onnegotiationneeded = () => {
            console.log("call ", "onnegotiationneeded")
        }

        pc.ontrack = ev => {
            console.log(`${this.props.username} ontrack: `, ev)
            if (this.remote.srcObject !== ev.streams[0]) {
                this.remote.srcObject = ev.streams[0]
                console.log("receive remote stream")
            }
        }

        return pc
    }

    handleHangUp(needNotice) {
        console.log("hang up")
        if (this.pc) {
            this.pc.close()
            console.log("close RPCPeerConnection")
            this.pc = null
        }

        if (this.localStream) {
            for (let track of this.localStream.getTracks()) {
                track.stop()
            }
            this.localStream = null
        }

        if (this.local) {
            this.local.srcObject = null
        }
        if (this.remote) {
            this.remote.srcObject = null
        }

        if (needNotice) {
            socket.emit(PEER_CONNECTION_HANGUP, {
                to: this.state.remote,
            })
        }

        this.props.openVideo(false)

        this.setState({
            isConnected: false,
            isCanceled: false,
        })
    }

    createAnswerToOffer(req) {

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        }).then(stream => {
            this.localStream = stream
            this.local.srcObject = stream

            this.localStream.getTracks().forEach(track => {
                console.log("add local stream")
                this.pc.addTrack(track, this.localStream)
            })

            this.props.openVideo(true)
            this.pc.setRemoteDescription(new RTCSessionDescription(req.data.data.sdp)).then(() => {
                this.pc.createAnswer().then(answer => {
                    this.pc.setLocalDescription(answer).then(() => {
                        console.log("create answer: ", answer.sdp)
                        socket.emit(PEER_CONNECTION_RESPONSE, VideoMsg(CONNECT, this.props.username, req.from, {
                            code: Success,
                            data: {
                                sdp: answer
                            }
                        }))
                    })

                })
            }).catch(err => {
                console.log(PEER_CONNECTION_REQUEST, " set remote sdp err: ", err)
                message.error(`create answer error:  set remote sdp err: ${err.toString()}`)
            })
        }).catch(err => {
            console.log(err)
            message.error("Cann't get the media device")
            this.handleConnectionFailed(req, "The people you call can't get the media device")
            this.props.openVideo(false)
            this.handleHangUp(false)
        })
    }

    handleConnectionFailed(req, msg) {
        socket.emit(PEER_CONNECTION_RESPONSE, VideoMsg(CONNECT, this.props.username, req.from, {
            msg: msg
        }))
    }

    handleMinorVideoClick() {
        let temp = this.local.srcObject
        this.local.srcObject = this.remote.srcObject
        this.remote.srcObject = temp
        this.local.muted = !this.local.muted
        this.remote.muted = !this.remote.muted
    }

    render() {
        return (<>
                <div className={"chat-room-video-container"}>
                    <video ref={ref => {
                        this.remote = ref;
                    }} className={"chat-room-video-main"} autoPlay playsInline/>
                    <Draggable bounds={".chat-room-video-main"}>
                        <video ref={ref => {
                            this.local = ref;
                        }} onClick={this.handleMinorVideoClick} className={"chat-room-video-minor"} playsInline
                               autoPlay muted={true}/>
                    </Draggable>
                    <div className={"chat-room-video-button"}>
                        <Space>
                            <Button onClick={this.handleHangUp.bind(this, true)}
                                    type={"danger"}>hang up</Button>
                        </Space>
                    </div>
                </div>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        username: state.username,
        current: state.current,
    }
}

Video.propTypes = {
    openVideo: PropTypes.func.isRequired,
    setConnect: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, null, null, {forwardRef: true})(Video);
