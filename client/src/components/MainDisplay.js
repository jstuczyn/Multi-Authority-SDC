import React, {Component} from 'react';

import MessageInput from './MessageInput'
import ServerStatus from './ServerStatus'
import {checkIfAlive} from '../utils/api'
import {Segment, Grid, Table} from 'semantic-ui-react'

const divStyle = {
    "width": "1000px",
    "margin": "auto",
    "marginTop": "50px",
};

const servers = [
    "127.0.0.1:3000",
    "127.0.0.1:3001",
];


export default class MainDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: ""
        }
    }

    handleSubmit = (message) => {
        console.log("clicked");
        console.log(message);
        this.setState({message})
        // this.setState({loading: true});
        // checkIfAlive("test").then((response) => {
        //     console.log("we got: ", response);
        //     this.setState({loading: false});
        // });
    };

    render() {
        return (
            <div>
                <MessageInput
                    onSubmit={this.handleSubmit}
                />
                <div style={divStyle}>
                    {this.state.message.length > 0 &&
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Server Address</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Public Key</Table.HeaderCell>
                                <Table.HeaderCell>Signature </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {servers.map((server) => (
                                <ServerStatus
                                    key={server}
                                    address={server}
                                    message={this.state.message}
                                    ctx={this.props.ctx}
                                />
                            ))}
                        </Table.Body>
                    </Table>
                    }
                </div>
            </div>
        )
    }
}


