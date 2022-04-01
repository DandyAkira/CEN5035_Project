package encrypt

import (
	"crypto/md5"
	"encoding/hex"
	"strings"
)

func Md5Encode(data string) string {
	h := md5.New()
	h.Write([]byte(data)) // 需要加密的字符串为 123456
	cipherStr := h.Sum(nil)

	return hex.EncodeToString(cipherStr)

}
func MD5Encode(data string) string {
	return strings.ToUpper(Md5Encode(data))
}

func ValidatePasswd(plainpwd, salt, password string) bool {
	return Md5Encode(plainpwd+salt) == password
}
func MakePasswd(plainpwd, salt string) string {
	return Md5Encode(plainpwd + salt)
}
