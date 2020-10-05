import React, { Component } from "react";
//import socket from "../../sockets";
import "./GamePlayerListing.css";

class GamePlayerListing extends Component {
    constructor(props) {
        super(props);

        this.state = { viewInfo: false };
    }

    toggleInfo() {
        (this.state.viewInfo) ?
            this.setState({ viewInfo: false }) : 
            this.setState({ viewInfo: true })
    }

    render() {
        return (
            <div className='littleListOuter'>
                <div className='plyrNames'>
                    <div className='personName'>
                        {this.props.data.username}
                    </div>
                    <div className='roleName'>
                        {(this.state.viewInfo) ?
                        this.props.data.alignment : '...'}
                    </div>
                </div>
                <button className='plyrInfoButton' onClick={this.toggleInfo.bind(this)}>
                    Info
                </button>
            </div>
        );
    }
}

export default GamePlayerListing;
