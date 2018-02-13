import React from 'react';
import PropTypes from 'prop-types';
import CoinDisplayer from './CoinDisplayer';

const CoinListDisplayer = props => (
  <div>
    {props.coins.map(coin => (
      <CoinDisplayer
        key={coin.id} // if it is not unique, that is client's fault
        coin={coin.coin}
        sk={coin.sk_coin}
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
