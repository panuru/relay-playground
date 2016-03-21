jest.unmock('../Note');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Note from '../Note';

describe('Note', () => {
  it('should run tests', () => {
    expect(2 + 2).toEqual(4);
  })
})
