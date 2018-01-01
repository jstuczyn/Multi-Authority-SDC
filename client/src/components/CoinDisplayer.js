import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import CoinActionButton from './CoinActionButton';
import styles from './CoinDisplayer.style';
import { ctx, COIN_STATUS, servers } from '../config';
import Coin from '../../lib/Coin';
import { wait, signCoin } from '../utils/api';

class CoinDisplayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coinState: COIN_STATUS.created,
    };
  }

  handleCoinSign = async () => {
    this.setState({ coinState: COIN_STATUS.signing });
    console.log('Coin sign request was sent');

    const signature = await signCoin(servers[0], this.props.coin);
    const [hBytes, sigBytes] = signature;

    const h = ctx.ECP.fromBytes(hBytes);
    const sig = ctx.ECP.fromBytes(sigBytes);

    console.log(h.toString(), sig.toString());
    // todo: put it to state and then get aggregate

    this.setState({ coinState: COIN_STATUS.signed });
  };

  handleCoinSpend = async () => {
    this.setState({ coinState: COIN_STATUS.spending });
    console.log('Coin spend request was sent (TODO)');

    const waiting = await wait(1000); // simulates async call to the verifier

    console.log('Coin was spent (TODO)');
    this.setState({ coinState: COIN_STATUS.spent });
  };

  render() {
    return (
      <Segment.Group horizontal>
        <Segment style={styles.segmentStyle}>Time to live: {this.props.coin.ttl}</Segment>
        <Segment style={styles.segmentStyle}>Value: {this.props.coin.value}</Segment>
        <Segment style={styles.segmentStyle}>
          <CoinActionButton
            onSign={this.handleCoinSign}
            onSpend={this.handleCoinSpend}
            coinState={this.state.coinState}
          />
        </Segment>
      </Segment.Group>
    );
  }
}

CoinDisplayer.propTypes = {
  coin: PropTypes.instanceOf(Coin).isRequired,
};

export default CoinDisplayer;
