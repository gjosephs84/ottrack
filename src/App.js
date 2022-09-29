import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Outlet } from 'react-router-dom';




function App() {
  return (
    <div>
      <Outlet />
    </div>
  )
  
  
}

export default App;
