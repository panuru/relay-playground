/* eslint-env jest, jasmine */

jest.unmock('../Notebook');

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Notebook from '../Notebook';
import fixtures from '../__fixtures__/all-fixtures';

describe('Notebook', () => {
  let notebook;

  console.log(fixtures.notebook);

  beforeEach(() => {
    notebook = TestUtils.renderIntoDocument(
      <Notebook notebook={ fixtures.notebook } />
    );
  });

  it('should render notebook', () => {
    expect(notebook.refs.notes.length).toEqual(fixtures.notebook.notes.length);
  });
});
