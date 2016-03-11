import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    notebook: () => Relay.QL`
      query {
        notebook
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}
