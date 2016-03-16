import '../../css/components/Note.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import moment from 'moment';
import UpdateNoteMutation from '../mutations/UpdateNoteMutation';
import DeleteNoteMutation from '../mutations/DeleteNoteMutation';

class Note extends React.Component {
  constructor() {
    super();

    this.state = {
      isEditing: false
    };

    this._handleEdit = this._handleEdit.bind(this);
    this._handleUpdate = this._handleUpdate.bind(this);
    this._handleCancelEdit = this._handleCancelEdit.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
  }

  componentDidUpdate() {
    if (this.state.isEditing) {
      ReactDOM.findDOMNode(this.refs.editNoteInput).focus();
    }
  }

  _handleEdit(e) {
    e.preventDefault();
    this.setState({ isEditing: true });
  }

  _handleCancelEdit(e) {
    e.preventDefault();
    this.setState({ isEditing: false });
  }

  _handleUpdate(e) {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new UpdateNoteMutation({
        note: this.props.note,
        text: this.refs.editNoteInput.value,
      })
    );
    this.setState({ isEditing: false });
  }

  _handleDelete(e) {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new DeleteNoteMutation({
        note: this.props.note,
        notebook: this.props.notebook,
      })
    );
  }

  _getFormattedDate() {
    return moment(this.props.note.timestamp).calendar();
  }

  render() {
    const text = this.props.note.text;
    return (
      <div
        ref="noteElement"
        className={this.state.isEditing ? 'note note--is-editing' : 'note'}
      >
        <span className="note__text">{text}</span>
        <form className="note__edit-form" onSubmit={this._handleUpdate}>
          <input
            ref="editNoteInput"
            type="text"
            className="input note__edit-form__input"
            defaultValue={text}
            onBlur={this._handleCancelEdit}
          />
        </form>
        <div className="note__actions">
          <a className="action icon icon-pencil" href="#" onClick={this._handleEdit} />
          <a className="action icon icon-bin" href="#" onClick={this._handleDelete} />
        </div>
        <div className="note__timestamp">
          {this._getFormattedDate()}
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Note, {
  fragments: {
    note: () => Relay.QL`
      fragment on Note {
        id,
        text,
        timestamp,
        ${UpdateNoteMutation.getFragment('note')},
        ${DeleteNoteMutation.getFragment('note')}
      }
    `,
    notebook: () => Relay.QL`
      fragment on Notebook {
        ${DeleteNoteMutation.getFragment('notebook')}
      }
    `
  },
});
