import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import CoinActionButton from './CoinActionButton';
import styles from './CoinDisplayer.style';
import { params, ctx, COIN_STATUS, signingServers, merchant } from '../config';
import Coin from '../../lib/Coin';
import { wait, signCoin, spendCoin } from '../utils/api';
import CoinSig from '../../lib/CoinSig';
import { getProofOfSecret } from '../utils/helpers';

//temp
import { getSimplifiedProof } from "../utils/helpers";

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
    const signatures = await this.getSignatures(signingServers);
    this.aggregateAndRandomizeSignatures(signatures);
    if (this.state.randomizedSignature !== null) {
      console.log('Coin was signed and signatures were aggregated and randomized.');
      this.setState({ coinState: COIN_STATUS.signed });
    } else {
      console.log('There was an error in signing/aggregating the coin');
      this.setState({ coinState: COIN_STATUS.error });
    }
  };

  handleCoinSpend = async () => {
    this.setState({ coinState: COIN_STATUS.spending });
    const secretProof = getProofOfSecret(this.props.sk);
    console.log('Coin spend request was sent');
    const success = await spendCoin(this.props.coin, secretProof, this.state.randomizedSignature, merchant);
    if (success) {
      console.log('Coin was successfully spent.');
      this.setState({ coinState: COIN_STATUS.spent });
    } else {
      console.log('There was an error in spending the coin');
      this.setState({ coinState: COIN_STATUS.error });
    }
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
  sk: PropTypes.shape({
    w: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};

export default CoinDisplayer;
