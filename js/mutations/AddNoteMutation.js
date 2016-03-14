import Relay from 'react-relay';

export default class AddNoteMutation extends Relay.Mutation {
  static fragments = {
    notebook: () => Relay.QL`
      fragment on Notebook { id }
    `,
  };
  getMutation() {
    return Relay.QL`
      mutation{ addNote }
    `;
  }

  getVariables() {
    return { text: this.props.text };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddNotePayload {
        notebook { notes },
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: { notebook: this.props.notebook.id },
    }];
  }
}
