/* global localStorage, */
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormControl, Form } from "react-bootstrap";
import ListOfActiveUsers from './Components/ListOfActiveUsers.jsx';
import ListOfQueueUsers from './Components/ListOfQueueUsers.jsx'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { localStorage } from "node-localstorage";
//Import Socket.io
import openSocket from 'socket.io-client';

// var localStorage = new LocalStorage('./scratch');

// instance of websocket connection as a class property
const socket = new WebSocket('ws://localhost:3333');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.joinQueue = this.joinQueue.bind(this);
    this.leaveQueue = this.leaveQueue.bind(this);
    this.state = {
      user: null,
      videoURL: null,
      users: null,
      activeUsers: null,
      queueUsers: null,
      showEnter: false,
      showTimesUp: false,
      isInQueue: false,
      name: "",
      roomName: "",
      userMessage: "",
      getTimeSet: null,
      brodCastText: "",
    }
  }

  // componentDidMount function call every time render class Component
  componentDidMount() {
    socket.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connection open');
    }

    // listen to data sent from the websocket(ws) server
    socket.onmessage = event => {
      // console.log("event =>", event);
      //if the message from the server starts with u then it has the user lists in it
      if (event.data[3] === 'u') {
        const allUsers = event.data && JSON.parse(event.data)
        if (allUsers.activeUsers && allUsers.activeUsers.length == 3) {
          console.log("come on active data ste ");
          this.setState({
            users: allUsers,
            activeUsers: allUsers.activeUsers,
            queueUsers: allUsers.users,
            getTimeSet: allUsers.timeStamp
          })
        } else {
          this.setState({
            users: allUsers,
            activeUsers: allUsers.activeUsers,
            queueUsers: allUsers.users,
            getTimeSet: allUsers.timeStamp
          })
        }
        //if it starts with v then it is the URL for the video endpoint
      } else if (event.data[2] === 'v') {
        const url = JSON.parse(event.data)
        this.setState({
          showEnter: true,
          videoURL: url.videoUrl
        })
        //if it starts with T then it is telling the user that time is up
      } else if (event.data[2] === 'T') {
        this.setState({
          showTimesUp: true
        })
      }
    }

    socket.onerror = err => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );
      socket.close();
    };
  };

  //when the user decides to join the 3d verse (puts you in the world if it is not full and the queue if it is full)
  joinQueue(data) {
    if (data && data.activeUsers && data.users) {
      this.setState({
        name: data,
      })
    } else {
      if (this.state.name.length > 0) {
        let MainData = { "name": this.state.name, "userMessage": this.state.userMessage, "roomName": this.state.roomName };
        socket.send(JSON.stringify(MainData));
        this.setState({
          isInQueue: true,
          user: 'playaName',
        })
      }
    }
  }

  //when a user decides to leave the queue
  leaveQueue() {

  }

  //user click on expire button then remove each user from the current user
  ExpireData(data) {
    data && data.activeUsers.map((dataAll) => {
      socket.send(dataAll);
    });
  }

  sendBroadcast() {
    console.log("click to send broadcast message");
    // it emits the new message written by the user to the 'chat' channel
    // socket.emit('sendMessage', "come on main data set here");
  }

  render() {
    const NameText = event => {
      this.setState({ name: event.target.value });
      event.preventDefault();
    };

    const RoomName = event => {
      this.setState({ roomName: event.target.value });
      event.preventDefault();
    };

    const MessageText = event => {
      this.setState({ userMessage: event.target.value });
      event.preventDefault();
    }

    const BroadCastText = event => {
      this.setState({ brodCastText: event.target.value });
      event.preventDefault();
    };

    if (!this.state.showEnter && !this.state.showTimesUp && this.state.activeUsers != null && this.state.queueUsers != null) {
      return (
        <Accordion>
          <Card>
            <Accordion.Toggle id="queueToggle" as={Button} variant='primary' eventKey="1">
              Enter The 3D Verse
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <div>
                  <Form.Label>Room Name</Form.Label>
                  <FormControl
                    placeholder="RoomName"
                    aria-label="RoomName"
                    onChange={(e) => RoomName(e)}
                    style={{ marginBottom: "10px", marginTop: "10px", width: "8%" }}
                    defaultValue={this.state.roomName}
                  />
                  <Form.Label>Name</Form.Label>
                  <FormControl
                    placeholder="Name"
                    aria-label="Name"
                    onChange={(e) => NameText(e)}
                    style={{ marginBottom: "10px", marginTop: "10px", width: "8%" }}
                  />
                  <Form.Label>Message</Form.Label>
                  <FormControl
                    placeholder="Message"
                    aria-label="Send Message"
                    onChange={(e) => MessageText(e)}
                    style={{ marginBottom: "10px", marginTop: "10px", width: "8%" }}
                  />
                </div>
                <div id='userLists'>
                  <ListOfActiveUsers users={this.state.activeUsers} usertextMessage={this.state.userMessage} />
                  <ListOfQueueUsers users={this.state.queueUsers} getTimeSet={this.state.getTimeSet} />
                </div>
                <div>
                  <p><b>Number of people waiting join: {this.state.queueUsers.length.toString()}</b></p>
                  <Button onClick={this.joinQueue}>Join</Button>
                  <h3 >Broadcast</h3>
                  <FormControl
                    placeholder="Broadcast"
                    aria-label="Broadcast"
                    onChange={(e) => BroadCastText(e)}
                    style={{ marginBottom: "10px", marginTop: "10px", width: "8%" }}
                  />
                  <Button id="sendMessage" onClick={this.sendBroadcast}>Send</Button>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    } else if (this.state.showEnter) {
      return (
        <Modal.Dialog>
          <Modal.Body>
            You may now enter the 3D verse!
              </Modal.Body>
          <Modal.Footer>
            {/* <Button variant='primary' href={this.state.videoURL} target="_blank">Enter</Button> */}
            <Button variant='primary' href={this.state.videoURL} onClick={() => { this.setState({ showEnter: false }) }} target="_blank">Enter</Button>
            <Button variant='primary' onClick={() => { this.setState({ showEnter: false }) }}>Close</Button>
          </Modal.Footer>
        </Modal.Dialog>
      )
    } else if (this.state.showTimesUp) {
      return (
        <Modal.Dialog>
          <Modal.Body> Times Up!</Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={() => { this.setState({ showTimesUp: false }) }}>Close</Button>
          </Modal.Footer>
        </Modal.Dialog>
      )
    } else if (!this.state.showEnter && !this.state.showTimesUp && this.state.activeUsers != null && this.state.queueUsers != null && this.state.isInQueue) {
      return (
        <Accordion>
          <Card>
            <Accordion.Toggle id="queueToggle" as={Button} variant='primary' eventKey="1">
              Enter The 3D Verse
          </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <div id='userLists'>
                  <ListOfActiveUsers users={this.state.activeUsers} />
                  <ListOfQueueUsers users={this.state.queueUsers} />
                </div>
                <div>
                  <p><b>Number of people waiting Leave: {this.state.queueUsers.length.toString()}</b></p>
                  <Button onClick={this.leaveQueue}>Leave</Button>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    } else {
      return (
        <Accordion>
          <Card>
            <Accordion.Toggle id="queueToggle" as={Button} variant='primary' eventKey="1">
              Enter The 3D Verse
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <div id='userLists'>
                </div>
                <Button onClick={this.joinQueue}>Join Queue</Button>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    }
  }
}

export default App;