/* eslint react/prefer-stateless-function: 0 */
import '../../css/components/Note.scss';

import React from 'react';
import Relay from 'react-relay';
import moment from 'moment';

class Note extends React.Component {
  _getFormattedDate() {
    return moment(this.props.note.timestamp).calendar();
  }

  render() {
    return (
      <div className="note">
        {this.props.note.text}
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
        text,
        timestamp
      }
    `,
  },
});
