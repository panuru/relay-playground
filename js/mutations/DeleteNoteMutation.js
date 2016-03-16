import Relay from 'react-relay';

export default class DeleteNoteMutation extends Relay.Mutation {
  static fragments = {
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
          notesCount,
          notes
        },
        deletedId,
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'notebook',
      parentID: this.props.notebook.id,
      connectionName: 'notes',
      deletedIDFieldName: 'deletedId',
    },
    {
      type: 'FIELDS_CHANGE',
      fieldIDs: { notebook: this.props.notebook.id },
    }];
  }
}
