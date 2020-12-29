import React, { useState } from 'react';

// const socket = new WebSocket('ws://localhost:3333');
const socket = new WebSocket('wss://socket-link.dreamstate-4-all.org');

class WS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: null
        }
    }

    // componentDidMount function call every time render class Component
    componentDidMount() {
        // send data in web socket
        socket.onopen = () => {
            socket.send('xochi');
            socket.send('gavin');
            socket.send('appa');
            socket.send('momo');
        }

        //set message in state and pass in Web socket 
        socket.onmessage = event => {
            this.setState({
                users: JSON.parse(event.data)
            })
        };
    }

    render() {
        return (
            <div >
                Users: {this.state.users.users}
        Active Users: {this.state.users.activeUsers}
            </div>
        );
    }
}

export default WS;