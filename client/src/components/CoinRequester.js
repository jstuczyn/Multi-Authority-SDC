import React from 'react';
import ValueInput from './ValueInput';
import SubmitButton from './SubmitButton';
import PropTypes from 'prop-types';

export default class CoinRequester extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            isProcessing: false,
        }
    }

    handleInputChange = (value) => {
        this.setState({value});
    };

    handleSubmit = (event) => {
        this.props.handleCoinSubmit(this.state.value);
    };

    render() {
        return (
            <ValueInput onInputChange={this.handleInputChange}>
                <SubmitButton
                    onSubmit={this.handleSubmit}
                    isDisabled={this.state.value <= 0}/>
            </ValueInput>
        )
    }
}

CoinRequester.PropTypes = {
    handleCoinSubmit: PropTypes.func.isRequired,
};