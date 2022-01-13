package main

import (
	"fmt"
	"net"
)

type Server struct {
	Ip   string
	Port int
}

// New Server
func NewServer(ip string, port int) *Server {
	server := &Server{
		Ip:   ip,
		Port: port,
	}

	return server
}

func (ser *Server) Handler(conn net.Conn) {
	// 处理当前接入
	fmt.Println("Successly Connected")
}

//Start Server
func (ser *Server) Start() {

	// socket listen
	listener, err := net.Listen("tcp", fmt.Sprintf("%s:%d", ser.Ip, ser.Port))

	if err != nil {
		fmt.Println("Net Listen Failed, err: ", err)
		return
	}

	// close listen socket
	defer listener.Close()

	for {
		// accept

		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("Listener Accept Error: ", err)
			continue
		}

		// do handler

		go ser.Handler(conn)
	}

}
