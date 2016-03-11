/* eslint react/prefer-stateless-function: 0 */

import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Notes list</h1>
        <ul>
          {this.props.notebook.notes.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.text} (@{edge.node.timestamp})</li>
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
