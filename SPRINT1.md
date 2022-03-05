# What is Accomplished at Back End side in Sprint1

Preparing to develop an Instant messaging software like Telegram

Demo for the frontend: https://www.youtube.com/watch?v=WlyXMhoCkEc&t=4s
Demo for the backend: https://youtu.be/LD7eqryyua0

## TODOs:

### Back End:
#### Functions:

  - [x] private chat
  - [x] public chat
  - [x] friend system
  - [ ] group chat
#### Possible functions

 - [ ] file transfer

### Front End:
#### Functions:

  - [ ] register
  - [ ] login
  - [ ] private chat

#### How to run
```
$ cd frontend
```
```
$ yarn install
```
```
$ yarn start
```
  - [x] private chat
  - [x] public chat
  - [x] change username


## Futrue Functions
  - [ ] friend system
  - [ ] group chat
  - [ ] file transfer (possible)
  - [ ] voice chat (possible)

# Back End Develop Log

### what's new 1.25.2022 ###

now users can change their username and chat with others by selecting user ID
to customize username, you can fo it when you run a client by:
     ```
    ./client -name MyUserName
    ```
or you can follow the main menu to do this.

for more parameters instructions, type:
    ```
    ./client -h
    ```
Have Fun :)

## first demo

### how to build and run

1. clone the back-develop branch from github

2. make sure you have golang environment

3. open terminal from the root path of the code

4. build server by typing into the terminal

    ```go
    go build -o server Server.go User.go
    ```

    

5. build client by typing into the terminal

    ```go
    go build -o client Client.go
    ```

    

6. run the server and client in different terminals

    ```
    ./server
    ```

    ```
    ./client
    ```

7. feel free to run other client in other terminals

8. follow the menu and the instructions

Have fun :)
