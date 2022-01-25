package main

import (
	"net"
)

type User struct {
	Name string
	Addr string
	Ch   chan string
	conn net.Conn

	connectedServer *Server
}

// 创建新用户API
func NewUser(conn net.Conn, server *Server) *User {
	userAddr := conn.RemoteAddr().String()

	user := &User{
		Name:            userAddr,
		Addr:            userAddr,
		Ch:              make(chan string),
		conn:            conn,
		connectedServer: server,
	}

	// 监听channel
	go user.ListenMessage()

	return user
}

func (thisUser *User) Push2Client(msg string) {
	thisUser.conn.Write([]byte(msg))
}

func (thisUser *User) DoMessage(msg string) {
	thisUser.connectedServer.Broadcast(thisUser, msg)
}

// 监听当前user channel
func (thisUser *User) ListenMessage() {
	for {
		msg := <-thisUser.Ch
		thisUser.Push2Client(msg + "\n")
	}
}
