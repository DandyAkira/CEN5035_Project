package controller

import (
	"GatorChat/global"
	"GatorChat/model"
	"GatorChat/service"
	"GatorChat/utils"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
)

func Login(writer http.ResponseWriter, request *http.Request) {
	_ = request.ParseForm()
	email := request.PostForm.Get("email")
	fmt.Println("Receive Login Request from: ", email)
	password := request.PostForm.Get("password")
	user, err := service.UserService{}.Login(email, password)
	if err != nil {
		global.ResponseFail(writer, err.Error())
	} else {
		global.ResponseOk(writer, user, "Login Success")
	}
}

func Register(writer http.ResponseWriter, request *http.Request) {

	_ = request.ParseForm()
	email := request.PostForm.Get("email")
	fmt.Println("Receive Register Request from: ", email)
	if len(email) <= 0 || !strings.Contains(email, "@") {
		global.ResponseFail(writer, "illegal email")
		return
	}
	password := request.PostForm.Get("password")
	if len(password) <= 0 {
		global.ResponseFail(writer, "Illegal Password")
		return
	}
	nickname := request.PostForm.Get("nickname")
	if len(nickname) == 0 {
		nickname = "user" + strconv.Itoa(rand.Intn(10000))
	}
	avatar := ""
	sex := model.SEX_UNKNOW

	user, err := service.UserService{}.Register(email, password, nickname, avatar, sex)

	if err != nil {
		global.ResponseFail(writer, err.Error())
	} else {
		global.ResponseOk(writer, user.Email, "Register Success at "+user.Createat.String())
	}
}

func GetUser(writer http.ResponseWriter, request *http.Request) {
	var user model.User
	if err := utils.Bind(request, &user); err != nil {
		global.ResponseFail(writer, err.Error())
	}
	user, err := service.UserService{}.GetUserById(user.Id)
	if err != nil {
		global.ResponseFail(writer, err.Error())
	} else {
		global.ResponseOk(writer, user, "Get User OK")
	}
}
