import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Search from './pages/Search/Search';
import HomePage from './pages/HomePage/HomePage';
import SavedRecipes from './pages/SavedRecipes/SavedRecipes';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: process.env.REACT_APP_FOR_PATH + "/",
    element: <HomePage/>,
  },
  {
    path: process.env.REACT_APP_FOR_PATH + "/search",
    element: <Search/>,
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
