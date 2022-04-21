package test

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"testing"
)

func TestAddFriend(t *testing.T) {
	users := GetAllUser()
	selves := users[:2]

	for _, self := range selves {
		// Add others as friend test
		for _, dst_user := range users {
			if self.Email != dst_user.Email {
				str := "userid=" + strconv.FormatInt(self.Id, 10) + "&dstemail=" + dst_user.Email
				response, _ := http.Post("http://127.0.0.1/contact/addfriend", "application/x-www-form-urlencoded", strings.NewReader(str))
				s, _ := ioutil.ReadAll(response.Body)
				fmt.Printf("%s\n", s)
			}
		}

		// Add self as friend test
		str := "userid=" + strconv.FormatInt(self.Id, 10) + "&dstemail=" + self.Email
		response, _ := http.Post("http://127.0.0.1/contact/addfriend", "application/x-www-form-urlencoded", strings.NewReader(str))
		s, _ := ioutil.ReadAll(response.Body)
		fmt.Printf("%s\n", s)

		// Add friend as friend test
		dst := users[len(users)-1]
		str = "userid=" + strconv.FormatInt(self.Id, 10) + "&dstemail=" + dst.Email
		response, _ = http.Post("http://127.0.0.1/contact/addfriend", "application/x-www-form-urlencoded", strings.NewReader(str))
		s, _ = ioutil.ReadAll(response.Body)
		fmt.Printf("%s\n", s)
	}
}
