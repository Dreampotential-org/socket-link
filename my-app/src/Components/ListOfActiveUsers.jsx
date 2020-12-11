import React from 'react';
import ActiveUser from './ActiveUser.jsx';


class ListOfActiveUsers extends React.Component {
    constructor(props) {
        super(props)
    }
    
    // ListOfActiveUsers render when Listing in Active user(get used with props)
    render() {
        if (this.props.users.length) {
            return (
                <div className='listOfActiveUsers'>
                    <h5><b>Currently Exploring</b></h5>
                    {this.props.users.map(user => {
                        return (<ActiveUser user={user} />)
                    })}
                </div>
            )
        } else return null;
    }
}

export default ListOfActiveUsers;