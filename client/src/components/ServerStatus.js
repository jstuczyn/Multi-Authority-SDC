import React, {Component} from 'react';
import {checkIfAlive, getPublicKey, signMessage} from '../utils/api';
import {Icon, Segment, Grid, Table} from "semantic-ui-react";


const nameStyle = {
    "fontWeight": "bold",
    "display": "inline"

};

// const outerContainerStyle = {
//     "width": "80%",
//     "display": "inline-block"
// };

const serverNameContainerStyle = {
    // "display": "inline"
};

const errorMessage = "Error: Server is Down";

export default class ServerStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // address: this.props.address,
            // message: this.props.message, moved to props
            status: "Checking if server is Alive...", // todo fancy . => .. => ... => .
            publicKey: [],
            signature: ""
        };
    }

    async getMessageSignature() {
        await signMessage(this.props.address, this.props.message).then((response) => {
            console.log("stuff?");
        });
    }

    async getPublicKey() {
        await checkIfAlive(this.props.address).then((response) => {
            if (response.status) {

                let g = this.props.ctx.ECP2.fromBytes(response.pk.g);
                let X = this.props.ctx.ECP2.fromBytes(response.pk.X);
                let Y = this.props.ctx.ECP2.fromBytes(response.pk.Y);

                this.setState({
                    status: "Waiting for signature",
                    publicKey: [g, X, Y],
                });
            }
            else {
                this.setState({
                    status: errorMessage,
                    signature: errorMessage,
                });
            }
        });

    }

    async componentDidMount() {
        await this.getPublicKey();
        if (this.state.status !== errorMessage) {
            await this.getMessageSignature();
        }

    }

    render() {
        return (
            <Table.Row
                textAlign="center"
            >

                <Table.Cell
                    width={2}
                    textAlign="left"
                >
                    <div style={serverNameContainerStyle}>
                        {/*todo: move to separate component*/}
                        {this.state.signature.length === 0 &&
                        <Icon name='circle notched' loading size="large"/>
                        }

                        {this.state.signature === errorMessage &&
                        <Icon name='remove' color="red" size="large"/>
                        }

                        {this.state.signature !== errorMessage && this.state.signature.length > 0 &&
                        <Icon name='checkmark' color="green" size="large"/>
                        }
                        <p style={nameStyle}> {this.props.address} </p>
                    </div>
                </Table.Cell>

                <Table.Cell
                    width={3}
                    textAlign="left"
                >
                    {this.state.status}
                </Table.Cell>

                <Table.Cell
                    width={4}
                    textAlign="left"
                >
                    {this.state.publicKey}
                </Table.Cell>


                <Table.Cell
                    width={4}
                    textAlign="left"
                >
                    {this.state.signature}
                </Table.Cell>


            </Table.Row>
        )
    }
}