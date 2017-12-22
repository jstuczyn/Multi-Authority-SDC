import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import MainView from '../src/components/MainView';
import {Grid} from 'semantic-ui-react';
import CoinRequester from '../src/components/CoinRequester';
import CoinListDisplayer from '../src/components/CoinListDisplayer';


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

    it('Upon submitting coin of given value, the Coin object has that value', () => {
        const wrapper = mount(<MainView/>);
        // const input = wraper.find(<CoinRequester/>)
        // console.log(input)
    });

    it("Coin's PK = g2^x", () => {

    });
});