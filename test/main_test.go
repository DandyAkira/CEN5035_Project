package test

import (
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"testing"
)

type testUser struct {
	Email    string `json:"email"`
	Password string `json:"passowrd"`
	Nickname string `json:"nickname"`
}

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")

func randStr(length int) string {
	tmp := make([]rune, length)
	for i := range tmp {
		tmp[i] = letters[rand.Intn(len(letters))]
	}
	return string(tmp)
}

func NewtestUser(id int) *testUser {
	eml := randStr(8) + strconv.Itoa(id) + "@gmail.com"
	user := &testUser{
		Email:    eml,
		Password: randStr(5),
		Nickname: "user" + fmt.Sprint(id),
	}
	return user
}

type testUnit struct {
	userMap map[int]*testUser
}

func newUnit(start, finish int) *testUnit {
	if finish < start {
		return nil
	}
	unit := &testUnit{
		userMap: make(map[int]*testUser),
	}
	for i := start; i <= finish; i++ {
		unit.userMap[i] = NewtestUser(i)
	}
	return unit
}

var unit1 *testUnit = newUnit(1, 50)

func TestRegister(t *testing.T) {
	fmt.Println("testing Regsiter ...")
	for _, user := range unit1.userMap {
		str := "email=" + user.Email + "&password=" + user.Password + "&nickname=" + user.Nickname
		response, _ := http.Post("http://127.0.0.1/register", "application/x-www-form-urlencoded", strings.NewReader(str))
		s, _ := ioutil.ReadAll(response.Body)
		fmt.Printf("%s\n", s)
	}
}

func TestLogin(t *testing.T) {
	fmt.Println("testing Login ...")
	for _, user := range unit1.userMap {
		str := "email=" + user.Email + "&password=" + user.Password
		response, _ := http.Post("http://127.0.0.1/login", "application/x-www-form-urlencoded", strings.NewReader(str))
		s, _ := ioutil.ReadAll(response.Body)
		fmt.Printf("%s\n", s)
	}
}
