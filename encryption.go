<<<<<<< HEAD
package main

import (
	"crypto/md5"
	"encoding/hex"
)

//返回一个32位md5加密后的字符串
func Md5Encode32(password string) string {
	h := md5.New()
	h.Write([]byte(password))
	return hex.EncodeToString(h.Sum(nil))
}

//返回一个16位md5 加密后的字符串
func MD5Encode16(password string) string {
	return MD5Encode16(password)[8:24]
}
=======
package main

import (
	"crypto/md5"
	"encoding/hex"
)

//返回一个32位md5加密后的字符串
func Md5Encode32(password string) string {
	h := md5.New()
	h.Write([]byte(password))
	return hex.EncodeToString(h.Sum(nil))
}

//返回一个16位md5 加密后的字符串
func MD5Encode16(password string) string {
	return MD5Encode16(password)[8:24]
}
>>>>>>> se_project/back_develop_v1.0.0_+7
