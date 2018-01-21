import React from 'react';
import PropTypes from 'prop-types';
import { Table, Header, Icon } from 'semantic-ui-react';
import { SERVER_STATUS, PKs, SERVER_TYPES, DEBUG } from '../config';
import { getPublicKey } from '../utils/api';

const statusStyle = {
  fontWeight: 'bold',
  display: 'inline',
};

const ServerStatusInfo = (props) => {
  switch (props.status) {
    case SERVER_STATUS.alive:
      return (
        <div>
          <Icon name="checkmark" color="green" size="large"/>
          <p style={statusStyle}>{props.status}</p>
        </div>
      );

    case SERVER_STATUS.loading:
      return (
        <div>
          <Icon name="circle notched" loading size="large"/>
          <p style={statusStyle}>{props.status}</p>
        </div>
      );

    case SERVER_STATUS.down:
    default:
      return (
        <div>
          <Icon name="remove" color="red" size="large"/>
          <p style={statusStyle}>{props.status}</p>
        </div>
      );
  }
};

ServerStatusInfo.propTypes = {
  status: PropTypes.string.isRequired,
};


class ServerStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: SERVER_STATUS.loading,
    };
  }

  async componentDidMount() {
    await this.checkServerStatus();
  }

  checkServerStatus = async () => {
    // if this is a signing authority, we might as well get its public key since we will need it later
    if (this.props.type === SERVER_TYPES.signing) {
      if (PKs[this.props.address] === null || PKs[this.props.address] === []) {
        if (DEBUG) {
          console.log(`Getting Public Key of ${this.props.address}...`);
        }
        const publicKey = await getPublicKey(this.props.address);
        PKs[this.props.address] = publicKey;
      }
      if (PKs[this.props.address] === null || PKs[this.props.address] === []) {
        this.setState({ status: SERVER_STATUS.down });
      } else {
        this.setState({ status: SERVER_STATUS.alive });
      }
    } else if (this.props.type === SERVER_TYPES.merchant) {
      console.log('todo: api for merchant to check status');
    }
  };

  render() {
    return (
      <Table.Row>
        <Table.Cell>
          <Header as="h4">
            <Header.Content>
              {this.props.address}
              <Header.Subheader>{this.props.type}</Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>
          <ServerStatusInfo status={this.state.status}/>
        </Table.Cell>
      </Table.Row>
    );
  }
}


ServerStatus.propTypes = {
  address: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default ServerStatus;
