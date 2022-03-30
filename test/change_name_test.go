package test

import (
	"GatorChat/database"
	"GatorChat/model"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"testing"
)

type fake_Change_Name struct {
	ID   int64  `json:"userid"`
	Name string `json:"newname"`
}

func GetAllUser() []model.User {
	users := make([]model.User, 0)
	database.DB.Where("id > ?", 0).Find(&users)
	return users
}

func NewFakeRequest_DiffName(user model.User) *fake_Change_Name {
	newname := "user_" + randStr(4)
	for newname == user.Nickname {
		newname = "user_" + randStr(4)
	}
	return &fake_Change_Name{
		ID:   user.Id,
		Name: newname,
	}
}
func NewFakeRequest_SameName(user model.User) *fake_Change_Name {
	return &fake_Change_Name{
		ID:   user.Id,
		Name: user.Nickname,
	}
}

func TestChangeName(t *testing.T) {
	for _, user := range GetAllUser() {
		same_name_req := NewFakeRequest_SameName(user)
		str := "userid=" + strconv.FormatInt(same_name_req.ID, 10) + "&newname=" + same_name_req.Name
		response, _ := http.Post("http://127.0.0.1/profile/changename", "application/x-www-form-urlencoded", strings.NewReader(str))
		s, _ := ioutil.ReadAll(response.Body)
		fmt.Printf("%s\n", s)
		diff_name_req := NewFakeRequest_DiffName(user)
		str = "userid=" + strconv.FormatInt(diff_name_req.ID, 10) + "&newname=" + diff_name_req.Name
		response, _ = http.Post("http://127.0.0.1/profile/changename", "application/x-www-form-urlencoded", strings.NewReader(str))
		s, _ = ioutil.ReadAll(response.Body)
		fmt.Printf("%s\n", s)

	}
}
