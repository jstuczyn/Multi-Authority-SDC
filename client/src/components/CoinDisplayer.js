import React from 'react';
import PropTypes from 'prop-types';

const CoinDisplayer = (props) => {

    return (
        <div>
            {`Time to live: ${props.coin.ttl} Value: ${props.coin.value}`}
        </div>

    )
};

CoinDisplayer.PropTypes = {
    coin: PropTypes.object.isRequired,
};

export default CoinDisplayer;