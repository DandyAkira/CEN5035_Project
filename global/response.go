package global

import (
	"GatorChat/model/response"
	"encoding/json"
	"log"
	"net/http"
)

func ResponseFail(w http.ResponseWriter, msg string) {
	Response(w, -1, msg, nil)
}
func ResponseOk(w http.ResponseWriter, data interface{}, msg string) {
	Response(w, 0, msg, data)
}

func ResponseOkList(w http.ResponseWriter, lists interface{}, total interface{}) {
	//分页数目,
	ResponseList(w, 0, lists, total)
}

func Response(writer http.ResponseWriter, code int, msg string, data interface{}) {
	h := response.H{
		Code: code,
		Msg:  msg,
		Data: data,
	}
	ret, err := json.Marshal(h)
	if err != nil {
		log.Println(err.Error())
	}
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	_, _ = writer.Write(ret)
}

func ResponseList(w http.ResponseWriter, code int, data interface{}, total interface{}) {
	w.Header().Set("Content-Type", "application/json")
	//设置200状态
	w.WriteHeader(http.StatusOK)
	//输出
	//定义一个结构体
	//满足某一条件的全部记录数目
	//测试 100
	//20
	h := response.H{
		Code:  code,
		Rows:  data,
		Total: total,
	}
	//将结构体转化成JSOn字符串
	ret, err := json.Marshal(h)
	if err != nil {
		log.Println(err.Error())
	}
	//输出
	_, _ = w.Write(ret)
}
