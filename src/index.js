import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import List from './board/List';
import View from './board/View';
import Write from './board/Write';
import Update from './board/Update';
const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { path: 'list', element: <List /> },
      { path: 'view/:bid', element: <View /> },
      { path: 'write', element: <Write /> },
      { path: 'update/:bid', element: <Update /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(

    <RouterProvider router={router} />
  
);
