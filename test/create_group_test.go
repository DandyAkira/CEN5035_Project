package test

import (
	"GatorChat/model"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"testing"
)

var users []model.User = GetAllUser()

func Fake_Group_Req(user model.User) string {
	comm := &model.Community{
		Name:    "group_" + randStr(4),
		Cate:    0,
		Icon:    "/asset/images/community.png",
		Ownerid: user.Id,
	}
	str := "name=" + comm.Name + "&cate=0" + "&icon=" + comm.Icon + "&ownerid=" + strconv.FormatInt(user.Id, 10)
	return str
}

func TestCreateGroup(t *testing.T) {
	for _, user := range users {
		for i := 0; i < 6; i++ {
			str := Fake_Group_Req(user)
			response, _ := http.Post("http://127.0.0.1/contact/createcommunity", "application/x-www-form-urlencoded", strings.NewReader(str))
			s, _ := ioutil.ReadAll(response.Body)
			fmt.Printf("%s\n", s)
		}
	}
}
