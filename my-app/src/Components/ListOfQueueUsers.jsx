import React from 'react';
import QueueUser from './QueueUser.jsx';

class ListOfQueueUsers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userMessage: null
        }
    }

    componentDidMount() {
        this.setState({ userMessage: this.props.usertextMessage })
    }

    // ListOfQueueUsers render when Listing in Queue User(get used with props)
    render() {
        if (this.props.users.length) {
            return (
                <div className='listOfQueueUsers'>
                    <h5><b>Waiting in the Queue</b></h5>
                    {this.props.users.map(user => {
                        return (<div><QueueUser user={user} /></div>)
                    })}
                </div>
            )
        } else return null;
    }
}

export default ListOfQueueUsers;