import { Server } from "socket.io";
import express from "express";
import cors from "cors";
const app = express();
const maxTime = 100000; //10 Seconds
const maxSlots = 4;
let sockets = [];
let availableRooms = [];
let aliveUsers = [];
let queueUsers = [];
let slots = 0;
app.use(cors());
app.use(express.json());
const server = app.listen(4000, () => {
  console.log("Server is up & running *4000");
});
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const entryTime = +new Date(Date.now());
  const exitTime = +new Date(Date.now()) + maxTime;
  // sockets.push({ id: socket.id, socket, entryTime, exitTime });
  // if (aliveUsers.length < maxSlots) {
  //   aliveUsers.push({ id: socket.id, socket, entryTime, exitTime });
  // } else {
  //   queueUsers.push({ id: socket.id, socket, entryTime, exitTime });
  // }
  socket.on("saveName", (name) => {
    socket.data = { name };
  });
  socket.on("disconnect", () => {
    // console.log("user disconnected", socket.id);
    // aliveUsers = aliveUsers.filter(function (obj) {
    //   return obj.id !== socket.id;
    // });
    // queueUsers = queueUsers.filter(function (obj) {
    //   return obj.id !== socket.id;
    // });
    // availableRooms = availableRooms.filter(function (obj) {
    //   return obj.id !== socket.id;
    // });
  });

  sockets.push({ id: socket.id, socket, entryTime, exitTime });
  socket.on("createConference", (data) => {
    socket.data.entryTime = +new Date(Date.now());
    console.log(data);
    socket.data.exitTime = +new Date(Date.now()) + data.timeLimit;
    socket.join(data.conferenceName);
    if (!availableRooms.find((room) => room.room === data.conferenceName))
      availableRooms.push({ id: socket.id, room: data.conferenceName });
  });
  socket.on("joinRoom", async (data) => {
    let roomLength = await io.in(data.room).fetchSockets();
    if (roomLength && roomLength.length < maxSlots) {
      socket.data.entryTime = +new Date(Date.now());
      socket.data.exitTime = +new Date(Date.now()) + data.timeLimit;
      socket.join(data.room);
    } else {
      queueUsers.push({ id: socket.id, socket });
    }
    console.log("Socket Data", socket);
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
  });
});

setInterval(async () => {
  // console.log("sockets", io.sockets.adapter.rooms);
  // sockets.map((socket) => {
  //   socket.socket.emit("rooms", availableRooms);
  // });
  // console.log(
  //   availableRooms.map(async (room) => {
  //     return {
  //       room: room.room,
  //       people: io.sockets.adapter.rooms.get(room.room).length,
  //     };
  //   })
  // );

  const rooms = [];
  for (let room of availableRooms) {
    // rooms.push({
    let room1 = room.room;
    let people = await io.in(room.room).fetchSockets();
    const currentTime = +new Date(Date.now());

    people = people.map((socket) => {
      // console.log(socket.entryTime);
      socket.data.timeLeft = socket.data.exitTime - currentTime;
      return socket.data;
    });
    // });
    // console.log(people);
    rooms.push({ room: room1, people: people });
  }
  console.log(rooms);
  // console.log(rooms);
  io.sockets.emit("rooms", rooms);
  // availableRooms.map(({ room }) => {
  //   io.sockets.emit("peopleInRooms", {
  //     room,
  //     people: io.sockets.adapter.rooms[room].length,
  //   });
  // });
}, 1000);

// setInterval(() => {
//   // console.log("Current Users", sockets.length);
//   const currentTime = +new Date(Date.now());
//   const removeSockets = aliveUsers.filter((socket) => {
//     console.log(currentTime, socket.exitTime);
//     return currentTime > socket.exitTime;
//   });
//   if (removeSockets.length) {
//     removeSockets.forEach((socket, index) => {
//       // console.log("Time Over", socket.id);
//       aliveUsers = aliveUsers.filter(function (obj) {
//         return obj.id !== socket.id;
//       });
//       if (queueUsers[0]) {
//         aliveUsers.push(queueUsers[0]), queueUsers.shift();
//       }
//       socket.socket.disconnect();

//       // }
//     });
//   }
//   console.log(aliveUsers.length);
//   aliveUsers.forEach((socket) => {
//     socket.socket.emit("alive", aliveUsers.length);
//     socket.socket.emit("queue", queueUsers.length);
//     socket.socket.emit("currentState", "You're alive");
//   });
//   queueUsers.forEach((socket, index) => {
//     socket.socket.emit("alive", aliveUsers.length);
//     socket.socket.emit("queue", queueUsers.length);
//     socket.socket.emit("currentState", `You're in queue ${index + 1}`);
//   });
// }, 1000);

// Basic Input
// Broadcast
