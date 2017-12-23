import React from 'react';
import {expect} from 'chai';
import {shallow, mount, render} from 'enzyme';
import CoinDisplayer from '../src/components/CoinDisplayer';
import MainView from '../src/components/MainView';

describe('CoinDisplayer Component', () => {
    describe('Should have received Coin as a prop', () => {
        const coinValue = 42;
        const wrapper = mount(<MainView/>);
        wrapper.find('input').simulate('change', {target: {value: coinValue}});
        wrapper.find('button').simulate('click');

        const coinDisplayerNode = wrapper.find(CoinDisplayer);

        it('That has TTL in a future', () => {
            expect(coinDisplayerNode.props.coin.ttl).toBeGreaterThan(new Date().getTime());
        });

        it('That has the same value as from the input', () => {
            expect(coinDisplayerNode.props.coin.value).to.equal(coinValue);
        });

    });

    // more to come as Component is developed

});
