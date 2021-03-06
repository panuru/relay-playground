import Relay from 'react-relay';

export default class DeleteNoteMutation extends Relay.Mutation {
  static fragments = {
    note: () => Relay.QL`
      fragment on Note { id }
    `,
    notebook: () => Relay.QL`
      fragment on Notebook { id }
    `,
  };
  getMutation() {
    return Relay.QL`
      mutation{ deleteNote }
    `;
  }

  getVariables() {
    return { id: this.props.note.id };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteNotePayload {
        notebook {
          notes
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        notebook: this.props.notebook.id
      },
    }];
  }
}
