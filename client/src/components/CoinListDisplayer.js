import React from 'react';
import PropTypes from 'prop-types';
import CoinDisplayer from './CoinDisplayer';

const CoinListDisplayer = props => (
  <div>
    {props.coins.map(coin => (
      <CoinDisplayer
        key={coin.coin.ID}
        coin={coin.coin}
        sk={coin.sk}
        id={coin.id}
        ElGamalSK={props.ElGamalSK}
        ElGamalPK={props.ElGamalPK}
      />
    ))}
  </div>
);

CoinListDisplayer.propTypes = {
  coins: PropTypes.array.isRequired,
  ElGamalSK: PropTypes.object.isRequired,
  ElGamalPK: PropTypes.object.isRequired,
};

export default CoinListDisplayer;
