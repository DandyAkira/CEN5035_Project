<<<<<<< HEAD
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

import (
	// "crypto/md5"
	// "encoding/hex"
	"fmt"
)

var userDBMap map[int]([3]string)

func registerNewuser(userid int, username string, email string, password string) {
	userInfo := [3]string{
		username,
		email,
		password,
	}
	userDBMap[userid] = userInfo
}

func loginUser(userid int, password string) {
	DBinfo, ok := userDBMap[userid]
	if ok {
		if DBinfo[2] == password {
			fmt.Println("[info] \t login success!")
		} else {
			fmt.Println("[info]\t your password is incorrect! please input the correct password!!")
		}
	} else {
		fmt.Println("[Warning]\tuserid is not exsits!!!")
	}
}
func deleteUser(userid int) {
	DBinfo, ok := userDBMap[userid]

	if ok {
		delete(userDBMap, userid)
		fmt.Println("[info]\tUsername:", DBinfo[0], "has been deleted")
	} else {
		fmt.Println("[Warning]\tuserid is not exsits!!!")
	}
}
func main() {
	//var userDBMap map[int]([3]string) // map[key] value
	/* 创建Map 储存所有用户的信息*/
	userDBMap = make(map[int]([3]string))

	// 新用户信息加入
	registerNewuser(1, ranSeq(5), ranEmail(5), ranSeq(10))
	// userInfo := [3]string{
	// 	"testuser",           //username
	// 	"testuser@gmail.com", //email
	// 	"test123",            //password
	// }
	/* insert key-value pairs in the map*/

	// userid := 1
	//userID = GetString("userID")
	// userDBMap[userid] = userInfo

	// 查看Map里所有用户
	for userid := range userDBMap {
		fmt.Println("[info]", userid, "is in DB wiht info: \n", userDBMap[userid])
	}

	/* test if entry is present in the map or not*/
	// DBinfo, ok := userDBMap[1]
	//fmt.Println(DBinfo[2], "with encoding:", Md5Encode32("DBinfo[2]"))

	/* if ok is true, UseID is present otherwise entry is absent*/
	// if ok {

	// 	fmt.Println("[info] DBinfo:", DBinfo)
	// } else {
	// 	fmt.Println("[Warning] This user is not exists!!!!")
	// }
}
=======
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
>>>>>>> se_project/back_develop_v1.0.0_+7
