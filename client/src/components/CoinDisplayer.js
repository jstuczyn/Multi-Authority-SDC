import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import CoinActionButton from './CoinActionButton';
import styles from './CoinDisplayer.style';
import { params, ctx, COIN_STATUS, signingServers, merchant, DEBUG } from '../config';
import Coin from '../../lib/Coin';
import { wait, signCoin, spendCoin } from '../utils/api';
import CoinSig from '../../lib/CoinSig';
import { getProofOfSecret } from '../utils/helpers';

class CoinDisplayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coinState: COIN_STATUS.created,
      randomizedSignature: null,
      remainingValidityString: '',
    };
  }

  componentDidMount() {
    this.timer = setInterval(this.updateRemainingValidityString, 200);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // todo: put all elgamal stuff here
  getSignatures = async (serversArg) => {
    const signatures = await Promise.all(serversArg.map(async (server) => {
      try {
        // for test sake
        server = serversArg[0];
        if (DEBUG) {
          console.log(`Sending request to ${server}...`);
        }

        const signature = await signCoin(server, this.props.coin, this.props.ElGamalPK, params, this.props.id, this.props.sk);

        // todo: decrypt signature
        return null;
        //
        // console.log('signed', signature);
        //
        // const [hBytes, sigBytes] = signature;
        //
        // const h = ctx.ECP.fromBytes(hBytes);
        // const sig = ctx.ECP.fromBytes(sigBytes);
        //
        // return [h, sig];
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

  updateRemainingValidityString = () => {
    let remainingValidityString;
    switch (this.state.coinState) {
      case COIN_STATUS.spent: {
        remainingValidityString = 'Coin was spent';
        clearInterval(this.timer);
        break;
      }
      case COIN_STATUS.error: {
        remainingValidityString = 'Error occurred';
        clearInterval(this.timer);
        break;
      }
      default: {
        const currentTime = new Date().getTime();
        const td = this.props.coin.ttl - currentTime;
        const seconds = Math.floor((td / 1000) % 60);
        const minutes = Math.floor((td / 1000 / 60) % 60);
        const hours = Math.floor((td / (1000 * 60 * 60)));

        const ss = (`0${seconds}`).slice(-2);
        const mm = (`0${minutes}`).slice(-2);
        const hh = (`0${hours}`).slice(-2);
        remainingValidityString = `${hh}:${mm}:${ss}`;
        break;
      }
    }

    this.setState({ remainingValidityString: remainingValidityString });
  };

  handleCoinSign = async () => {
    this.setState({ coinState: COIN_STATUS.signing });
    if (DEBUG) {
      console.log('Coin sign request(s) were sent');
    }
    const signatures = await this.getSignatures(signingServers);
    this.aggregateAndRandomizeSignatures(signatures);
    if (this.state.randomizedSignature !== null) {
      if (DEBUG) {
        console.log('Coin was signed and signatures were aggregated and randomized.');
      }
      this.setState({ coinState: COIN_STATUS.signed });
    } else {
      if (DEBUG) {
        console.log('There was an error in signing/aggregating the coin');
      }
      this.setState({ coinState: COIN_STATUS.error });
    }
  };

  handleCoinSpend = async () => {
    this.setState({ coinState: COIN_STATUS.spending });
    const secretProof = getProofOfSecret(this.props.sk);
    if (DEBUG) {
      console.log('Coin spend request was sent');
    }
    const success = await spendCoin(this.props.coin, secretProof, this.state.randomizedSignature, merchant);
    if (success) {
      if (DEBUG) {
        console.log('Coin was successfully spent.');
      }
      this.setState({ coinState: COIN_STATUS.spent });
    } else {
      if (DEBUG) {
        console.log('There was an error in spending the coin');
      }
      this.setState({ coinState: COIN_STATUS.error });
    }
  };

  render() {
    return (
      <Segment.Group horizontal>
        <Segment style={styles.segmentStyle}><b>Valid for:</b> {this.state.remainingValidityString}</Segment>
        <Segment style={styles.segmentStyle}><b>Value:</b> {this.props.coin.value}</Segment>
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
  id: PropTypes.shape({
    w: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  ElGamalSK: PropTypes.object.isRequired,
  ElGamalPK: PropTypes.object.isRequired,
};

export default CoinDisplayer;
