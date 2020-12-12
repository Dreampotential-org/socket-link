import React from 'react';
import Button from 'react-bootstrap/Button';
import ActiveUser from './ActiveUser.jsx';
const socket = new WebSocket('ws://localhost:3333');

class ListOfActiveUsers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expireUser: null,
            allUser: null
        }
    }

    componentDidMount() {
        this.setState({ allUser: this.props.users })
    }
    // ListOfActiveUsers render when Listing in Active user(get used with props)
    render() {
        // console.log("this.props.users in active user data =>", this.state.allUser);
        const handleExpire = (index, user) => {
            // console.log("click on expire button", index);
            // console.log("user length =>", this.props.users.length);
            for (var i in this.state.allUser) {
                if (this.state.allUser[i] == user) {
                    this.state.allUser.splice(i, 1);
                    socket.onmessage = event => {
                        const activeUsersData = JSON.parse(event.data);
                        let ActiveSet = activeUsersData.activeUsers;
                        console.log("event=>", ActiveSet.splice(i, 1));
                    }
                    break;
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