import React, {Component} from 'react';

import MessageInput from './MessageInput'
import ServerStatus from './ServerStatus'
import {checkIfAlive} from '../utils/api'
import {Segment, Grid, Table} from 'semantic-ui-react'


// var libs = require('lib');
// const CTX = require('script-loader!../../lib/Milagro-Crypto-Library/ctx.js');

// import BpGroup from 'script-loader!../../lib/BpGroup.exec'

// import BpGroup from '../../lib/BpGroup.exec'
//
// const G = new BpGroup();
// G.gen1


const divStyle = {
    "width": "1000px",
    "margin": "auto",
    "marginTop": "50px",
};

export default class MainDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "",
            serversDone: [],
            allServersDone: false,
        }
    }


    componentWillMount() {
        let newServersDoneState = [];
        this.props.servers.forEach((server) => {
            newServersDoneState.push({
                    "server": server,
                    "isDone": false,
                }
            );
        });

        this.setState({
            serversDone: newServersDoneState,
        });
    };

    testAgg = () => {
        console.log("hai")
    };

    handleSubmit = (message) => {
        this.setState({message})
    };

    handleSignatureDone = (serverDone) => {
        console.log(serverDone, "is done");

        let newServersDoneState = [];
        let i;
        let overallStatus = true;
        for (i = 0; i < this.state.serversDone.length; i++) {
            let server = this.state.serversDone[i].server;

            if (server === serverDone) {
                newServersDoneState.push({
                    "server": server,
                    "isDone": true,
                });
            }
            else {
                newServersDoneState.push(this.state.serversDone[i]);
            }

            overallStatus = overallStatus && newServersDoneState[i].isDone;
        }

        this.setState({
            serversDone: newServersDoneState,
            allServersDone: overallStatus,
        });
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
                            {this.props.servers.map((server) => (
                                <ServerStatus
                                    key={server}
                                    address={server}
                                    message={this.state.message}
                                    ctx={this.props.ctx}
                                    onDone={this.handleSignatureDone}
                                />
                            ))}
                        </Table.Body>
                    </Table>
                    }
                </div>
                {this.state.allServersDone &&
                <p>All Servers are done: get aggregate</p>
                }
            </div>
        )
    }
}


