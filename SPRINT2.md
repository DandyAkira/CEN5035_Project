# Team members
|  NAME   | GITHUB NAME  | EMAIL |
|  :----:  | :----:  | :----:  |
| Ruoyang Xiong  | KalmanXiong | xiongruoyang@ufl.edu |
| Yandi Ma  | DandyAkira | yandi.ma@ufl.edu |
| Zixuan Feng  | ErerF | zixuan.feng@ufl.edu |
| Jiaqi Cheng  | TR280 | jiaqicheng@ufl.edu |

# Sprint2

### Sprint2 Demo

https://youtu.be/QZf61EtCu3o

### API doc link

 https://easydoc.net/s/88012132/

## Functions

- [x] Register
- [x] Login
- [x] Private Chat
- [x] Group Chat
- [ ] ~~Public Chat~~    (Deleted)
- [x] Friend System
- [x] Send Emoji
- [x] Send Picture
- [ ] Change Nick Name
- [ ] Change Avatar

## Possible Future Functions

- [ ] Send Video
- [ ] Voice Chat

## How to build?
- Set DBMS: in our project, we use MySql. Create a new empty database named "gatorchat".
- Open ./database/db.go , set "Driver", "DsName" with your own mysql username and password
- cd to the root folder, then run our application with
```
go run main.go
```
- Have fun with it ^^

## FrontEnd

### Cypress component test

Demo for cypress test: https://www.youtube.com/watch?v=Zpf2TR5T1Bs

How to run Cypress test?

- run Gatorchat
```
go run main.go
```
- execute the following command to open Cypress
```
yarn run cypress open
```
- click on the test file (sprint2_test.js) to start the test

### Units test

We have some unit tests by using Jest. The first step is to install Jest:
```
yarn add --dev jest
```
Then, you could run Jest by using the code:
```
yarn jest
```
We picked some functions in the core codes(mui.js) of the frontend. Then we use Jest to verify the validity and repeatability of these cases. Here is our results below.
![image](https://raw.githubusercontent.com/KalmanXiong/img_floder/main/WechatIMG2.png)

## BackEnd

### Update (March 1 2022)

 - now any domain name strating with `http://127.0.0.1` can leads to the login page
 - database can be customed now by modifying the Database Init Parameters in db.go under database folder
 - now the emial field in database is VARCHAR(150)
 - add new unit test (see unit test description session)

### Unit test description

unit test provided in main_test.go under test folder
since the chatting API requires token of the sender which is changed every time a user login, and the access of websockets between two users can not be acquired by other program, so we can not test chat API
Here, we provide unit test for register and login at high cocurrency. using

```go
func TestRegister(t *testing.T)
```

and

```go
func TestLogin(t *testing.T)
```

And we found that the email field should be longer since if the length of user email is more than 50, the user will never login successfully since the email in database is wrong.
After modifying, the test cases runs well and all unit test cases are successfully recorded
![image](https://user-images.githubusercontent.com/54897058/156042417-69a0af7e-2fb9-4f64-8ca0-244d0a304c5a.png)


### Update (Feb 23 2022)

 - This is the alpha version of back_end and Gator Chat
 - Ready to run on browser!
 - Basic Function completed
 - connected to local Mysql
 - default login page 127.0.0.1/user/login.shtml

------------------------------------------------------

# Old Version and Logs Below

## BackEnd

### Update Log (Feb 02 2022)

 - Build and Run on Windows Platform
 - User Register and Login (Access server with a user name is not being used for the first time will be registered as a new user directly)

## How to build and run

### Windows

#### Build Server

In the root directory of the program file, input the following into terminal

```
go build Server.go User.go
```

#### Build Client

In the root directory of the program file, input the following into terminal

```
go build Client.go
```

#### Run Server

double click the Server.exe generated by last step or input the following into terminal

```
.\Server.exe
```

#### Run Client

input the following into terminal, replace [My Username] and [My Password] into your own's.

```
.\Client.exe -uname [My Username] -pwd [My Password]
```

### Linux

#### Build Server

In the root directory of the program file, input the following into terminal

```
go build -o server Server.go User.go
```

#### Build Client

In the root directory of the program file, input the following into terminal

```
go build -o client Client.go
```

#### Run Server

double click the Server.exe generated by last step or input the following into terminal

```
./server
```

#### Run Client

input the following into terminal, replace [My Username] and [My Password] into your own's.

```
./client -uname [My Username] -pwd [My Password]
```
