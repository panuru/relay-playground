/* eslint-env jest, jasmine */

jest.unmock('../Note');

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Note from '../Note';
import fixtures from '../__fixtures__/all-fixtures';

describe('Note', () => {
  let note;

  beforeEach(() => {
    note = TestUtils.renderIntoDocument(
      <Note note={ fixtures.note } notebook={ fixtures.notebook } />
    );
  });

  it('should render single note', () => {
    expect(note.refs.editNoteInput.value).toEqual(fixtures.note.text);
  });
});
