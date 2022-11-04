import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserContext } from './context/context';
import NavigationBar from './components/navbar';




function App() {
  // Bring in the context
  const ctx = React.useContext(UserContext);

  // Create State variables to inject into context
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userRole, setUserRole] = React.useState(null);

  // Add the state variables to context so they can conditionally render the nav bar options
  ctx.loginState = [loggedIn, setLoggedIn];
  ctx.userRole = [userRole, setUserRole];

  return (
    <div>
      <NavigationBar/>
      <br/>
      <Outlet />
      <br/>
      <div className="centered" style={{color:"white"}}>Copyright 2022 by Gregory Josephs</div>
    </div>
  )
  
  
}

export default App;
