package main

import (
	"bufio"
	"flag"
	"fmt"
	"io"
	"net"
	"os"
	"strconv"
	"strings"
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

func (thisClient *Client) HandleMSG() {
	//收到的消息 拷贝并打印， 永久循环并阻塞
	io.Copy(os.Stdout, thisClient.conn)
}

func (thisClient *Client) menu() bool {
	var input string

	fmt.Println("(1) Public Chat")
	fmt.Println("(2) Private Chat")
	fmt.Println("(0) Exit")

	fmt.Scanln(&input)
	inputInt, err := strconv.Atoi(input)
	if err != nil {
		fmt.Println("str conv to int error: ", err)
	}

	if inputInt >= 0 && inputInt < 3 {
		thisClient.flag = inputInt
		return true
	} else {
		fmt.Println("illegal input")
		return false
	}

}

func (thisClient *Client) PublicChat() {
	//提示用户输入消息
	var textMSG string
	reader := bufio.NewReader(os.Stdin)
	fmt.Println(">>>> Input text message here, input 'back()' and enter to exit <<<<")
	textMSG, _ = reader.ReadString('\n')
	textMSG = strings.TrimSpace(textMSG)

	for textMSG != "back()" {
		if len(textMSG) > 0 {
			sendMSG := "public|" + textMSG
			fmt.Println("Client write msg: ", textMSG)
			_, err := thisClient.conn.Write([]byte(sendMSG))
			if err != nil {
				fmt.Println("conn Write Error: ", err)
				break
			}
		}

		fmt.Println(">>>> Input text message here, input 'back()' and enter to exit <<<<")
		textMSG = ""
		textMSG, _ = reader.ReadString('\n')
		textMSG = strings.TrimSpace(textMSG)
	}
}

func (thisClient *Client) LookforOnlineUsers() {
	sendMsg := "who|"
	_, err := thisClient.conn.Write([]byte(sendMsg))
	if err != nil {
		fmt.Println("conn write error: ", err)
		return
	}
}

func (thisClient *Client) PrivateChat() {
	thisClient.LookforOnlineUsers()

	nameReader := bufio.NewReader(os.Stdin)
	fmt.Println(">>>>> Choose one you want to chat, input 'back()' to exit <<<<<")
	inputName, _ := nameReader.ReadString('\n')
	inputName = strings.TrimSpace(inputName)

	for inputName != "back()" {
		contentReader := bufio.NewReader(os.Stdin)
		fmt.Println(">>>>> Input your content, 'back()' to exit <<<<<")
		inputContent, _ := contentReader.ReadString('\n')
		inputContent = strings.TrimSpace(inputContent)
		for inputContent != "back()" {
			if len(inputContent) > 0 {
				sendMSG := "private|" + inputName + "|" + inputContent

				_, err := thisClient.conn.Write([]byte(sendMSG))
				if err != nil {
					fmt.Println("conn write error: ", err)
					break
				}

			}

			fmt.Println(">>>>> Input your content, 'back()' to exit <<<<<")
			inputContent = ""
			inputContent, _ = contentReader.ReadString('\n')
			inputContent = strings.TrimSpace(inputContent)
		}

		fmt.Println(">>>>> Choose one you want to chat, input 'back()' to exit <<<<<")
		inputName, _ = nameReader.ReadString('\n')
		inputName = strings.TrimSpace(inputName)

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
			thisClient.PublicChat()
			break
		case 2:
			fmt.Println("you are right now at private chat")
			thisClient.PrivateChat()
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

	go client.HandleMSG()

	client.Run()
}
