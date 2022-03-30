package request

type ContactArg struct {
	PageArg
	Userid int64 `json:"userid" form:"userid"`
	Dstid  int64 `json:"dstid" form:"dstid"`
}

type AddFriendReq struct {
	PageArg
	Userid   int64  `json:"userid" form:"userid"`
	DstEmail string `json:"dstemail" form:"dstemail"`
}
