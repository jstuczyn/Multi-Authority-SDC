import React from 'react';
import PropTypes from 'prop-types';
import CoinDisplayer from './CoinDisplayer';

const CoinListDisplayer = props => (
  <div>
    {props.coins.map(coin => (
      <CoinDisplayer key={coin.coin.id} coin={coin.coin} sk={coin.sk} />
    ))}
  </div>
);

CoinListDisplayer.propTypes = {
  coins: PropTypes.array.isRequired,
};

export default CoinListDisplayer;
