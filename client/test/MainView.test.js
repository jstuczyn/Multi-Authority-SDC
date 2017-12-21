import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import MainView from '../src/components/MainView';
import {Grid} from 'semantic-ui-react';
import CoinRequester from '../src/components/CoinRequester';

describe('MainView Component', () => {
    it('Has a single Grid Child', () => {
        const wrapper = mount(<MainView/>);
        expect(wrapper.children().length).to.equal(1);
    });
    it('Has mounted CoinRequester', () => {
        const wrapper = mount(<MainView/>);
        expect(wrapper.find(CoinRequester)).to.have.length(1);
    });
});