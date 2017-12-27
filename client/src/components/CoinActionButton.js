import React from 'react';
import {Button} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {COIN_STATUS, BUTTON_COIN_STATUS} from '../config';

const CoinActionButton = (props) => {
    let buttonContent, buttonOnClick;
    let isDisabled = false;

    switch (props.coinState) {
        case COIN_STATUS.created:
            buttonContent = BUTTON_COIN_STATUS.sign;
            buttonOnClick = props.onSign;
            break;

        case COIN_STATUS.signing:
            isDisabled = true;
            buttonContent = BUTTON_COIN_STATUS.signing;
            break;

        case COIN_STATUS.signed:
            buttonContent = BUTTON_COIN_STATUS.spend;
            buttonOnClick = props.onSpend;
            break;

        case COIN_STATUS.spent:
            isDisabled = true;
            buttonContent = BUTTON_COIN_STATUS.spent;
            break;

        case COIN_STATUS.spending:
            isDisabled = true;
            buttonContent = BUTTON_COIN_STATUS.spending;
            break;
    }

    return (
        <Button
            disabled={isDisabled}
            primary={true}
            content={buttonContent}
            onClick={buttonOnClick}
        />
    )
};

CoinActionButton.PropTypes = {
    onSign: PropTypes.func.isRequired,
    onSpend: PropTypes.func.isRequired,
    coinState: PropTypes.string.isRequired,
};

export default CoinActionButton;

