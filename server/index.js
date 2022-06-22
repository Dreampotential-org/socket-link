import { Server } from "socket.io";
import express from "express";
import cors from "cors";
const app = express();
const maxTime = 100000; //10 Seconds
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
  // const entryTime = +new Date(Date.now());
  // const exitTime = +new Date(Date.now()) + maxTime;
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

  socket.on("createConference", (data) => {
    // socket.data.entryTime = +new Date(Date.now());
    // socket.data.exitTime = +new Date(Date.now()) + data.timeLimit;
    socket.data.entryTime = parseInt(new Date().getTime() / 1000);
    socket.data.exitTime =
      parseInt(new Date().getTime() / 1000) + Number(data.timeLimit);
    sockets.push({
      id: socket.id,
      socket,
      entryTime: socket.data.entryTime,
      exitTime: socket.data.exitTime,
    });

    socket.join(data.conferenceName);
    if (!availableRooms.find((room) => room.room === data.conferenceName))
      availableRooms.push({
        id: socket.id,
        room: data.conferenceName,
        slots: data.slots,
        slotDuration: data.timeLimit,
      });
  });
  socket.on("joinRoom", async (data) => {
    let roomLength = await io.in(data.room).fetchSockets();
    const availableRoom = availableRooms.filter(
      (room) => room.room === data.room
    );
    const slots = availableRoom[0].slots;
    if (roomLength && roomLength.length < Number(slots)) {
      socket.data.entryTime = parseInt(new Date().getTime() / 1000);
      socket.data.exitTime =
        parseInt(new Date().getTime() / 1000) +
        Number(availableRoom[0].slotDuration);
      socket.join(data.room);
    } else {
      if (!queueUsers.find((users) => users.id === socket.id))
        queueUsers.push({ id: socket.id, socket });
    }
    console.log("Socket Data", socket);
  });

  socket.on("leaveRoom", (room) => {
    console.log("Leaving Room", room);
    console.log("Socket Data", socket.data, socket.id);
    socket.leave(room);
  });
});

setInterval(async () => {
  const rooms = [];
  for (let room of availableRooms) {
    // rooms.push({
    let room1 = room.room;
    let slots = room.slots;
    let people = await io.in(room.room).fetchSockets();
    const currentTime = parseInt(new Date().getTime() / 1000);

    people = people.map((socket) => {
      // console.log(socket.entryTime);
      socket.data.timeLeft = Number(socket.data.exitTime) - currentTime;
      return socket.data;
    });
    // });
    // console.log(people);
    rooms.push({ room: room1, people: people, slots: slots });
  }
  console.log(rooms);
  // console.log(rooms);
  io.sockets.emit("rooms", rooms);
}, 1000);
