import React from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

import { UserContext } from "../context/context";

const LoginForm = () => {
    // Bring in the context
    const ctx = React.useContext(UserContext);

    // Grab the state variables from context
    const [loggedIn, setLoggedIn] = ctx.loginState;
    const [userRole, setUserRole] = ctx.userRole;

    // Create the other state variables for the form
    const [email, setEmail]                     = React.useState("");
    const [password, setPassword]               = React.useState("");
    const [shouldDisable, setShouldDisable]     = React.useState(true);
    const [show, setShow] = React.useState(() => {
        if (ctx.currentUser) {
            return false;
        } else {
            return true;
        }
    });

    /*
    
    -----NOTES ON CHECK ENABLE-----
        To avoid the delay in the updating of confirmPassword, rather than comparing password with confirmPassword, the code compares value1 to value2, where password is passed in as value1 and the e.target.value for the confirm password field is passed in as value2.

    */
    
    const checkEnable = (email, password) => {
        if (email && password) {
            setShouldDisable(false);
        } else {
            setShouldDisable(true);
        };
    };
    
    const handleChange = (e, entry, setValue, email, password) => {
        e.preventDefault();
        setValue(entry);
        checkEnable(email, password);
    };

    

    const handleSubmit = async() => {

        /*
    
    -----NOTES ON AXIOS RESPONSES-----
        Because the post requests are asynchronous, async() functions need to be used to allow the promise of the post to be fulfilled. By expressing the post request as a variable (in this case logging in), I am able to "await" the response and then actually do something with the data I get back once we get to the .then portion of the call

    */

        let loggingIn = await axios
            .post('http://localhost:1337/api/auth/local', {
                identifier: email,
                password: password
            })
            .then(response => {
                console.log('All data is: ', response.data);
                console.log('User profile', response.data.user);
                console.log('User token', response.data.jwt);
                // Set the current user in the context
                ctx.currentUser = response.data.user;
                // Set the user as logged in and update the type for
                // conditional rendering of options in the navbar
                setLoggedIn(true);
                setShow(false);
                setUserRole(ctx.currentUser.type);
                console.log(`ctx user is ${ctx.currentUser.username} and is of type ${ctx.currentUser.type}`);
            })
            .catch(error => {
                console.log('An error occurred:', error.response);
            });
    };

    return (
        <div>
            {show ? (<div>
                <h4>Email:</h4>
                <input className="input-field" type="text" placeholder="Enter your email" onChange={(e) => {handleChange(e, e.target.value, setEmail, e.target.value, password)}}/>
                <h4>Password:</h4>
                <input className="input-field" type="password" placeholder="Choose a password" onChange={(e) => {handleChange(e, e.target.value, setPassword, email, e.target.value)}}/><br/><br/>
                <button className="button-full" disabled={shouldDisable} onClick={handleSubmit}>Submit</button>
                <div>
                    <br/>
                    <p style={{marginLeft: "15px"}}>
                        Or <Link to="signup">click here </Link>to register
                    </p>
                    </div>
            </div>) : (<div>
                <h2>Welcome back, {ctx.currentUser.username}</h2>
                <p>You have logged in successfully! Use the menu to get started.</p>
                </div>)}
        </div> 
    )
}

export default LoginForm;