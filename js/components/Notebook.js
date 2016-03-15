import '../../css/components/Notebook.scss';

import React from 'react';
import Relay from 'react-relay';
import Note from './Note';
import AddNoteMutation from '../mutations/AddNoteMutation';

class Notebook extends React.Component {
  constructor() {
    super();
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleSubmit(e) {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new AddNoteMutation({
        notebook: this.props.notebook,
        text: this.refs.addNoteInput.value,
      })
    );
    this.refs.addNoteInput.value = '';
  }

  render() {
    return (
      <div className="notebook">
        <ul className="notebook__content notes">
          {this.props.notebook.notes.edges.map(edge =>
            <li className="notes__item" key={edge.node.id}>
              <Note note={edge.node} />
            </li>
          )}
        </ul>
        <form className="add-note-form" onSubmit={this._handleSubmit}>
          <div className="input-with-button input-with-button--small">
            <input ref="addNoteInput"
              className="input add-note-form__input"
              type="text"
              placeholder="Write a new note here"
            />
            <button
              className="button add-note-form__button icon icon-arrow-right2"
              type="submit"
              value=""
            />
          </div>
        </form>
      </div>
    );
  }
}

export default Relay.createContainer(Notebook, {
  fragments: {
    notebook: () => Relay.QL`
      fragment on Notebook {
        id,
        notes(first: 10) {
          edges {
            node {
              id,
              ${Note.getFragment('note')}
            },
          },
        },
        ${AddNoteMutation.getFragment('notebook')}
      }
    `,
  },
});