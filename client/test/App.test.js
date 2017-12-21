import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import App from '../src/components/App';
import {Header} from 'semantic-ui-react';
import MainView from '../src/components/MainView';


describe('App Component', () => {
    it('Should have two children', () => {
        const wrapper = shallow(<App />);
        expect(wrapper.children().length).to.equal(2);
    });

    it('Contains a Header component', () => {
        const wrapper = mount(<App/>);
        expect(wrapper.find(Header)).to.have.length(1);
    });

    it('Contains a MainView component', () => {
        const wrapper = mount(<App/>);
        expect(wrapper.find(MainView)).to.have.length(1);
    });
});

