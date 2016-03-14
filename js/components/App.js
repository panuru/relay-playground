/* eslint react/prefer-stateless-function: 0 */
import '../../css/components/App.scss';

import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
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
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    notebook: () => Relay.QL`
      fragment on Notebook {
        notes(first: 10) {
          edges {
            node {
              text,
              timestamp
            },
          },
        },
      }
    `,
  },
});
