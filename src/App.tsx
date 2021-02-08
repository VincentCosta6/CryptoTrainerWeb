import React from 'react';

import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Header from './components/Header';
import Homepage from './routes/Homepage';
import FetchUserInfo from './routes/FetchUserInfo';
import NotFound from './routes/404';

import store from './redux/store'

import './App.scss';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Header />
        <Router>
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/user/:hashedUser" component={FetchUserInfo} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
