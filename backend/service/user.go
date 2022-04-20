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

func (u UserService) Login(email, plainpwd string) (user model.User, err error) {
	_, err = database.DB.Where("email = ?", email).Get(&user)
	if err != nil {
		fmt.Println("数据库查询出错, err: ", err.Error())
		return user, err
	}
	if user.Id <= 0 {
		err = errors.New("no such user")
		return user, err
	}
	if !encrypt.ValidatePasswd(plainpwd, user.Salt, user.Password) {
		err = errors.New("wrong password")
		return user, err
	}
	// 刷新Token, 防止恶意登录
	user.Token = utils.GenerateToken()
	_, err = database.DB.Id(user.Id).Cols("token").Update(&user)
	if err != nil {
		fmt.Println("刷新token后写入出错, err: ", err.Error())
		return user, err
	}
	return user, nil
}

func (u UserService) Register(email, plainpwd, nickname, avatar, sex string) (user model.User, err error) {
	_, err = database.DB.Where("email = ?", email).Get(&user)
	if err != nil {
		fmt.Println("数据库查询出错, err: ", err.Error())
		return user, err
	}
	if user.Id > 0 {
		err = errors.New("this email is already used")
		return user, err
	}
	user.Email = email
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

func (u UserService) ChangeName(userId int64, name string) error {
	user := model.User{}
	_, err := database.DB.Where("id = ?", userId).Get(&user)
	if err != nil {
		return errors.New("can not find user")
	}
	fmt.Println(user)
	if user.Nickname == name {
		return errors.New("new name same to current one")
	}
	user.Nickname = name
	_, err = database.DB.Id(userId).Update(&user)
	if err != nil {
		return err
	} else {
		return nil
	}
}

//查找某个用户
func (s UserService) GetUserById(userId int64) (user model.User, err error) {
	_, err = database.DB.ID(userId).Get(&user)
	return user, err
}
