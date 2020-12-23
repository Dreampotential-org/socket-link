import React from 'react';
import Button from 'react-bootstrap/Button';
import ActiveUser from './ActiveUser.jsx';
const socket = new WebSocket('ws://localhost:3333');

class ListOfActiveUsers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expireUser: null,
            allUser: null,
            userMessage: null
        }
    }

    componentDidMount() {
        this.setState({ allUser: this.props.users, userMessage: this.state.usertextMessage })
    }
    // ListOfActiveUsers render when Listing in Active user(get used with props)
    render() {
        const handleExpire = (index, user) => {
            // console.log("click on expire button", index);
            // console.log("user length =>", this.props.users.length);
            for (var i in this.state.allUser) {
                if (this.state.allUser[i] == user) {
                    this.state.allUser.splice(i, 1);
                    socket.onmessage = event => {
                        let activeUsersData = JSON.parse(event.data);
                        let ActiveSet = activeUsersData.activeUsers.splice(i, 1);
                        // console.log("activeUsersData =>", activeUsersData);
                        // let MainData = { "name": activeUsersData && activeUsersData.activeUsers, "userMessage": "", "roomName": activeUsersData && activeUsersData.roomName };
                        // socket.send(JSON.stringify(MainData));
                        // console.log("activeUsersData && activeUsersData.activeUsers.length", activeUsersData && activeUsersData.activeUsers.length);
                        if (activeUsersData && activeUsersData.activeUsers.length < 3) {
                            let ChangeAllSet = activeUsersData.activeUsers.push(activeUsersData.users[0]);
                            activeUsersData.users.shift();
                        }
                        // socket.send(activeUsersData);
                    }
                    break;
                    // this.props.ExpireDataHere(this.state.allUser);
                }
            }
        }
        if (this.props.users.length) {
            return (
                <div className='listOfActiveUsers'>
                    <h5><b>Currently Exploring</b></h5>
                    {this.state.allUser && this.state.allUser.map((user, index) => {
                        return (<div className="expire-section"><ActiveUser user={user} /><Button onClick={() => handleExpire(index, user)}>Expire</Button></div>)
                    })}
                </div>
            )
        } else return null;
    }
}

export default ListOfActiveUsers;