import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import CoinActionButton from './CoinActionButton';
import style from './CoinDisplayer.style';
import {COIN_STATUS} from '../config';

import {wait} from '../utils/api'

export default class CoinDisplayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'coinState' : COIN_STATUS.created,
        };

        this.handleCoinSign = this.handleCoinSign.bind(this);
        this.handleCoinSpend = this.handleCoinSpend.bind(this);

    }

    async handleCoinSign() {
        this.setState({'coinState': COIN_STATUS.signing});
        console.log('Coin sign request was sent (TODO)');

        const waiting = await wait(1000); // simulates async call to signing authorities

        console.log('Coin was signed (TODO)');
        this.setState({'coinState': COIN_STATUS.signed});
    }

    async handleCoinSpend() {
        this.setState({'coinState': COIN_STATUS.spending});
        console.log('Coin spend request was sent (TODO)');

        const waiting = await wait(1000); // simulates async call to the verifier

        console.log('Coin was spent (TODO)');
        this.setState({'coinState': COIN_STATUS.spent});
    }

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
