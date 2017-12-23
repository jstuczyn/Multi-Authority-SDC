import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import SubmitButton from '../src/components/SubmitButton';
import CoinRequester from '../src/components/CoinRequester';
import sinon from 'sinon';

describe('SubmitButton Component', () => {
    it('Should have received "onSubmit" function as a prop', () => {
        const mainWrapper = mount(<CoinRequester/>);
        const wrapper = mainWrapper.find(SubmitButton);
        expect(wrapper.props().onSubmit).to.be.a("Function");
    });

    it('Should have received "isDisabled" boolean as a prop', () => {
        const mainWrapper = mount(<CoinRequester/>);
        const wrapper = mainWrapper.find(SubmitButton);
        expect(wrapper.props().isDisabled).to.be.a("boolean");
    });

    it('The "disabled" attribute of the button should be the same one as received in props', () => {
        let wrapper = mount(<SubmitButton isDisabled={true}/>);
        let buttonNode = wrapper.find('button');
        expect(buttonNode.props().disabled).to.be.a("boolean").to.equal(true);

        let wrapper2 = mount(<SubmitButton isDisabled={false}/>);
        let buttonNode2 = wrapper2.find('button');
        expect(buttonNode2.props().disabled).to.equal(false || undefined)
    });

    it('Should call "handleCoinSubmit" sent from CoinRequester Component when there is a valid value in input field', () => {
        const callback = sinon.spy();
        const mainWrapper = mount(<CoinRequester handleCoinSubmit = {callback}/>);

        mainWrapper.find('input').simulate('change', {target: {value: '42'}});
        mainWrapper.find('button').simulate('click');

        expect(callback.calledOnce).to.equal(true);
    });

});