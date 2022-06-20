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
  const [name, setName] = useState("");
  useEffect(() => {
    socket = io.connect("https://socketlink.dreampotential.org");
    // socket.on("connect", () => );
    socket.on("alive", (data) => setAliveUsers(data));
    socket.on("queue", (data) => setQueueUsers(data));
    socket.on("currentState", (data) => setCurrentState(data));
    socket.on("disconnect", () => {
      setAliveUsers("Disconnected");
      setQueueUsers("Disconnected");
    });
    socket.on("rooms", (data) => {
      console.log(data);
      setAvailableRooms(data);
    });
    socket.o;
    return () => socket.close();
  }, []);
  const createConference = () => {
    socket.emit("createConference", {
      conferenceName,
      timeLimit,
    });
  };
  const joinRoom = (room) => {
    socket.emit("joinRoom", {
      room,
      timeLimit,
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
      {/* <h1>Alive Users</h1>
      <h2>{aliveUsers}</h2>
      <h1>Queue Users</h1>
      <h2>{queueUsers}</h2>
      <h1>Your Current State</h1>
      <h2>{currentState}</h2> */}
      <h1>Please Enter your name</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => saveName()}>Save Name</button>
      <h1>
        <input
          onChange={(e) => setTimeLimit(e.target.value * 10000)}
          placeholder="Enter your time limit"
        />

        <input onChange={(e) => setConferencename(e.target.value)} />
        <button onClick={() => createConference()}>Create Conference</button>
      </h1>
      <h1>Available Rooms/Conferences</h1>
      {availableRooms.map((room, idx) => (
        <div key={idx}>
          <li>
            {room.room} &nbsp; &nbsp; --{" "}
            {room.people.map((person) => {
              person.timeLeft < 0 && leaveRoom(room.room);
              return (
                " -- " +
                person.name +
                " " +
                "Time Left ==  " +
                person.timeLeft / 10000 +
                "  Sec , "
              );
            })}
            <input
              onChange={(e) => setTimeLimit(e.target.value * 10000)}
              placeholder="Enter your time limit"
            />
            <button onClick={() => joinRoom(room.room)}>Join Room</button>
            <button onClick={() => leaveRoom(room.room)}>Leave Room</button>
          </li>
        </div>
      ))}
    </div>
  );
}
