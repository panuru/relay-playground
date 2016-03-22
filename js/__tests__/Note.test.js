/* eslint-env jest, jasmine */

jest.unmock('../components/Note');
jest.unmock('../mutations/UpdateNoteMutation');
jest.unmock('../mutations/DeleteNoteMutation');

import React from 'react';
import Relay from 'react-relay';
import TestUtils from 'react-addons-test-utils';
import Note from '../components/Note';
import UpdateNoteMutation from '../mutations/UpdateNoteMutation';
import DeleteNoteMutation from '../mutations/DeleteNoteMutation';
import fixtures from '../__fixtures__/all-fixtures';

describe('Note', () => {
  let note;

  beforeEach(() => {
    note = TestUtils.renderIntoDocument(
      <Note note={ fixtures.note } notebook={ fixtures.notebook } />
    );
  });

  it('should render single note', () => {
    expect(note.refs.noteText.textContent).toEqual(fixtures.note.text);

    let expectedTimestamp = note._getFormattedDate(fixtures.note.timestamp);

    expect(note.refs.noteTimestamp.textContent).toEqual(expectedTimestamp);
  });

  it('should toggle editing state', () => {
    expect(note.state.isEditing).toEqual(false);

    TestUtils.Simulate.click(note.refs.editButton);
    expect(note.state.isEditing).toEqual(true);

    TestUtils.Simulate.blur(note.refs.editNoteInput);
    expect(note.state.isEditing).toEqual(false);

  });

  it('should display original note text in edit form', () => {
    TestUtils.Simulate.click(note.refs.editButton);
    expect(note.refs.editNoteInput.value).toEqual(fixtures.note.text);
  });

  it('should update note text', () => {
    spyOn(Relay.Store, 'commitUpdate');

    TestUtils.Simulate.click(note.refs.editButton);

    note.refs.editNoteInput.value = 'hello';
    TestUtils.Simulate.submit(note.refs.editNoteForm);

    expect(Relay.Store.commitUpdate).toHaveBeenCalled();

    let mutation = Relay.Store.commitUpdate.calls.argsFor(0)[0];
    let mutationVariables = mutation.getVariables();

    expect(mutation instanceof UpdateNoteMutation).toEqual(true);
    expect(mutationVariables.text).toEqual('hello');
  });

  it('should delete note', () => {
    spyOn(Relay.Store, 'commitUpdate');

    TestUtils.Simulate.click(note.refs.deleteButton);

    expect(Relay.Store.commitUpdate).toHaveBeenCalled();

    let mutation = Relay.Store.commitUpdate.calls.argsFor(0)[0];
    let mutationVariables = mutation.getVariables();

    expect(mutation instanceof DeleteNoteMutation).toEqual(true);
    expect(mutationVariables.id).toEqual(fixtures.note.id);
  });
});
