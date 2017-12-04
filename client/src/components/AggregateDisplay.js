import React, {Component} from 'react';
import {Icon} from "semantic-ui-react";


// todo: send [h, sig] from server and act accordingly

export default class AggregateDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            aggregateSignature: null,
            params: [],
            isAggregateCorrect: false,
        }
    }

    componentWillMount() {
        let params = PSSig.setup();
        this.setState({
            params: params,
        });
    }

    componentDidMount() {
        this.getAggregate();
        // this.verifyAggregation();
    }


    getAggregate = () => {
        let aggregateSignature = PSSig.aggregateSignatures(this.state.params, this.props.signatures);
        this.setState({
                aggregateSignature: aggregateSignature,
            },
            this.verifyAggregation
        );
        console.log(aggregateSignature)
    };

    verifyAggregation = () => {
        let isAggregateCorrect = PSSig.verifyAggregation(this.state.params, this.props.pks, this.props.message, this.state.aggregateSignature);
        this.setState({
            isAggregateCorrect: isAggregateCorrect,
        });
        console.log("is correct?", isAggregateCorrect)
    };

    render() {
        return (
            <div>
                {this.state.aggregateSignature !== null &&
                <p>
                    <b>Aggregate Signature: </b> {this.state.aggregateSignature[1].toString()}<br/>
                    <b>Is it correct? </b> {this.state.isAggregateCorrect.toString()}
                </p>
                }
            </div>
        );

    }
}


