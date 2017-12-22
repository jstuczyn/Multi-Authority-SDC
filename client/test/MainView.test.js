import React from 'react';
import { expect, assert } from 'chai';
import { shallow, mount, render } from 'enzyme';
import MainView from '../src/components/MainView';
import {Grid} from 'semantic-ui-react';
import CoinRequester from '../src/components/CoinRequester';
import CoinListDisplayer from '../src/components/CoinListDisplayer';
import BLSSig from '../lib/BLSSig';

describe('MainView Component', () => {
    it('Has a single Grid Child', () => {
        const wrapper = mount(<MainView/>);
        expect(wrapper.children().length).to.equal(1);
    });

    it('Has mounted CoinRequester', () => {
        const wrapper = mount(<MainView/>);
        expect(wrapper.find(CoinRequester)).to.have.length(1);
    });

    it('Has mounted CoinListDisplayer', () => {
        const wrapper = mount(<MainView/>);
        expect(wrapper.find(CoinListDisplayer)).to.have.length(1);
    });



    describe("Coin generation", () => {
        const coinValue = 42;
        const wrapper = mount(<MainView/>);
        const input = wrapper.find(CoinRequester).find('input');
        //input value
        input.simulate('change', {target: {value: coinValue}});

        //submit value
        const button = wrapper.find(CoinRequester).find('button');
        button.simulate('click');
        
        it('Upon submitting coin of given value, the Coin object has that value', () => {
            expect(wrapper.state('coins')[0].coin.value).to.equal(coinValue);
        });

        it("Coin's PK = g2^SK", () => {
            const params = BLSSig.setup();
            const [G, o, g1, g2, e] = params;
            const sk = wrapper.state('coins')[0].sk;
            const pk = wrapper.state('coins')[0].coin.v;

            assert.isTrue(pk.equals(G.ctx.PAIR.G2mul(g2, sk)));
        });
    });
});