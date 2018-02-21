# React Lot

![React Lot Logo](https://i.imgur.com/2XlVv5X.png "React Lot Logo")

A dead simple React store that can easily be updated and accessed from any React component. Built on top of Redux so the devTools extension can be used. Follows Redux's philosophy of never directly mutating state and always returning a fresh state on updates.  

There's only two methods to know. 
```javascript
set({ username: didrio });
get('username');
```

## Install

`npm install --save react-lot`

## Use

To get started, wrap a React app with `lot.Wrapper`. An `initial` store object can optionally be passed in. Add `devTools` and set it to true to enable Redux DevTools. 

```javascript
import React, { Component } from 'react';
import { render } from 'react-dom';
import Main from './Main';
import lot from 'react-lot';

class App extends Component {
  render() {
    return <div><Main /></div>;
  }
}

const initial = { 
  first: 1, 
  second: 2 
};

render(
  <lot.Wrapper initial={initial} devTools={true}>
    <App />
  </lot.Wrapper>
  , document.querySelector('#root'));
```

Now from any React component, just import `lot` and use its `get` and `set` methods. 

```javascript
import React, { Component } from 'react';
import lot from 'react-lot';

class Main extends Component {

  componentDidMount() {
    lot.set({ third: 3 });
  }

  render() {
    return (
      <div>
        <ul>
          <li>{lot.get('first')}</li>
          <li>{lot.get('second')}</li>
          <li>{lot.get('third')}</li>
        </ul>
      </div>
    );
  }
}

export default Main;
```

An easy way to modify a property on a deeply nested object is to provide comma seperated strings that lead to the desired property, then finally passing in the new value as the last argument. 

Let's say our initial store looked like this:

```javascript
const initial = { 
  object1: {
    object2: {
      object3: {
        property: 'nah'
      }
    }
  }
 };
```

And then to modify it:

```javascript
import React, { Component } from 'react';
import lot from 'react-lot';

class Main extends Component {

  componentWillMount() {
    lot.set('object1', 'object2', 'object3', 'property', 'yah');
  }

  render() {
    return (
      <div>
        {lot.get('object1').object2.object3.property}
      </div>
    );
  }
}

export default Main;
```

Nice work, you're a react-lot expert now! 