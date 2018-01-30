import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import CoinRequester from './CoinRequester';
import CoinListDisplayer from './CoinListDisplayer';
// import { getCoin } from '../utils/coinGenerator';
import { getCoin } from '../utils/api';
import Coin from '../../lib/Coin';
import { params, DEBUG, DETAILED_DEBUG, issuer } from '../config';
import ElGamal from '../../lib/ElGamal';

class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: [],
      ElGamalSK: null,
      ElGamalPK: null,
    };
  }

  componentWillMount() {
    // generate ElGamal keypair
    const [sk, pk] = ElGamal.keygen(params);
    this.setState({
      ElGamalSK: sk,
      ElGamalPK: pk,
    });

    if (DEBUG) {
      console.log('Generated ElGamal keypair.');
      if (DETAILED_DEBUG) {
        console.log('Keys:', sk, pk);
      }
    }
  }

  handleCoinSubmit = async (value) => {
    const [sk, pk] = Coin.keygen(params);
    const [coin, id] = await getCoin(sk, pk, value, issuer);
    this.setState(prevState => ({
      coins: prevState.coins.concat([{ sk, id, coin }]),
    }));
  };

  render() {
    return (
      <Segment style={{ padding: '8em 0em' }} vertical>
        <Header
          as="h2"
          color="teal"
          textAlign="center"
          content="Generate a coin (locally by a client)"
        />
        <Grid>
          <Grid.Row centered={true}>
            <CoinRequester handleCoinSubmit={this.handleCoinSubmit} />
          </Grid.Row>

          <Grid.Row centered={true}>
            <CoinListDisplayer
              coins={this.state.coins}
              ElGamalSK={this.state.ElGamalSK}
              ElGamalPK={this.state.ElGamalPK}
            />
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default MainView;
