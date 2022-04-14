package controller

import (
	"GatorChat/global"
	"GatorChat/model"
	"GatorChat/model/request"
	"GatorChat/service"
	"GatorChat/utils"
	"log"
	"net/http"
)

var contactService service.ContactService

func LoadFriend(w http.ResponseWriter, req *http.Request) {
	var arg request.ContactArg
	//如果这个用的上,那么可以直接
	if err := utils.Bind(req, &arg); err != nil {
		global.ResponseFail(w, err.Error())
		return
	}
	users := contactService.SearchFriend(arg.Userid)
	global.ResponseOkList(w, users, len(users))
}

func LoadCommunity(w http.ResponseWriter, req *http.Request) {
	var arg request.ContactArg
	//如果这个用的上,那么可以直接
	if err := utils.Bind(req, &arg); err != nil {
		global.ResponseFail(w, err.Error())
		return
	}
	comunitys := contactService.SearchComunity(arg.Userid)
	GroupPeopleMap, _ := service.ContactService{}.GetCommunityPeopleNum(comunitys)
	global.ResponseOk(w, map[string]interface{}{
		"comunitys": comunitys,
		"group_map": GroupPeopleMap,
	}, "获取社群信息成功")
	//global.ResponseOkList(w,comunitys,len(comunitys))
}

func CreateCommunity(w http.ResponseWriter, req *http.Request) {
	var arg model.Community

	if err := utils.Bind(req, &arg); err != nil {
		log.Println(err)
		global.ResponseFail(w, err.Error())
		return
	}
	com, err := contactService.CreateCommunity(arg)
	if err != nil {
		global.ResponseFail(w, err.Error())
	} else {
		global.ResponseOk(w, com, "New Group Success")
	}
}

func JoinCommunity(w http.ResponseWriter, req *http.Request) {

	// req.ParseForm()
	// userId_str := req.PostForm.Get("userid")
	// userId, _ := strconv.ParseInt(userId_str, 10, 64)
	// dstid_str := req.PostForm.Get("dstid")
	// dstid, _ := strconv.ParseInt(dstid_str, 10, 64)
	// err := contactService.JoinCommunity(userId, dstid)
	// if err != nil {
	// 	global.ResponseFail(w, err.Error())
	// } else {
	// 	global.ResponseOk(w, nil, "Add Friend Success")
	// }

	var arg request.ContactArg
	if err := utils.Bind(req, &arg); err != nil {
		global.ResponseFail(w, err.Error())
		return
	}
	err := contactService.JoinCommunity(arg.Userid, arg.Dstid)
	AddGroupId(arg.Userid, arg.Dstid)
	if err != nil {
		global.ResponseFail(w, err.Error())
	} else {
		global.ResponseOk(w, nil, "")
	}
}

func AddFriend(w http.ResponseWriter, req *http.Request) {

	// req.ParseForm()
	// userId_str := req.PostForm.Get("userid")
	// userId, _ := strconv.ParseInt(userId_str, 10, 64)
	// dstemail := req.PostForm.Get("dstemail")
	// err := contactService.AddFriend(userId, dstemail)
	// if err != nil {
	// 	global.ResponseFail(w, err.Error())
	// } else {
	// 	global.ResponseOk(w, nil, "Add Friend Success")
	// }

	// 定义一个参数结构体
	var arg request.AddFriendReq
	if err := utils.Bind(req, &arg); err != nil {
		global.ResponseFail(w, err.Error())
		return
	}
	//调用service
	err := contactService.AddFriend(arg.Userid, arg.DstEmail)
	if err != nil {
		global.ResponseFail(w, err.Error())
	} else {
		global.ResponseOk(w, nil, "Add Friend Success")
	}
}
