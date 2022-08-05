/* This is the start of a file that should be converted into functional tests

    XXX need to start and stop index.js server on demand between
    each test.
*/


var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');

    // First we connect a socket an set the name
    socket.emit("saveName", "AR");

    // next we create a conference room...
    socket.emit("createConference", {
      conferenceName: 'test1'
      timeLimit: 10,
      slots: 10,
    });

    // now we need to wait some time for the createConference to happen.
    // XXX get callback verification then we join the conference room.
    // XXX the room should be the the ID from createConference
    // XXX rename joinRoom api -> joinConference
    socket.emit("joinRoom", {
      room,
    });

    connection.on('alive', function(data) {
        console.log(data)
    })

    connection.on('queue', function(data) {
        console.log(data)
    })

    connection.on('roomDetail', function(data) {
        console.log(data)
    })

    connection.on('rooms', function(data) {
        console.log(data)
    })


    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
});

client.connect('ws://localhost:4000/');
