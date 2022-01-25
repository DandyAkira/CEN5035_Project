package main

import (
	"fmt"
	"io"
	"net"
	"strings"
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
	sendMsg := "[" + user.Name + "] " + ": " + msg
	thisServer.BroadcastChan <- sendMsg
}

func (thisServer *Server) UserOnline(user *User) {
	thisServer.mapLock.Lock()
	thisServer.OnlineMap[user.Name] = user
	thisServer.mapLock.Unlock()
	fmt.Println("[" + user.Addr + "] " + user.Name + " is Online")

	// 广播用户上线
	thisServer.Broadcast(user, "already online")
}

func (thisServer *Server) UserOffline(user *User) {
	thisServer.mapLock.Lock()
	delete(thisServer.OnlineMap, user.Name)
	thisServer.mapLock.Unlock()
	fmt.Println("[" + user.Addr + "] " + user.Name + " is Offline")
}

func (thisServer *Server) HandleMessage(msg string, user *User) {
	msgSplit := strings.Split(msg, "|")
	msgType := msgSplit[0]
	switch msgType {
	case "public":
		msg_to_broadcast := "[" + user.Name + "] [public] : " + strings.Join(msgSplit[1:], "|")
		thisServer.BroadcastChan <- msg_to_broadcast
		break
	case "private":
		toWho := thisServer.OnlineMap[msgSplit[1]]
		if toWho == nil {
			user.Ch <- "No such User"
		} else {
			msg_to_send := "[" + user.Name + "] [private] : " + strings.Join(msgSplit[2:], "|")
			toWho.Ch <- msg_to_send
		}

		break
	case "who":
		if len(thisServer.OnlineMap) > 1 {
			sendMsg := "These Users are Online right now:\n"
			for name, _ := range thisServer.OnlineMap {
				if name != user.Name {
					sendMsg = sendMsg + " [ " + name + " ] ;"
				}
			}
			user.Ch <- sendMsg
		} else {
			user.Ch <- "No one is online right now, input 'back()' to exit"
		}
		break

	}
}

// 处理当前接入
func (thisServer *Server) Handler(conn net.Conn) {

	// 用户上线
	newuser := NewUser(conn, thisServer)

	thisServer.UserOnline(newuser)

	// 接收客户端发送的消息
	go func() {
		buf := make([]byte, 4096)
		for {
			n, err := conn.Read(buf)
			if n == 0 {
				thisServer.UserOffline(newuser)
				return
			}

			if err != nil && err != io.EOF {
				fmt.Println("Connection Read Error: ", err)
				return
			}

			userMSG := strings.Split(string(buf), "\n")[0]
			//fmt.Println("conn read: ", userMSG)
			thisServer.HandleMessage(userMSG, newuser)
		}
	}()

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

func main() {
	server := NewServer("127.0.0.1", 8888)
	server.Start()
}
