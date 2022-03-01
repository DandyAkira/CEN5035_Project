package main

import (
	"GatorChat/controller"
	"GatorChat/global"
	"GatorChat/initialize"
	"log"
	"net/http"
)

func main() {
	// 1. 提供指定目录的静态文件支持
	//http.Handle("/", http.FileServer(http.Dir(".")))
	http.Handle("/asset/", http.FileServer(http.Dir(".")))
	http.Handle("/mnt/", http.FileServer(http.Dir(".")))

	// 2. 初始化template
	initialize.RegisterView()
	// 2. 注册路由
	http.HandleFunc("/", func(writer http.ResponseWriter, request *http.Request) {
		http.Redirect(writer, request, "/user/login.shtml", http.StatusFound)
		return
	})
	http.HandleFunc("/login", controller.Login)
	http.HandleFunc("/register", controller.Register)
	http.HandleFunc("/user/find", controller.GetUser)
	http.HandleFunc("/contact/loadcommunity", controller.LoadCommunity)
	http.HandleFunc("/contact/loadfriend", controller.LoadFriend)
	http.HandleFunc("/contact/createcommunity", controller.CreateCommunity)
	http.HandleFunc("/contact/joincommunity", controller.JoinCommunity)
	http.HandleFunc("/contact/addfriend", controller.AddFriend)
	http.HandleFunc("/chat", controller.Chat)
	http.HandleFunc("/attach/upload", controller.Upload)

	// 4. 开启服务
	log.Println("Api server run success on ", global.Address)

	_ = http.ListenAndServe(global.Address, nil)
}
