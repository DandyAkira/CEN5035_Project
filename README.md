# Sprint 4

## Team members
|  NAME   | GITHUB NAME  | EMAIL | DUTY |
|  :----:  | :----:  | :----:  | :----:  |
| Ruoyang Xiong  | KalmanXiong | xiongruoyang@ufl.edu | Front-End |
| Yandi Ma  | DandyAkira | yandi.ma@ufl.edu | Back-End |
| Zixuan Feng  | ErerF | zixuan.feng@ufl.edu | Front-End |
| Jiaqi Cheng  | TR280 | jiaqicheng@ufl.edu | Back-End |

## Cypress Test

### How to run the test?

- run Gatorchat
```
go run main.go
```
- execute the following command to open Cypress
```
yarn run cypress open
```
- click on the test file (test.js) to start the test

### Demo

https://github.com/DandyAkira/CEN5035_Project/blob/back_develop/demo/Sprint4-Cypress.mp4

## Unit Test Demo

https://user-images.githubusercontent.com/54897058/163485616-75a87147-6d76-4c9a-91a3-ecaadbb9d872.mp4

## API doc for the Program

https://easydoc.net/s/88012132

## Project Board Link
https://github.com/DandyAkira/CEN5035_Project/projects

## Back End Log

### Update (April 15 2022)
 - The logic for background parsing of parameters in request messages has been optimized [see model/request/ and utils/parsearg.go]

### Update (April 14 2022)

 - Add test cases for adding friends
 - Background HTTP request packet format optimization

#### test adding friends
the first 2 users are chosen to send add friend request to himself, all other users, and users who already is their friend.
![image](https://user-images.githubusercontent.com/54897058/163479578-550bdd9e-53cd-4bb5-814a-af467411fa7f.png)


each of these 2 users should receive several response from server:
```
{"code":0,"msg":"Add Friend Success"}
{"code":-1,"msg":"you can not add yourself as a friend"}
{"code":-1,"msg":"this user is already your friend"}
```
and the server's terminal will show serveral info like:
```
Receive Add Friend Requset from: userid to dstid
```
The test results showed no errors.

# Sprint 3

## Functions

- [x] Register
- [x] Login
- [x] Private Chat
- [x] Group Chat
- [ ] ~~Public Chat~~    (Deleted)
- [x] Friend System
- [x] Send Emoji
- [x] Send Picture
- [x] Change Nick Name
- [x] Change Avatar

## Possible Future Functions

- [x] Send Video
- [ ] Voice Chat

## How to run the app?

### The preparatory work

1. Download the code from main branch
2. create a new database called "gatorchat" in MySQL by using `CREATE DATABASE gatorchat`
3. open database/db.go and modify the configuration statements (name and password) according to your own MySQL settings
![image](https://user-images.githubusercontent.com/54897058/161132955-70296cce-2084-4a2e-9330-d42b0af8ab94.png)

### Run Program

1. run the app by typing
```
go run main.go
```

2. open a browser and jump to http://127.0.0.1 then have fun :)

## Screenshots for the program

### Register

![image](https://github.com/DandyAkira/CEN5035_Project/blob/back_develop/screenshots/register.PNG)

### Login

![image](https://github.com/DandyAkira/CEN5035_Project/blob/back_develop/screenshots/login.PNG)

### Main Page

![image](https://github.com/DandyAkira/CEN5035_Project/blob/back_develop/screenshots/contact.PNG)

### Change nickname

![image](https://github.com/DandyAkira/CEN5035_Project/blob/back_develop/screenshots/change_nickname.PNG)

### Add Friend

![image](https://user-images.githubusercontent.com/54897058/161130588-bc01bf2b-5554-40b3-9af6-e72218929c3f.png)

### Private Chat

![image](https://github.com/DandyAkira/CEN5035_Project/blob/back_develop/screenshots/chat.PNG)

### Create New Group

![image](https://github.com/DandyAkira/CEN5035_Project/blob/back_develop/screenshots/create_grp.PNG)

### Join Group

![image](https://github.com/DandyAkira/CEN5035_Project/blob/back_develop/screenshots/join_grp.PNG)


### Group Chat

![image](https://github.com/DandyAkira/CEN5035_Project/blob/back_develop/screenshots/group_chat.PNG)

## Back End Log

### Update (March 30 2022)

 - Add Test Cases of "Change Nickname" and "Create New Group"
 - Optimized some background logic

#### About Test Cases of "Change Nickname"
##### Test file source code : test/change_name_test.go
The test file will send 3 requests to change the nickname on behalf of each user in the database, They will request their nickname be changed to NULL, the same name to original one, and a different name, respectively.
They each receive three responses from the server, where code = 0 means success and code = -1 means fail:
 - "code":-1,"msg":"new name same to current one"
 - "code":-1,"msg":"illegal nickname"
 - "code":0,"msg":"Change Name Sucess"

The results are as follows, there is no fault during the tests:

![image](https://user-images.githubusercontent.com/54897058/160928516-05ac0463-9213-4d9c-a96f-60fa02642436.png)

#### About Test Cases of "Create New Group"
##### Test file source code : test/create_group_test.go
The test file will send 7 requests to to create new groups on behalf of each user in the database, since the backend logic limits the number of groups that each user can create to 5, so after there are 5 groups created by the same user, he can not create groups anymore, for each user they will receive responses from server as follows:
 - {"code":0,"msg":"New Group Success","data":{"id":1,"name":"group_sEdQ","ownerid":1,"icon":"/asset/images/community.png","cate":0,"memo":"","createat":"2022-03-30T17:00:00.3993923-04:00"}}
 - {"code":-1,"msg":"you already created too many groups"}

The results of testing create group cases of one user is as follows, no fault happens:

![image](https://user-images.githubusercontent.com/54897058/160930824-6e1629b0-9b41-4982-ac4b-bfa0a1c4424c.png)

### Update (March 23 2022)
#### About Avatars/icons
Now users' default icon is a gator icon, users can also change their icon by using the images under /assets/images, and can be normally and correctly shown on other clients' sides. Fully customed avatar still can not be correctly displayed on other clients.

### Update (March 22 2022)

 - Users can change their nickname in profile page
 - Password encryption implemented

#### Password encryption
Users' password will not be directly saved in database, it will be mixed with a random salt string and will be MD5 encrypted. The salt string will change everytime the user login, so the encrypted password saved in the database will keep changing.

### Update (March 21 2022)

 - Add Friend via email (no need to know friend's ID)
 - Increase jump correlation between pages

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
- [x] Change Nick Name
- [ ] Change Avatar

## Possible Future Functions

- [ ] Send Video
- [ ] Voice Chat

## FrontEnd

### How to run Cypress test
- run Gatorchat
```
go run main.go
```
- execute the following command to open Cypress
```
yarn run cypress open
```
- click on the test file (sprint2_test.js) to start the test

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

### For Sprint 1, please see Sprint1.md

Have fun :)
