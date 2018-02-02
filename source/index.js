import React, { Component } from 'react';
import { dispatch, createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

let MainStore, providerStore, initialStore = false;

// ---- Start Of Redux Store Setup ---- //

const addToReduxStore = (object) => {
  return {
    type: Object.keys(object)[0],
    payload: object
  }
}

const mapStateToProps = store => ({
  reduxStore: store.reduxStore
});

const mapDispatchToProps = dispatch => ({
  addToReduxStore: object => dispatch(addToReduxStore(object)),
  deleteFromReduxStore: object => dispatch(deleteFromReduxStore(object))
});

const storeReducer = (state = {}, action) => {
  return Object.assign({}, state, action.payload);
}

const reducers = combineReducers({
  reduxStore: storeReducer
});

// ----- End Of Redux Store Setup ----- //

class AgentStore extends Component {
  // Call Redux action creator with initial store passed in by client
  componentWillMount() {
    if (initialStore) this.props.props.addToReduxStore(this.props.props.props.initial);
  }

  render() {
    // If an initial store was provided, wait for it to be set in Redux before rendering
    if (initialStore && Object.keys(this.props.props.reduxStore).length === 0) return <div></div>;
    else return this.props.props.props.children;
  }
}

class ReduxWrapper extends Component {

  // Setting a reference to a React component so its props (Redux store and methods) can be accessed
  renderStore() {
    MainStore = <AgentStore props={this.props} />;
    return MainStore;
  }

  render() {
    return this.renderStore();
  }
}

// The Redux store and the Redux action creators are connected here
const RW = connect(mapStateToProps, mapDispatchToProps)(ReduxWrapper);

// The entire application is wrapped with Redux's Provider
class ProviderWrapper extends Component {
  render() {
    return (
      <Provider store={providerStore} >
        <RW props={this.props} />
      </Provider>
    );
  }
}

const store = {
  Wrapper: (props) => {
    // Initial set up with any attributes used with Store component
    if (props.hasOwnProperty('initial')) initialStore = true;
    if (props.devTools && props.devTools === true) {
      providerStore = createStore(reducers, composeWithDevTools());
    } else providerStore = createStore(reducers);

    return new ProviderWrapper(props);
  },
  set: (...args) => {
    if (args.length === 1 && typeof args[0] === 'object') {
      // If set with an object, just pass that to action creator  
      MainStore.props.props.addToReduxStore(args[0]);
    } else {
      // If comma seperated strings, loops through them and 
      // pass to action creator one by one
      for (let i = 0; i < args.length; i = i + 2) {
        if (i + 1 === args.length) MainStore.props.props.addToReduxStore({ [args[i]]: null });
        else MainStore.props.props.addToReduxStore({ [args[i]]: args[i + 1] });
      }
    }
  },
  get: (...keys) => {
    // Return the entire store if no arguments are provided
    if (keys.length === 0) return MainStore.props.props.reduxStore;
    else if (keys.length > 1) {
      const results = {};
      keys.forEach(key => results[key] = MainStore.props.props.reduxStore[key]);
      return results;
    } else return MainStore.props.props.reduxStore[keys[0]];
  }
};

export default store;