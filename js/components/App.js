/* eslint react/prefer-stateless-function: 0 */
import '../../css/components/App.scss';

import React from 'react';
import Relay from 'react-relay';
import AddNoteMutation from '../mutations/AddNoteMutation';

class App extends React.Component {
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
        <h1 className="notebook__header">My notes</h1>
        <ul className="notebook__content notes">
          {this.props.notebook.notes.edges.map(edge =>
            <li className="notes__item note" key={edge.node.id}>
              {edge.node.text}
              <div className="note__timestamp">(@{edge.node.timestamp})</div>
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
            <input
              className="button add-note-form__button"
              type="submit"
              value="+"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    notebook: () => Relay.QL`
      fragment on Notebook {
        id,
        notes(first: 10) {
          edges {
            node {
              id,
              text,
              timestamp
            },
          },
        },
        ${AddNoteMutation.getFragment('notebook')},
      }
    `,
  },
});
