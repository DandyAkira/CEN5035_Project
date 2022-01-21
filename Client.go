package main

import (
	"flag"
	"fmt"
	"net"
)

type Client struct {
	ServerIP  string
	SeverPort int
	UserName  string
	conn      net.Conn
	flag      int
}

func NewClient(sIP string, sPort int) *Client {

	client := &Client{
		ServerIP:  sIP,
		SeverPort: sPort,
		flag:      999,
	}

	conn, err := net.Dial("tcp", fmt.Sprintf("%s:%d", sIP, sPort))
	if err != nil {
		fmt.Println("net.Dial error: ", err)
		return nil
	}

	client.conn = conn

	return client
}

func (thisClient *Client) menu() bool {
	var input int

	fmt.Println("(1) Public Chat")
	fmt.Println("(2) Private Chat")
	fmt.Println("(0) Exit")

	fmt.Scanln(&input)

	if input >= 0 && input < 3 {
		thisClient.flag = input
		return true
	} else {
		fmt.Println("illegal input")
		return false
	}

}

func (thisClient *Client) Run() {
	for thisClient.flag != 0 {
		for thisClient.menu() != true {
			continue
		}
		switch thisClient.flag {
		case 1:
			fmt.Println("you are right now at public chat channel")
			break
		case 2:
			fmt.Println("you are right now at private chat")
			break
		}
	}
}

var serverIP string
var serverPort int

func init() {
	// ./client -ip 127.0.0.1 -port 8888
	flag.StringVar(&serverIP, "ip", "127.0.0.1", "fill in Server IP, default = 127.0.0.1")
	flag.IntVar(&serverPort, "port", 8888, "fill in Server Port, default = 8888")
}

func main() {
	// 解析命令行，获取serverIP和serverPort
	flag.Parse()

	client := NewClient(serverIP, serverPort)
	if client == nil {
		fmt.Println("Client Failed to connected to the Server!")
	}
	fmt.Println("Client Connected successfully!")
	client.Run()
}
