import React, {Component} from 'react';
import {Grid, Input, Button} from 'semantic-ui-react'
import PropTypes from 'prop-types'; // todo: use those


export default class MessageInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            loading: false,
        };
    }

    handleInputChange = (event) => {
        const value = event.target.value;
        this.setState({message: value});
    };

    handleClick = (event) => {
        event.preventDefault();
        this.props.onSubmit(
            this.state.message
        );
    };

    render() {
        return (
            <Grid>
                <Grid.Row
                    centered={true}
                >
                    <Input
                        label="Message to Sign: "
                        placeholder="Enter Message"
                        onChange={this.handleInputChange}
                    />
                </Grid.Row>

                <Grid.Row
                    centered={true}
                >
                    <Button
                        primary={true}
                        disabled={this.state.message.length <= 0}
                        content="Send Query"
                        onClick={this.handleClick}
                        loading={this.state.loading}
                    />
                </Grid.Row>

            </Grid>

        )
    }
}
