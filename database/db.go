package database

import (
	"GatorChat/model"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/go-xorm/xorm"
)

var (
	Driver = "mysql"
	DsName = "root:myd42424@tcp(127.0.0.1:3306)/testchat?charset=utf8"
	DB     *xorm.Engine
	DBErr  error
)

func init() {
	DB, DBErr = xorm.NewEngine(Driver, DsName)
	if DBErr != nil {
		log.Fatal(DBErr)
	}
	//DB.ShowSQL(true)
	DB.SetMaxOpenConns(2)
	_ = DB.Sync2(
		new(model.User),
		new(model.Community),
		new(model.Contact),
	)
	log.Println("init database success")
}
