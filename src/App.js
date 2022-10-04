import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from './components/navbar';




function App() {
  return (
    <div>
      <NavigationBar/>
      <br/>
      <Outlet />
    </div>
  )
  
  
}

export default App;
