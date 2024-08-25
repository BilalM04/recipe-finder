import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Search from './pages/Search/Search';
import HomePage from './pages/HomePage/HomePage';
import SavedRecipes from './pages/SavedRecipes/SavedRecipes';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => (
  <Router >
    <Routes>
      <Route path={process.env.REACT_APP_FOR_PATH + "/"} element={<HomePage />} />
      <Route path={process.env.REACT_APP_FOR_PATH + "/search"} element={<Search />} />
      <Route path={process.env.REACT_APP_FOR_PATH + "/saved"} element={<SavedRecipes />} />
    </Routes>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
