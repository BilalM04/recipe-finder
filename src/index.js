import reportWebVitals from './reportWebVitals';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import HomePage from './HomePage';
import SavedRecipes from './SavedRecipes';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: process.env.REACT_APP_FOR_PATH + "/",
    element: <HomePage/>,
  },
  {
    path: process.env.REACT_APP_FOR_PATH + "/browse",
    element: <App/>,
  },{
    path: process.env.REACT_APP_FOR_PATH + "/saved",
    element: <SavedRecipes/>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
