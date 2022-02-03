package main

// import (
// 	"beego"
// 	"models"
// 	"util"
// )

// type RegisterControllers struct {
// 	baseController
// }

// func (this *RegisterControllers) Get() {
// 	this.TplName = "register.html" // 注册页面
// }

// func (this *RegisterControllers) Join() {
// 	user := new(models.User)
// 	user.Name = this.GetString("name")
// 	user.Addr = this.GetString("Address")
// 	user.Email = this.GetString("email")
// 	user.Password = util.GetString(this.GetString("password"))
// 	beego.Info(user.Name, user.Email, user.Tel)
// 	if len(user.Name) == 0 || len(user.Tel) == 0 || len(user.Password) == 0 || len(user.Email) == 0 {
// 		this.Redirect("/register/join", 302)
// 		return
// 	}
// 	//添加数据库
// 	id, err := models.AddUser(user)
// 	if err != nil {
// 		this.Redirect("/register/join", 302)
// 		return
// 	}
// 	beego.Info(id)
// 	this.Redirect("/", 302)
// 	return
// }
