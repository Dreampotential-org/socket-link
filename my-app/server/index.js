/* global localStorage, */
var express = require('express');
const path = require('path');
var localStorage = require('node-localstorage');
var WebSocket = require('ws');
var app = express();

app.use(express.static(path.join(__dirname, '../build')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'client.html'));
});

var server = new WebSocket.Server({ server: app.listen(3333) });

console.log('socket server is running on port 3333');

const users = [];
const maxTime = 60000;
const userList = [];
const activeUserList = [];
const timeStamp = [];
const activeUsers = [{
    videoUrl: "https://en.wikipedia.org/wiki/Leprus_intermedius",
    user: null,
    connection: null,
    time: null
},
{
    videoUrl: "https://en.wikipedia.org/wiki/Bishkek-1_railway_station",
    user: null,
    connection: null,
    time: null
},
{
    videoUrl: "https://en.wikipedia.org/wiki/Schefflera_pueckleri",
    user: null,
    connection: null,
    time: null
}];

let RoomName = "";
server.on('connection', (socket) => {
    socket.on('message', message => {
        //push users data in web socket
        // console.log("message data =>", JSON.stringify(JSON.parse(message).roomName));
        let NewSetMessage = JSON.stringify(JSON.parse(message).name).replace(/"/g, '');
        RoomName = JSON.stringify(JSON.parse(message).roomName).replace(/"/g, '');
        users.push({
            user: NewSetMessage,
            connection: socket
        })
        userList.push(NewSetMessage);
    });

    setInterval(() => {
        let GoLive = "Go Live";
        let CallClose = "Close Call";
        let expiredActive = "expiredActive";
        let expiredQueue = "expiredQueue";
        for (var i = 0; i < activeUsers.length; i++) {
            if (activeUsers[i].user === null) {
                if (users.length > 0) {
                    activeUsers[i].user = users[0].user;
                    activeUserList.push(userList[0]);
                    activeUsers[i].connection = users[0].connection;
                    users.shift();
                    userList.shift();
                    activeUsers[i].time = new Date();
                    timeStamp.push(activeUsers[0].time);
                    activeUsers[i].connection.send('{"videoUrl":' + JSON.stringify(activeUsers[i].videoUrl) + '}');
                }
            } else if (checkTimeOut(activeUsers[i])) {
                // console.log("data time up set here =>", (maxTime * 1000) - (new Date() - activeUsers[i].time));
                activeUsers[i].user = null;
                activeUserList.shift();
                activeUsers[i].connection.send("Times Up!")
            }
        }
        socket.send('{ "users":' + JSON.stringify(userList) +
            ',"activeUsers":' + JSON.stringify(activeUserList) +
            ',"timeStamp":' + JSON.stringify(timeStamp) +
            ',"go_live":' + JSON.stringify(GoLive) +
            ',"call_close":' + JSON.stringify(CallClose) +
            ',"expired_Active":' + JSON.stringify(expiredActive) +
            ',"expired_Queue":' + JSON.stringify(expiredQueue) +
            ',"roomName":' + JSON.stringify(RoomName)
            + '}');
        // if (RoomName.length > 0) {
        //     socket.send('{"roomName":' + JSON.stringify(RoomName) + '} ')
        // }
    }, 2000)

    // set current user timeout
    function checkTimeOut(user) {
        const currentTime = new Date()
        if (currentTime - user.time >= maxTime) {
            return true;
        } else {
            return false;
        }
    }
});