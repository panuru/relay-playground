import Relay from 'react-relay';

export default class UpdateNoteMutation extends Relay.Mutation {
  static fragments = {
    note: () => Relay.QL`
      fragment on Note { id }
    `,
  };
  getMutation() {
    return Relay.QL`
      mutation{ updateNote }
    `;
  }

  getVariables() {
    return { text: this.props.text, id: this.props.note.id };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateNotePayload {
        note {
          id,
          text
        },
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: { note: this.props.note.id },
    }];
  }
}
