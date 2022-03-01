# Back End Develop Log

Demo for sprint1: https://youtu.be/LD7eqryyua0

 ### Functions:

  - [x] private chat
  - [x] public chat
  - [x] change username
  - [ ] friend system
  - [ ] group chat

 ### Possible functions

 - [ ] file transfer

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

## == first demo ==

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
