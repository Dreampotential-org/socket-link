var express = require("express");
var WebSocket = require("ws");
var app = express();
var server = new WebSocket.Server({ server: app.listen(3333) });

app.use(express.static("client"));

console.log("socket server is running on port 3333");

var users = [];
var queue_slots = [];

// time in seconds
const maxTime = 1200;
const userList = [];
const activeUserList = [];
var socket_list = [];
var queue_slots = 20;
var activeUsers = populate_active_users();

function populate_active_users() {
  var setup_queue = [];
  for (var i = 0; i < queue_slots; i++) {
    setup_queue.push({
      videoUrl: "placeholder1",
      user: null,
      name: null,
      pic: null,
      connection: null,
      time: null,
    });
  }
  return setup_queue;
}

// server and client connection at server-side
server.on("connection", (socket) => {
  socket.id = +new Date() + "sds5000";
  console.log("New Socket Id " + socket.id);
  socket.on("message", (message) => {
    var data = JSON.parse(message);
    console.log("data in server file =>", data);
    console.log("socket id all user =>", socket.id);
    // keep track of who we have heard from
    if (data.alive) {
      console.log("ALIVE");
      socket.last_heard = new Date();
      return;
    }

    if (data.action_login) {
      // login event we clean about client
      console.log("login event", data.username);
      socket._user_info = {
        user: data.username,
        pic: data.pic,
        name: data.name,
        connection: socket,
        time: +new Date(),
      };
      //   console.log("sockety data set here =>", socket);
      socket_list.push(socket);
    }

    let dataValues = Object.values(data);
    let dataKeys = Object.keys(data);
    if (dataKeys[0] === "action_join_conference" && dataValues[0] === true) {
      console.log("enter in queue data set");
      socket.last_heard = new Date();
      // XXX check if user is already part of queue list.
      //   console.log(socket._user_info);
      users.push(socket._user_info);
    }

    // server.clients.forEach(function each(client) {
    //     if (client !== ws && client.readyState === WebSocket.OPEN) {
    //         client.send(data);
    //     }
    // });
  });

  socket.on("sendMessage", function (from, msg) {
    console.log(`Received message from ${from}: ${msg}`);
    // Relay message to all clients
    // socket.forEach((socket) => {
    //     socket.emit("sendMessage", from, msg);
    // });
  });
  // socket.on("msg", function (from, msg) {
  //     // `this` refers to the WebSocketWrapper instance
  //     console.log(`Received message from ${from}: ${msg}`);
  //     // Relay message to all clients
  //     sockets.forEach((socket) => {
  //         socket.emit("msg", from, msg);
  //     });
  // });
});

// get queue state when all current user store in active user
function get_queue_stats() {
  var active_users = [];
  var queued_users = [];
  for (var user of users) {
    // console.log("Active User", user);
    queued_users.push({
      name: user.name,
      pic: user.pic,
      time_left: maxTime * 1000 - (new Date() - user.time),
    });
  }
  for (var i = 0; i < activeUsers.length; i++) {
    if (activeUsers[i].user != null) {
      active_users.push({
        name: activeUsers[i].name,
        time_left: maxTime * 1000 - (new Date() - activeUsers[i].time),
        pic: activeUsers[i].pic,
      });
    }
  }
  return {
    queued_users: queued_users,
    active_users: active_users,
  };
}

// when active user interval complited then queue user call
const QueueIntervalSet = () => {
  setInterval(function () {
    // console.log(socket_list.length);
    var stats = get_queue_stats();
    console.log("Active Users", stats.active_users.length);

    for (var sock of socket_list) {
      sock.send(
        JSON.stringify({
          command: "queue_info",
          active_users: JSON.stringify(stats.active_users),
          queued_users: JSON.stringify(stats.queued_users),
        })
      );
    }
  }, 3000);
};

// get active and queue user from the client side
const GetUserData = () => {
  setInterval(function () {
    var stats = get_queue_stats();
    // console.log("Users in queue " + stats.queued_users.length +
    //     " active " + stats.active_users.length);
    for (var i = 0; i < users.length; i++) {
      // there is an active slot
      if (activeUsers[i].user === null) {
        if (!users[i]) continue;
        if (users.length > 0) {
          // copy user into active_users
          activeUsers[i].user = users[i].user;
          activeUsers[i].name = users[i].name;
          activeUsers[i].pic = users[i].pic;
          activeUserList.push(userList[i]);
          activeUsers[i].connection = users[i].connection;

          // remove user
          users.shift();

          activeUsers[i].time = new Date();
          console.log("GO live");
          activeUsers[i].connection.send(
            JSON.stringify({ command: "go_live" })
          );
          activeUsers[i].connection.send(
            JSON.stringify({ command: "INPUT_TEXT" })
          );
        }
      }
      // active user time expired(every seconds time out call)
      if (checkTimeOut(activeUsers[i])) {
        activeUsers[i].user = null;
        console.log("GO expired");
        //activeUserList.shift();
        activeUsers[i].connection.send(JSON.stringify({ command: "expired" }));
        activeUsers[i].connection = null;
      }
    }
  }, 1000);
};

// check this time out when user add
function checkTimeOut(user) {
  if (user.connection === null) return false;
  const currentTime = new Date();
  console.log(user.name + " active for - " + (currentTime - user.time));
  console.log(
    "get currentTime here =>",
    currentTime - user.connection.last_heard
  );

  if (currentTime - user.connection.last_heard >= 10000) {
    console.log("SOCKET IS NOT ALIVEEEE");
    return true;
  }

  if (currentTime - user.time >= maxTime * 1000) {
    console.log("Expired");
    return true;
  } else {
    //console.log("not Expired")
    return false;
  }
}

QueueIntervalSet();
GetUserData();
