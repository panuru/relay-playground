/**
 * Taken from https://gist.github.com/mikberg/07b4006e22aacf31ffe6
 * More info: https://medium.com/@mikaelberg/writing-simple-unit-tests-with-relay-707f19e90129
 */

import Relay from 'react-relay';

export class Mutation extends Relay.Mutation {
  _resolveProps(props) {
    this.props = props;
  }
}

export class MockStore {
  reset() {
    this.successResponse = undefined;
  }

  succeedWith(response) {
    this.reset();
    this.successResponse = response;
  }

  failWith(response) {
    this.reset();
    this.failureResponse = response;
  }

  update(callbacks) {
    if (this.successResponse) {
      callbacks.onSuccess(this.successResponse);
    } else if (this.failureResponse) {
      callbacks.onFailure(this.failureResponse);
    }

    this.reset();
  }

  commitUpdate(mutation, callbacks) {
    return this.update(callbacks);
  }

  applyUpdate(mutation, callbacks) {
    return this.update(callbacks);
  }
}

export const Store = new MockStore();
export const Route = Relay.Route;
export const PropTypes = Relay.PropTypes;

export default {
  QL: Relay.QL,
  Mutation,
  Route: Relay.Route,
  PropTypes: Relay.PropTypes,

  createContainer: (component, specs) => {
    /* eslint no-param-reassign:0 */
    component.getRelaySpecs = () => specs;
    return component;
  },

  Store,
};
