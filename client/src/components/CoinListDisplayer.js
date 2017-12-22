import React from 'react';
import PropTypes from 'prop-types';
import CoinDisplayer from './CoinDisplayer';

export default class CoinListDisplayer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // {sk: sk, coin: coin}
        return (
            <div>
                {this.props.coins.map((coin) => (
                    <CoinDisplayer key={coin.coin.id} coin={coin.coin}/>
                ))}
            </div>
        )
    }
}

CoinListDisplayer.PropTypes = {
    coins: PropTypes.array.isRequired,
};