import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import './index.css';
import App from './App';

//import the context
import { UserContext } from './context/context';
import { ShiftContext } from './context/shift-context';

//import the routes
import Admin from './routes/admin';
import CreateOffering from './routes/create-offering';
import Employee from './routes/employee';
import History from './routes/history';
import Home from './routes/home';
import Login from './routes/login';
import SelectShifts from './routes/select-shifts';
import Signup from './routes/signup';

// Initialize the Apollo Client to be able to work with graphql elsewhere in the app

// NOTE: Will need to change uri for deployment

const client = new ApolloClient({
  uri: 'http://localhost:1337/graphql',
  cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(document.getElementById('root'));

/*

EXPLANATION OF THE FOLLOWING:

-----ApolloClient-----
    By wrapping everything inside the <React.StrictMode> tags in <ApolloProvider> I am enabling access to Apoolo Client everywhere within. At least, that's how it is supposed to work ...

-----BrowserRouter-----
    Here I am setting up the routes and calling <Home> as the index element. I can navigate to other pages using the <Link> tag and the paths below referenced.

    The contents of each path express themselves through the <Output> tag in App.js

*/
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <UserContext.Provider value={
          {currentUser: null,
          loginState: null,
          userRole: null
          }
        }>
        <ShiftContext.Provider value={
          { selected: [],
            ranked: [],
            disabledState: null
          }
        }>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />}/>
              <Route path="login" element={<Login />} />
              <Route path="admin" element={<Admin />} />
              <Route path="create-offering" element={<CreateOffering />} />
              <Route path="employee" element={<Employee />} />
              <Route path="select-shifts" element={<SelectShifts />} />
              <Route path="history" element={<History />} />
              <Route path="signup" element={<Signup />} />
            </Route>
          </Routes>
        </ShiftContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
