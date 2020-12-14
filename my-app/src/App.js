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
      message: "",
      getTimeSet: null,
      brodCastText: ""
    }
  }

  // componentDidMount function call every time render class Component
  componentDidMount() {
    socket.onopen = () => {
      console.log('connection open')
    }
    // Pass or get message from web socket 
    socket.onmessage = event => {
      // console.log("Message from server =>", event);
      //if the message from the server starts with u then it has the user lists in it
      if (event.data[3] === 'u') {
        const allUsers = JSON.parse(event.data)
        // console.log("allUsers=>", allUsers);
        this.setState({
          users: allUsers,
          activeUsers: allUsers.activeUsers,
          queueUsers: allUsers.users
        })
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
  };

  //when the user decides to join the 3d verse (puts you in the world if it is not full and the queue if it is full)
  joinQueue(data) {
    // console.log("joint data here =>", data);
    if (data && data.activeUsers && data.users) {
      console.log("come on main data ste ");
      this.setState({
        name: data,
        // queueUsers: data.users
      })
    } else {
      // socket.send(JSON.stringify({
      //   name: this.state.name,
      //   message: this.state.message
      // }));
      socket.send(this.state.name);
      this.setState({
        isInQueue: true,
        user: 'playaName',
        getTimeSet: new Date()
      })
    }
    // if (this.state.name.length > 0) {
    //   // console.log("socket data set =>", socket);
    //   socket.send(this.state.name);
    //   // socket.send(this.state.message);
    //   this.setState({
    //     isInQueue: true,
    //     user: 'playaName',
    //     getTimeSet: new Date()
    //   })
    // }
  }

  //when a user decides to leave the queue
  leaveQueue() {

  }

  ExpireData(data) {
    console.log("click on expire data", data.activeUsers);
    data && data.activeUsers.map((dataAll) => {
      socket.send(dataAll);
    });
  }

  addBroadCast() {
    console.log("come on main data set here");
    // socket.send("sendMessage", "all data pass here", (error) => {
    //   // formInput.value = "";
    //   // formbutton.removeAttribute("disabled");
    //   // formInput.focus;
    //   if (error) {
    //     return console.log(error);
    //   }
    //   console.log("Message was delivred");
    // });
    // socket.onmessage = messageData => {
    //   console.log("event data set here ", "uvgtybytvtfvtty", messageData);
    // }
    // socket.send("sendMessage", "dataset here so you get batte idea", (error) => {
    //   // formInput.value = "";
    //   // formbutton.removeAttribute("disabled");
    //   // formInput.focus;
    //   if (error) {
    //     return console.log(error);
    //   }
    //   console.log("Message was delivred");
    // });
  }

  render() {
    const NameText = event => {
      this.setState({ name: event.target.value });
      event.preventDefault();
    };

    const MessageText = event => {
      this.setState({ message: event.target.value });
      event.preventDefault();
    }

    const BrodCastText = event => {
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
                  <Form.Label>Name</Form.Label>
                  <FormControl
                    placeholder="Name"
                    aria-label="Name"
                    onChange={e => NameText(e)}
                    style={{ marginBottom: "10px", marginTop: "10px", width: "8%" }}
                  />
                  <Form.Label>Message</Form.Label>
                  <FormControl
                    placeholder="Message"
                    aria-label="Send Message"
                    onChange={e => MessageText(e)}
                    style={{ marginBottom: "10px", marginTop: "10px", width: "8%" }}
                  />
                </div>
                <div id='userLists'>
                  <ListOfActiveUsers users={this.state.activeUsers} ExpireData={this.joinQueue.bind()} />
                  <ListOfQueueUsers users={this.state.queueUsers} />
                </div>
                <div>
                  <p><b>Number of people waiting join: {this.state.queueUsers.length.toString()}</b></p>
                  <Button onClick={this.joinQueue}>Join</Button>
                  <h3 >Broadcast</h3>
                  <FormControl
                    placeholder="Broadcast"
                    aria-label="Broadcast"
                    onChange={(e) => BrodCastText(e)}
                    style={{ marginBottom: "10px", marginTop: "10px", width: "8%" }}
                  />
                  <Button onClick={() => this.addBroadCast()}>Send</Button>
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