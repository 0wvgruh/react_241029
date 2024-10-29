import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
    <div>
    
      <main>
        <Outlet />
      </main>
    </div>
  );
}
