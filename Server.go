package main

import (
	"fmt"
	"net"
	"sync"
)

type Server struct {
	Ip   string
	Port int

	OnlineMap map[string]*User
	mapLock   sync.RWMutex

	// 消息广播channel
	BroadcastChan chan string
}

// New Server
func NewServer(ip string, port int) *Server {
	server := &Server{
		Ip:            ip,
		Port:          port,
		OnlineMap:     make(map[string]*User),
		BroadcastChan: make(chan string),
	}

	return server
}

// 监听MessageChan的goroutine, 一旦有消息就广播
func (thisServer *Server) ListenBroadcastChan() {
	for {
		msg := <-thisServer.BroadcastChan

		//广播msg
		thisServer.mapLock.Lock()
		for _, user := range thisServer.OnlineMap {
			user.Ch <- msg
		}
		thisServer.mapLock.Unlock()
	}
}

// 生成广播消息并送入广播通道
func (thisServer *Server) Broadcast(user *User, msg string) {
	sendMsg := "[" + user.Addr + "] " + user.Name + ": " + msg
	thisServer.BroadcastChan <- sendMsg
}

// 处理当前接入
func (thisServer *Server) Handler(conn net.Conn) {

	// 用户上线
	newuser := NewUser(conn)
	thisServer.mapLock.Lock()
	thisServer.OnlineMap[newuser.Name] = newuser
	thisServer.mapLock.Unlock()
	fmt.Println(newuser.Name + " Successly Connected")

	// 广播用户上线
	thisServer.Broadcast(newuser, "already online")

}

// Start Server
func (thisServer *Server) Start() {

	// socket listen
	listener, err := net.Listen("tcp", fmt.Sprintf("%s:%d", thisServer.Ip, thisServer.Port))

	if err != nil {
		fmt.Println("Net Listen Failed, err: ", err)
		return
	}

	// close listen socket
	defer listener.Close()

	// 启动Broadcast Channel的监听
	go thisServer.ListenBroadcastChan()

	fmt.Println("Server waiting for connection...")
	for {
		// accept
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("Listener Accept Error: ", err)
			continue
		}

		// do handler
		go thisServer.Handler(conn)
	}

}
