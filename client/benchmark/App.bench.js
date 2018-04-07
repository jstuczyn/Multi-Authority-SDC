import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import App from '../src/components/App';
import CoinRequester from '../src/components/CoinRequester';
import CoinDisplayer from '../src/components/CoinDisplayer';

const MAX_REPETITIONS = 1000;

describe('Benchmarking', () => {
  it('Coin Issuance, Sign, Spend', async () => {
    const wrapper = mount(<App />);
    for (let i = 0; i < MAX_REPETITIONS + 2; i++) {
      const t0 = performance.now();
      await wrapper.find(CoinRequester).at(0).props().handleCoinSubmit(1); // gets coin from the issuer
      const t1 = performance.now();
      wrapper.update(); // to include new CoinDisplayer component
      const t2 = performance.now();
      await wrapper.find(CoinDisplayer).at(i).instance().handleCoinSign(); // signs it with all authorities
      const t3 = performance.now();
      await wrapper.find(CoinDisplayer).at(i).instance().handleCoinSpend(); // spends and deposits it
      const t4 = performance.now();
      if (i >= 2) {
        console.log(`${t1 - t0},${t3 - t2}, ${t4 - t3}`);
      }
    }
  });
});
