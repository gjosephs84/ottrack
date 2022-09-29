import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//import the routes
import Admin from './routes/admin';
import CreateOffering from './routes/create-offering';
import Employee from './routes/employee';
import History from './routes/history';
import Home from './routes/home';
import Login from './routes/login';
import SelectShifts from './routes/select-shifts';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />}/>
          <Route path="login" element={<Login />} />
          <Route path="admin" element={<Admin />} />
          <Route path="create-offering" element={<CreateOffering />} />
          <Route path="employee" element={<Employee />} />
          <Route path="select-shifts" element={<SelectShifts />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.querySelector('#root')
);
