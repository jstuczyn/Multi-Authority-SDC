import React from 'react';
import { expect } from 'chai';
import { before } from 'mocha';
import sinon from 'sinon';
import { shallow, mount, render } from 'enzyme';
import CoinDisplayer from '../src/components/CoinDisplayer';
import CoinActionButton from '../src/components/CoinActionButton';
import MainView from '../src/components/MainView';
import { COIN_STATUS } from '../src/config';

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
  // more to come as Component is developed
});
