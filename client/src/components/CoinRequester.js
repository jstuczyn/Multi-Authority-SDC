import React from 'react';
import PropTypes from 'prop-types';
import ValueInput from './ValueInput';
import SubmitButton from './SubmitButton';

class CoinRequester extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      isProcessing: false, // unused at the moment
    };
  }

  handleInputChange = (value) => {
    this.setState({ value });
  };

  handleSubmit = (event) => {
    this.props.handleCoinSubmit(this.state.value);
  };

  render() {
    return (
      <ValueInput onInputChange={this.handleInputChange}>
        <SubmitButton
          onSubmit={this.handleSubmit}
          isDisabled={this.state.value <= 0}
        />
      </ValueInput>
    );
  }
}

CoinRequester.propTypes = {
  handleCoinSubmit: PropTypes.func.isRequired,
};

export default CoinRequester;
