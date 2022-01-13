package main

import "net"

type User struct {
	Name string
	Addr string
	Ch   chan string
	conn net.Conn
}

// 创建新用户API
func NewUser(conn net.Conn) *User {
	userAddr := conn.RemoteAddr().String()

	user := &User{
		Name: userAddr,
		Addr: userAddr,
		Ch:   make(chan string),
		conn: conn,
	}

	// 监听channel
	go user.ListenMessage()

	return user
}

// 监听当前user channel, 有消息时发送给Server
func (thisUser *User) ListenMessage() {
	for {
		msg := <-thisUser.Ch
		thisUser.conn.Write([]byte(msg + "\n"))
	}
}
