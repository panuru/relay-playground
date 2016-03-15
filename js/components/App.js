/* eslint react/prefer-stateless-function: 0 */
import '../../css/components/App.scss';

import React from 'react';
import Relay from 'react-relay';
import Notebook from './Notebook';

class App extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <article className="main">
          <h1 className="header">
            <span className="icon icon-pen"></span>
            My notes
          </h1>
          <Notebook notebook={this.props.notebook} />
          <footer className="footer">
            <a className="icon icon-github" href="http://github.com/panuru/relay-playground"></a>
          </footer>
        </article>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    notebook: () => Relay.QL`
      fragment on Notebook {
        ${Notebook.getFragment('notebook')},
      }
    `,
  },
});
