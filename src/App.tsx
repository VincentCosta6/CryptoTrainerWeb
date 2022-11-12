import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ProviderRoot from './ProviderRoot';

import Header from './components/Header';
import Login from './routes/Login';
import Dashboard from './routes/Dashboard';
import NotFound from './routes/404';

import './App.scss';

const App = () => (
  <ProviderRoot>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user/:hashedUser" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ProviderRoot>
)

export default App;
