import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import CoinActionButton from './CoinActionButton';
import styles from './CoinDisplayer.style';
import { params, ctx, COIN_STATUS, servers } from '../config';
import Coin from '../../lib/Coin';
import { wait, signCoin } from '../utils/api';
import CoinSig from '../../lib/CoinSig';

class CoinDisplayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coinState: COIN_STATUS.created,
      randomizedSignature: null,
    };
  }

  getSignatures = async (serversArg) => {
    const signatures = await Promise.all(serversArg.map(async (server) => {
      try {
        console.log(`Sending request to ${server}...`);
        const signature = await signCoin(server, this.props.coin);
        const [hBytes, sigBytes] = signature;

        const h = ctx.ECP.fromBytes(hBytes);
        const sig = ctx.ECP.fromBytes(sigBytes);

        return [h, sig];
      } catch (err) {
        return null;
      }
    }));
    return signatures;
  };

  aggregateAndRandomizeSignatures = (signatures) => {
    // checks if all authorities signed the coin, if not, return error
    for (let i = 0; i < signatures.length; i++) {
      if (signatures[i] === null) {
        return;
      }
    }
    const aggregateSignature = CoinSig.aggregateSignatures(params, signatures);
    const randomizedSignature = CoinSig.randomize(params, aggregateSignature);
    this.setState({ randomizedSignature });
  };

  handleCoinSign = async () => {
    this.setState({ coinState: COIN_STATUS.signing });
    console.log('Coin sign request(s) were sent');
    const signatures = await this.getSignatures(servers);
    this.aggregateAndRandomizeSignatures(signatures);
    if (this.state.randomizedSignature !== null) {
      this.setState({ coinState: COIN_STATUS.signed });
    } else {
      this.setState({ coinState: COIN_STATUS.error });
    }
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
