package service

import (
	"GatorChat/database"
	"GatorChat/model"
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"
)

type ContactService struct{}

//自动添加好友
func (service ContactService) AddFriend(userid int64, dstemail string) error {

	var dst_user model.User

	if _, err := database.DB.Where("email = ?", dstemail).Get(&dst_user); err != nil || dst_user.Id == 0 {
		log.Println(err.Error())
		return errors.New("user not exists")
	}
	fmt.Println("Receive Add Friend Requst from", userid, " to ", dst_user.Id)
	//如果加自己
	if userid == dst_user.Id {
		return errors.New("you can not add yourself as a friend")
	}

	//判断是否已经加了好友
	tmp := model.Contact{}
	//查询是否已经是好友
	// 条件的链式操作
	_, err := database.DB.Where("ownerid = ?", userid).And("dstid = ?", dst_user.Id).And("cate = ?", model.CONCAT_CATE_USER).Get(&tmp)
	if err != nil {
		return err
	}
	//获得1条记录
	//如果存在记录说明已经是好友了不加
	if tmp.Id > 0 {
		return errors.New("this user is already your friend")
	}
	//事务,
	session := database.DB.NewSession()
	_ = session.Begin()
	//插自己的
	_, e2 := session.InsertOne(model.Contact{
		Ownerid:  userid,
		Dstid:    dst_user.Id,
		Cate:     model.CONCAT_CATE_USER,
		Createat: time.Now(),
	})
	//插对方的
	_, e3 := session.InsertOne(model.Contact{
		Ownerid:  dst_user.Id,
		Dstid:    userid,
		Cate:     model.CONCAT_CATE_USER,
		Createat: time.Now(),
	})
	//没有错误
	if e2 == nil && e3 == nil {
		//提交
		_ = session.Commit()
		return nil
	} else {
		//回滚
		_ = session.Rollback()
		if e2 != nil {
			return e2
		} else {
			return e3
		}
	}
}

func (service ContactService) SearchComunity(userId int64) []model.Community {
	conconts := make([]model.Contact, 0)
	comIds := make([]int64, 0)

	_ = database.DB.Where("ownerid = ? and cate = ?", userId, model.CONCAT_CATE_COMUNITY).Find(&conconts)
	for _, v := range conconts {
		comIds = append(comIds, v.Dstid)
	}
	coms := make([]model.Community, 0)
	if len(comIds) == 0 {
		return coms
	}
	_ = database.DB.In("id", comIds).Find(&coms)
	return coms
}

func (service ContactService) GetCommunityPeopleNum(communitys []model.Community) (GroupPeopleMap map[int64]int, err error) {
	var community_ids = "("
	for _, row := range communitys {
		community_ids += strconv.FormatInt(row.Id, 10) + ","
	}
	community_ids = strings.Trim(community_ids, ",") + ")"
	query := "select dstid, count(*) as num from contact where cate = 2 and dstid in " + community_ids + " GROUP BY dstid"
	results, err := database.DB.QueryString(query)
	GroupPeopleMap = make(map[int64]int)
	for _, val := range results {
		dstid, _ := strconv.ParseInt(val["dstid"], 10, 64)
		num, _ := strconv.Atoi(val["num"])
		GroupPeopleMap[dstid] = num
	}
	return
}

func (service ContactService) SearchComunityIds(userId int64) (comIds []int64) {
	//todo 获取用户全部群ID
	conconts := make([]model.Contact, 0)
	comIds = make([]int64, 0)

	_ = database.DB.Where("ownerid = ? and cate = ?", userId, model.CONCAT_CATE_COMUNITY).Find(&conconts)
	for _, v := range conconts {
		comIds = append(comIds, v.Dstid)
	}
	return comIds
}

func (service ContactService) JoinCommunity(userId, comId int64) error {
	cot := model.Contact{
		Ownerid: userId,
		Dstid:   comId,
		Cate:    model.CONCAT_CATE_COMUNITY,
	}
	_, _ = database.DB.Get(&cot)
	fmt.Println("Receive Join Group Requst from", userId, " to ", cot.Id)
	if cot.Id == 0 {
		cot.Createat = time.Now()
		_, err := database.DB.InsertOne(cot)
		return err
	} else {
		return nil
	}

}

func (service ContactService) CreateCommunity(comm model.Community) (ret model.Community, err error) {
	if len(comm.Name) == 0 {
		err = errors.New("please input group name")
		return ret, err
	}
	if comm.Ownerid <= 0 {
		err = errors.New("please login first")
		return ret, err
	}
	com := model.Community{
		Ownerid: comm.Ownerid,
	}
	num, _ := database.DB.Count(&com)

	if num > 4 {
		err = errors.New("you already created too many groups")
		return com, err
	} else {
		comm.Createat = time.Now()
		session := database.DB.NewSession()
		_ = session.Begin()
		_, err = session.InsertOne(&comm)
		if err != nil {
			_ = session.Rollback()
			return com, err
		}
		_, err = session.InsertOne(
			model.Contact{
				Ownerid:  comm.Ownerid,
				Dstid:    comm.Id,
				Cate:     model.CONCAT_CATE_COMUNITY,
				Createat: time.Now(),
			})
		if err != nil {
			_ = session.Rollback()
		} else {
			_ = session.Commit()
		}
		return comm, err
	}
}

func (service ContactService) SearchFriend(userId int64) []model.User {
	conconts := make([]model.Contact, 0)
	objIds := make([]int64, 0)
	_ = database.DB.Where("ownerid = ? and cate = ?", userId, model.CONCAT_CATE_USER).Find(&conconts)
	for _, v := range conconts {
		objIds = append(objIds, v.Dstid)
	}
	coms := make([]model.User, 0)
	if len(objIds) == 0 {
		return coms
	}
	_ = database.DB.In("id", objIds).Find(&coms)
	return coms
}
