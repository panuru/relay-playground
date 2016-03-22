/* eslint-env jest, jasmine */

jest.unmock('../Notebook');
jest.unmock('../../mutations/AddNoteMutation');

import React from 'react';
import Relay from 'react-relay';
import TestUtils from 'react-addons-test-utils';
import Notebook from '../Notebook';
import AddNoteMutation from '../../mutations/AddNoteMutation';
import fixtures from '../__fixtures__/all-fixtures';

describe('Notebook', () => {
  let notebook;

  beforeEach(() => {
    notebook = TestUtils.renderIntoDocument(
      <Notebook notebook={fixtures.notebook} />
    );
  });

  it('should render notes', () => {
    expect(notebook.refs.notes.childNodes.length)
      .toEqual(fixtures.notebook.notes.edges.length);
  });

  it('should add a note', () => {
    spyOn(Relay.Store, 'commitUpdate');

    notebook.refs.addNoteInput.value = 'hello';
    TestUtils.Simulate.submit(notebook.refs.addNoteForm);

    expect(Relay.Store.commitUpdate).toHaveBeenCalled();

    let mutation = Relay.Store.commitUpdate.calls.argsFor(0)[0];
    let mutationVariables = mutation.getVariables();

    expect(mutation instanceof AddNoteMutation).toEqual(true);
    expect(mutationVariables.text).toEqual('hello');
  });
});
