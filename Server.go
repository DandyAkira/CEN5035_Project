package main

import (
	"fmt"
	"io"
	"net"
	"strconv"
	"strings"
	"sync"
)

type Server struct {
	Ip   string
	Port int

	OnlineMap     map[int]*User
	OnlineMapLock sync.RWMutex

	// 消息广播channel
	BroadcastChan chan string
}

var currentID int = 1001

// New Server
func NewServer(ip string, port int) *Server {
	server := &Server{
		Ip:            ip,
		Port:          port,
		OnlineMap:     make(map[int]*User),
		BroadcastChan: make(chan string),
	}

	return server
}

// 监听MessageChan的goroutine, 一旦有消息就广播
func (thisServer *Server) ListenBroadcastChan() {
	for {
		msg := <-thisServer.BroadcastChan

		//广播msg
		thisServer.OnlineMapLock.Lock()
		for _, user := range thisServer.OnlineMap {
			user.Ch <- msg
		}
		thisServer.OnlineMapLock.Unlock()
	}
}

// 生成广播消息并送入广播通道
func (thisServer *Server) Broadcast(user *User, msg string) {
	sendMsg := "[system] [" + user.Name + "] " + ": " + msg
	thisServer.BroadcastChan <- sendMsg
}

func (thisServer *Server) UserOnline(user *User) {
	thisServer.OnlineMapLock.Lock()
	thisServer.OnlineMap[currentID] = user
	thisServer.OnlineMapLock.Unlock()
	fmt.Println("[" + user.Addr + "] " + user.Name + " is Online")

	// 广播用户上线
	thisServer.Broadcast(user, "already online")
}

func (thisServer *Server) UserOffline(user *User) {
	thisServer.OnlineMapLock.Lock()
	delete(thisServer.OnlineMap, user.ID)
	thisServer.OnlineMapLock.Unlock()
	fmt.Println("[" + user.Addr + "] " + user.Name + " is Offline")
}

func (thisServer *Server) HandleMessage(msg string, user *User) {
	msgSplit := strings.Split(msg, "|")
	msgType := msgSplit[0]
	switch msgType {
	case "public":
		msg_to_broadcast := "[message] [" + user.Name + "] [public] : " + strings.Join(msgSplit[1:], "|")
		thisServer.BroadcastChan <- msg_to_broadcast
		break
	case "private":
		thisServer.OnlineMapLock.Lock()
		toID, _ := strconv.Atoi(msgSplit[1])
		toWho, ok := thisServer.OnlineMap[toID]
		//fmt.Printf("%t , %v\n", msgSplit[1])
		if !ok {
			user.Ch <- "[system] No such User"
		} else {
			msg_to_send := "[message] [" + user.Name + "] [private] : " + strings.Join(msgSplit[2:], "|")
			toWho.Ch <- msg_to_send
		}
		thisServer.OnlineMapLock.Unlock()
		break
	case "who":
		if len(thisServer.OnlineMap) > 1 {
			sendMsg := "[system] These Users are Online right now:\n"
			for id, users := range thisServer.OnlineMap {
				sendMsg = sendMsg + "[ ID: " + strconv.Itoa(id) + " Name: " + users.Name + "] ;"
			}
			user.Ch <- sendMsg
		} else {
			user.Ch <- "[system] No one is online right now, input 'back()' to exit"
		}
		break
	case "rename":
		newName := msgSplit[1]
		user.Name = newName
		user.Ch <- "[system] Successfully changed your username to: [" + newName + "]"
		thisServer.Broadcast(user, "already online")
		break
	default:
		user.Ch <- "[system] Unknown Message Type"
		break
	}
}

// 处理当前接入
func (thisServer *Server) Handler(conn net.Conn) {

	// 用户上线
	newuser := NewUser(conn, thisServer, currentID)
	currentID += 1

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

			userMSG := string(buf)
			fmt.Println("Server Read: " + "[" + newuser.Name + "] " + userMSG)
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
