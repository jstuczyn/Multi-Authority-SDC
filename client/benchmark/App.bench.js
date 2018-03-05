import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import App from '../src/components/App';

describe('Benchmarking', () => {
  it('App was loaded...', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.children().length).to.equal(3);
  });
});
