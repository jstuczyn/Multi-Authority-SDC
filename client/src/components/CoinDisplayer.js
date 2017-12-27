import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import CoinActionButton from './CoinActionButton';
import style from './CoinDisplayer.style'
import {COIN_STATUS} from '../config';

export default class CoinDisplayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'coinState' : COIN_STATUS.created,
        }
    }

    handleCoinSign = () => {
        // firstly it will set state to 'signing' and then make async calls to all authorities
        // upon completion and aggregating signatures, it will properly set state to 'signed'

        // this.setState({'coinState': COIN_STATUS.signing});
        // async call to signers
        console.log('Coin was signed (TODO)');
        this.setState({'coinState': COIN_STATUS.signed});
    };

    handleCoinSpend = () => {
        this.setState({'coinState': COIN_STATUS.spent});
        console.log('Coin was spent (TODO)');
    };

    render() {
        return (
            <Segment.Group horizontal>
                <Segment style={style.segmentStyle}> Time to live: {this.props.coin.ttl} </Segment>
                <Segment style={style.segmentStyle}> Value: {this.props.coin.value}</Segment>
                <Segment style={style.segmentStyle}>
                    <CoinActionButton
                        onSign={this.handleCoinSign}
                        onSpend={this.handleCoinSpend}
                        coinState={this.state.coinState}
                    />
                </Segment>
            </Segment.Group>
        )
    }
};

CoinDisplayer.PropTypes = {
    coin: PropTypes.object.isRequired,
};
