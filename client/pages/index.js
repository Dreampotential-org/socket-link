import io from "socket.io-client";
import { useEffect, useState } from "react";
const maxTime = 10000; //10 Seconds
let socket;
export default function Home() {
  const [aliveUsers, setAliveUsers] = useState("");
  const [queueUsers, setQueueUsers] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [conferenceName, setConferencename] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [timeLimit, setTimeLimit] = useState("");
  const [slots, setSlots] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    socket = io.connect("http://localhost:4000");
    socket.on("alive", (data) => setAliveUsers(data));
    socket.on("queue", (data) => setQueueUsers(data));
    socket.on("currentState", (data) => setCurrentState(data));
    socket.on("disconnect", () => {
      setAliveUsers("Disconnected");
      setQueueUsers("Disconnected");
    });
    socket.on("rooms", (data) => {
      data.forEach((room) => {
        room.people.forEach((person) => {
          if (Number(person.timeLeft) <= 0) leaveRoom(room.room);
        });
      });
      setAvailableRooms(data);
    });
    socket.o;
    return () => socket.close();
  }, []);
  const createConference = () => {
    socket.emit("createConference", {
      conferenceName,
      timeLimit,
      slots,
    });
  };
  const joinRoom = (room) => {
    socket.emit("joinRoom", {
      room,
    });
  };
  const saveName = () => {
    socket.emit("saveName", name);
  };
  const leaveRoom = (room) => {
    socket.emit("leaveRoom", room);
  };

  return (
    <div>
      <h1>Please Enter your name</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => saveName()}>Save Name</button>
      <h1>
        <input
          onChange={(e) => setTimeLimit(e.target.value)}
          placeholder="Enter your time limit"
        />
        <input
          type="number"
          onChange={(e) => setSlots(e.target.value)}
          placeholder="Enter number of slots"
        />
        <input onChange={(e) => setConferencename(e.target.value)} />
        <button onClick={() => createConference()}>Create Conference</button>
      </h1>
      <h1>Available Rooms/Conferences</h1>
      {availableRooms.map((room, idx) => (
        <div key={idx}>
          <li>
            {room.slots} Slots in
            {room.room} &nbsp; &nbsp; --{" "}
            {room.people.map((person) => {
              return (
                " -- " +
                person.name +
                " " +
                "Time Left ==  " +
                Number(person.timeLeft) +
                "  Sec , "
              );
            })}
            <button onClick={() => joinRoom(room.room)}>Join Room</button>
            <button onClick={() => leaveRoom(room.room)}>Leave Room</button>
          </li>
        </div>
      ))}
    </div>
  );
}
