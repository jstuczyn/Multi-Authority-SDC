import React, {Component} from 'react';


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
    }


    getAggregate = () => {
        let aggregateSignature = PSSig.aggregateSignatures(this.state.params, this.props.signatures);
        this.setState({
            aggregateSignature: aggregateSignature,
        })
    };

    verifyAggregation = () => {
        let isAggregateCorrect = PSSig.verifyAggregation(this.state.params, )
    };

    render() {
        return (
            <div>
                {this.state.aggregateSignature !== null &&
                <p>
                    <b>Aggregate Signature: </b> {this.state.aggregateSignature[1].toString()}<br/>
                    <b>TODO: Verify Correctness</b>
                </p>
                }
            </div>
        );

    }
}


