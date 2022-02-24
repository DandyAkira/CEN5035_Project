package service

import (
	"GatorChat/database"
	"GatorChat/model"
	"GatorChat/utils"
	"GatorChat/utils/encrypt"
	"errors"
	"fmt"
	"log"
	"math/rand"
	"time"
)

type UserService struct{}

func (u UserService) Login(mobile, plainpwd string) (user model.User, err error) {
	_, err = database.DB.Where("mobile = ?", mobile).Get(&user)
	if err != nil {
		err = errors.New("该用户不存在")
		return
	}
	if !encrypt.ValidatePasswd(plainpwd, user.Salt, user.Password) {
		err = errors.New("密码不正确")
		return
	}
	user.Token = utils.GenerateToken()
	_, err = database.DB.Id(user.Id).Cols("token").Update(&user)
	return
}

func (u UserService) Register(mobile, plainpwd, nickname, avatar, sex string) (user model.User, err error) {
	_, err = database.DB.Where("mobile = ?", mobile).Get(&user)
	if err != nil {
		return
	}
	if user.Id > 0 {
		err = errors.New("该手机号已经被注册")
		return
	}
	user.Mobile = mobile
	user.Avatar = avatar
	user.Nickname = nickname
	user.Sex = sex
	user.Salt = fmt.Sprintf("%06d", rand.Int31n(10000))
	user.Password = encrypt.MakePasswd(plainpwd, user.Salt)
	user.Createat = time.Now()
	user.Token = utils.GenerateToken()

	_, err = database.DB.InsertOne(&user)
	if err != nil {
		log.Println("Insert Error", err.Error())
	}

	return user, nil
}

//查找某个用户
func (s UserService) GetUserById(userId int64) (user model.User, err error) {
	//首先通过手机号查询用户
	_, err = database.DB.ID(userId).Get(&user)
	return
}
