import React, { Component } from 'react';
import { dispatch, createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

let storeReference, providerStore;

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
  addToReduxStore: object => dispatch(addToReduxStore(object))
});

const storeReducer = (state = {}, action) => {
  if (typeof action.payload === 'object' && action.payload.hasOwnProperty('nestedObjectNames')) {
    const arr = action.payload.nestedObjectNames;
    let obj = state;
    for (let i = 0; i < arr.length - 1; i++) {
      obj = obj[arr[i]];
    }
    obj[arr[arr.length - 1]] = action.payload.value;
    return Object.assign({}, state);
  } else {
    return Object.assign({}, state, action.payload);
  }
}

const reducer = combineReducers({
  reduxStore: storeReducer
});

class MainStore extends Component {
  render() { 
    return this.props.props.props.children; 
  }
}

class MainStoreWrapper extends Component {

  // Setting a reference to a React component so its props (Redux store and methods) can be accessed
  renderStore() {
    storeReference = <MainStore props={this.props} />;
    return storeReference;
  }

  render() {
    return this.renderStore();
  }
}

// The Redux store and the Redux action creators are connected here
const ReactRedux = connect(mapStateToProps, mapDispatchToProps)(MainStoreWrapper);

// The entire application is wrapped with Redux's Provider
class ProviderWrapper extends Component {
  render() {
    return (
      <Provider store={providerStore} >
        <ReactRedux props={this.props} />
      </Provider>
    );
  }
}

const store = {
  Wrapper: (props) => {
    // Initial set up with any attributes used with Store component
    const initial = props.initial || {};
    if (props.devTools && props.devTools === true) {
      providerStore = createStore(reducer, { reduxStore: initial }, composeWithDevTools());
    } else providerStore = createStore(reducer, { reduxStore: initial });
    return new ProviderWrapper(props);
  },
  set: (...args) => {
    if (args.length === 1 && typeof args[0] === 'object') {
      // If set with an object, just pass that to action creator  
      storeReference.props.props.addToReduxStore(args[0]);
    } else {
      storeReference.props.props.addToReduxStore({
        nestedObjectNames: args.slice(0, -1),
        value: args[args.length - 1]
      });
    }
  },
  get: (...keys) => {
    // Return the entire store if no arguments are provided
    if (keys.length === 0) return storeReference.props.props.reduxStore;
    else if (keys.length > 1) {
      const results = {};
      keys.forEach(key => results[key] = storeReference.props.props.reduxStore[key]);
      return results;
    } else return storeReference.props.props.reduxStore[keys[0]];
  }
};

export default store;