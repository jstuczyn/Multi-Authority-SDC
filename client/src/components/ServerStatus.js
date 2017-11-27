import React, {Component} from 'react';
import {checkIfAlive, getPublicKey, signMessage} from '../utils/api';
import {Icon, Segment, Grid, Table} from "semantic-ui-react";


const nameStyle = {
    "fontWeight": "bold",
    "display": "inline",

};

const signatureFont = {
    "fontSize": "40%",
    "display": "inline",
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
            publicKey: ["", "", ""],
            signature: "",
            isDone: false,
        };
    }

    async getMessageSignature() {
        await signMessage(this.props.address, this.props.message).then((response) => {
            if(response.status) {
                let signature = this.props.ctx.ECP.fromBytes(response.signature);
                this.setState({
                    status: "Complete",
                    signature: signature,
                })
            }
            else {
                this.setState({
                    status: errorMessage,
                    signature: errorMessage,
                })
            }
        });
        this.props.onDone(this.props.address);
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
                this.props.onDone(this.props.address);
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
                    // rowSpan='2'
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

                        {this.state.signature !== errorMessage && this.state.signature instanceof this.props.ctx.ECP &&
                        <Icon name='checkmark' color="green" size="large"/>
                        }
                        <p style={nameStyle}> {this.props.address} </p>
                    </div>
                </Table.Cell>

                <Table.Cell
                    width={3}
                    // rowSpan='2'
                    textAlign="left"
                >
                    {this.state.status}
                </Table.Cell>

                <Table.Cell
                    width={4}
                    // rowSpan='2'
                    textAlign="left"
                >
                    <p style={nameStyle}>g: </p><p style={signatureFont}>{this.state.publicKey[0].toString()}</p><br/>
                    <p style={nameStyle}>X: </p><p style={signatureFont}>{this.state.publicKey[1].toString()}</p><br/>
                    <p style={nameStyle}>Y: </p><p style={signatureFont}>{this.state.publicKey[2].toString()}</p><br/>
                </Table.Cell>


                <Table.Cell
                    width={4}
                    // rowSpan='2'
                    textAlign="left"
                >
                    <p style={signatureFont}>{this.state.signature.toString()}</p>
                </Table.Cell>


            </Table.Row>
        )
    }
}