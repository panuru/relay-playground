/* eslint-env jest, jasmine */

jest.unmock('../components/Notebook');
jest.unmock('../mutations/AddNoteMutation');

import React from 'react';
import Relay from 'react-relay';
import TestUtils from 'react-addons-test-utils';
import Notebook from '../components/Notebook';
import AddNoteMutation from '../mutations/AddNoteMutation';
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

  it('should render notes count', () => {
    expect(notebook.refs.notesCount.textContent)
      .toEqual(fixtures.notebook.notes.edges.length.toString());
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
