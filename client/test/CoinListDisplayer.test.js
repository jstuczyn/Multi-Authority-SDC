import React from 'react';
import {expect} from 'chai';
import {shallow, mount, render} from 'enzyme';
import CoinDisplayer from '../src/components/CoinDisplayer';
import MainView from '../src/components/MainView';
import CoinListDisplayer from '../src/components/CoinListDisplayer';

let coinListDisplayerNode;

describe('CoinListDisplayer Component', () => {
    let wrapper;
    before(() => {
        wrapper = mount(<MainView/>);
        wrapper.find('input').simulate('change', {target: {value: 42}});
        wrapper.find('button').simulate('click');

        wrapper.find('input').simulate('change', {target: {value: 43}});
        wrapper.find('button').simulate('click');

        coinListDisplayerNode = wrapper.find(CoinListDisplayer);
    });

    it('Should have received array of {sk, coin} objects', () => {
        expect(coinListDisplayerNode.props().coins).to.be.an("Array").to.not.be.empty;
        expect(coinListDisplayerNode.props().coins[0]).to.be.an("object").to.not.be.empty;
        expect(coinListDisplayerNode.props().coins[1]).to.be.an("object").to.not.be.empty;
        expect(coinListDisplayerNode.props().coins[0].sk).to.be.an("object").to.not.be.empty;
        expect(coinListDisplayerNode.props().coins[0].coin).to.be.an("object").to.not.be.empty;
        expect(coinListDisplayerNode.props().coins[1].sk).to.be.an("object").to.not.be.empty;
        expect(coinListDisplayerNode.props().coins[1].coin).to.be.an("object").to.not.be.empty;
    });

    it('Contains as many CoinDisplayer children as it got coin objects in props', () => {
        const coinDisplayerNodes = wrapper.find(CoinDisplayer);
        expect(coinDisplayerNodes).to.have.length(2);

        const wrapper2 = mount(<CoinListDisplayer coins={[]}/>);
        const coinDisplayerNodes2 = wrapper2.find(CoinDisplayer);
        expect(coinDisplayerNodes2).to.have.length(0);

        const wrapper3 = mount(<CoinListDisplayer coins={[{"sk" : {}, "coin" : {}}]}/>);
        const coinDisplayerNodes3 = wrapper3.find(CoinDisplayer);
        expect(coinDisplayerNodes3).to.have.length(1);
    })
});