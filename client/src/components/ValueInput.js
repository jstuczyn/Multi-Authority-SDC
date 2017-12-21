import React from 'react';
import {Input} from 'semantic-ui-react'
import PropTypes from 'prop-types';

export default class ValueInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isInputValid: true,
        }
    }

    handleInputChange = (event) => {
        const stringValue = event.target.value;
        const numValue = parseInt(stringValue / 1); // ensures that it won't try to extract num from garbage (ex. parseInt("42.jgp") would have returned 42)
        let isInputValid = true;
        if (numValue && numValue > 0) {
            this.props.onInputChange(numValue);
        } else {
            this.props.onInputChange(0);
            isInputValid = false;
        }
        this.setState({isInputValid})
    };

    render() {
        return (
            <Input
                action={this.props.children}
                actionPosition='left'
                placeholder="Value"
                onChange={this.handleInputChange}
                error={!this.state.isInputValid}
            />
        )
    }
}

ValueInput.propTypes = {
  onInputChange: PropTypes.func.isRequired,
};