import React from 'react';
import { assert, expect } from 'chai';
import { before } from 'mocha';
import sinon from 'sinon';
import { shallow, mount, render } from 'enzyme';
import CoinDisplayer from '../src/components/CoinDisplayer';
import CoinActionButton from '../src/components/CoinActionButton';
import MainView from '../src/components/MainView';
import { params, COIN_STATUS, signingServers } from '../src/config';
import { getCoin } from '../src/utils/coinGenerator';
import CoinSig from '../lib/CoinSig';
import Coin from '../lib/Coin';
import { getPublicKey } from '../src/utils/api';

let coinDisplayerNode;

describe('CoinDisplayer Component', () => {
  const coinValue = 42;
  before(() => {
    const wrapper = mount(<MainView />);
    wrapper.find('input').simulate('change', { target: { value: coinValue } });
    wrapper.find('button').simulate('click');

    coinDisplayerNode = wrapper.find(CoinDisplayer);
  });
  describe('Should have received Coin as a prop', () => {
    it('That has TTL in a future', () => {
      expect(coinDisplayerNode.props().coin.ttl > new Date().getTime()).to.equal(true);
    });

    it('That has the same value as from the input', () => {
      expect(coinDisplayerNode.props().coin.value).to.equal(coinValue);
    });
  });
  // save time by not generating entire object that we do not need anyway
  const dummyCoin = {
    coin: {
      ttl: new Date().getTime(),
      value: 42,
    },
  };

  describe('CoinActionButton child behaviour', () => {
    it('Has CoinActionButton child component', () => {
      const wrapper = mount(<CoinDisplayer coin={dummyCoin} />);

      expect(coinDisplayerNode.find(CoinActionButton)).to.have.length(1);
    });

    it('If CoinDisplayer has coinState "Generated", CoinActionButton will call "handleCoinSign" on click', () => {
      const wrapper = mount(<CoinDisplayer coin={dummyCoin} />);
      wrapper.setState({ coinState: COIN_STATUS.created });
      const spy = sinon.spy(wrapper.instance(), 'handleCoinSign');

      wrapper.instance().forceUpdate();

      wrapper.find('button').simulate('click');
      expect(spy.calledOnce).to.equal(true);
    });

    it('If CoinDisplayer has coinState "Signed", CoinActionButton will call "handleCoinSpend" on click', () => {
      const wrapper = mount(<CoinDisplayer coin={dummyCoin} />);
      wrapper.setState({ coinState: COIN_STATUS.signed });
      const spy = sinon.spy(wrapper.instance(), 'handleCoinSpend');

      wrapper.instance().forceUpdate();

      wrapper.find('button').simulate('click');
      expect(spy.calledOnce).to.equal(true);
    });
  });

  describe('getSignatures method (REQUIRES SERVERS SPECIFIED IN config.js TO BE UP)', () => {
    it('Gets valid signatures from all alive signingServers', async () => {
      const [coin_sk, coin_pk] = Coin.keygen(params);
      const coin = getCoin(coin_pk, 42);

      const wrapper = mount(<CoinDisplayer coin={coin} />);

      const signatures = await wrapper.instance().getSignatures(signingServers);
      const publicKeys = await Promise.all(signingServers.map(async server => getPublicKey(server)));

      for (let i = 0; i < signatures.length; i++) {
        expect(CoinSig.verify(params, publicKeys[i], coin, signatures[i])).to.equal(true);
      }
    });

    it('Gets null if one of requests produced an error (such is if server was down)', async () => {
      const invalidServers = signingServers.slice();
      invalidServers.push('127.0.0.1:4000');
      const [coin_sk, coin_pk] = Coin.keygen(params);
      const coin = getCoin(coin_pk, 42);

      const wrapper = shallow(<CoinDisplayer coin={coin} />);

      const signatures = await wrapper.instance().getSignatures(invalidServers);

      assert.isNull(signatures[signatures.length - 1]);
    });
  });

  describe('aggregateAndRandomizeSignatures method (REQUIRES SERVERS SPECIFIED IN config.js TO BE UP)', () => {
    it('Produces a valid randomized, aggregate signature and sets state appropriately', async () => {
      const [coin_sk, coin_pk] = Coin.keygen(params);
      const coin = getCoin(coin_pk, 42);

      const wrapper = mount(<CoinDisplayer coin={coin} />);

      const signatures = await wrapper.instance().getSignatures(signingServers);
      const publicKeys = await Promise.all(signingServers.map(async server => getPublicKey(server)));

      const aggregatePublicKey = CoinSig.aggregatePublicKeys(params, publicKeys);

      wrapper.instance().aggregateAndRandomizeSignatures(signatures);
      assert.isNotNull(wrapper.state('randomizedSignature'));
      expect(CoinSig.verify(params, aggregatePublicKey, coin, wrapper.state('randomizedSignature'))).to.equal(true);
    });

    it("If one of signatures was null, aggregate won't be created and state will be set appropriately", async () => {
      const invalidServers = signingServers.slice();
      invalidServers.push('127.0.0.1:5000');
      const [coin_sk, coin_pk] = Coin.keygen(params);
      const coin = getCoin(coin_pk, 42);

      const wrapper = shallow(<CoinDisplayer coin={coin} />);

      const signatures = await wrapper.instance().getSignatures(invalidServers);
      wrapper.instance().aggregateAndRandomizeSignatures(signatures);

      assert.isNull(wrapper.state('randomizedSignature'));
    });
  });
});
