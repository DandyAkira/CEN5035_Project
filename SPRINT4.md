# Sprint 4
## Team members
|  NAME   | GITHUB NAME  | EMAIL | DUTY |
|  :----:  | :----:  | :----:  | :----:  |
| Ruoyang Xiong  | KalmanXiong | xiongruoyang@ufl.edu | Front-End |
| Yandi Ma  | DandyAkira | yandi.ma@ufl.edu | Back-End |
| Zixuan Feng  | ErerF | zixuan.feng@ufl.edu | Front-End |
| Jiaqi Cheng  | TR280 | jiaqicheng@ufl.edu | Back-End |

## Description

In the project, we designed a project named GatorChat.By using the Web-App, users can add friends by email, and send messages, emojis, and images to their friends. Besides, they can build groups or join groups by id. People in the same group can chat with others.

We implemented the backend by using Golang, and implement the frontend by using NodeJS. We used Cypress and Jtest to test our frontend code.

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

## Demo video functionality

https://user-images.githubusercontent.com/37530151/164331865-65cfa140-a09a-4c1a-a895-641070567b45.mp4
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

### Cypress Test Demo

https://user-images.githubusercontent.com/47899013/164157706-8aa5cae3-bc3d-491e-976b-4aabebcd7bde.mp4
## Frontend Unit Test (Jest)

###  How to run Jest?

```
yarn add --dev jest
```

```
yarn test
```

### Testing result

![image](https://raw.githubusercontent.com/KalmanXiong/img_floder/main/WechatIMG2.png)
## Backend Unit Test Demo

https://user-images.githubusercontent.com/37530151/164356858-f913e2ee-bfc4-4c16-8bb8-60ba2c93a018.mp4

## API doc for the Program

https://easydoc.net/s/88012132

## Project Board Link
https://github.com/DandyAkira/CEN5035_Project/projects

## Sprint4 deliverables Link
https://github.com/DandyAkira/CEN5035_Project
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

Have fun :)
