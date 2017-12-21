import React from 'react';
import {Button} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const SubmitButton = (props) => {

    return (
        <Button
            disabled={props.isDisabled}
            color='teal'
            labelPosition='left'
            icon='dollar'
            content='Get Coin'
            onClick={props.onSubmit}
        />
    )
};

SubmitButton.PropTypes = {
    isDisabled: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default SubmitButton

