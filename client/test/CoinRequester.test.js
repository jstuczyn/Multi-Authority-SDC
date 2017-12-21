import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import ValueInput from '../src/components/ValueInput';
import SubmitButton from '../src/components/SubmitButton';
import CoinRequester from '../src/components/CoinRequester';
import sinon from 'sinon';

describe('CoinRequester Component', () => {
    it('Contains a ValueInput component', () => {
        const wrapper = mount(<CoinRequester/>);
        expect(wrapper.find(ValueInput)).to.have.length(1);
    });

    it('Contains a SubmitButton component', () => {
        const wrapper = mount(<CoinRequester/>);
        expect(wrapper.find(SubmitButton)).to.have.length(1);
    });

    it('Should have initial value state of 0', () => {
        const wrapper = mount(<CoinRequester/>);
        expect(wrapper.state().value).to.equal(0);
    });

    it('Should have initial isProcessing state of false', () => {
        const wrapper = mount(<CoinRequester/>);
        expect(wrapper.state().isProcessing).to.equal(false);
    });

    it('', () => {
        // const onClickSpy = sinon.spy();
        // const wrapper = mount(<CoinRequester/>);
        // const testValue = 42;
        // wrapper.setState({value: testValue});
        //
        // expect(onClickSpy.calledOnce).to.equal(true);
        // expect(onClickSpy.calledWith(testValue)).to.equal(true);
    })

});
