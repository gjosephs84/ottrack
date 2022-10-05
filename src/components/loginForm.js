import React from "react";
import axios from 'axios';
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

    /*
    
    -----NOTES ON CHECK ENABLE-----
        To avoid the delay in the updating of confirmPassword, rather than comparing password with confirmPassword, the code compares value1 to value2, where password is passed in as value1 and the e.target.value for the confirm password field is passed in as value2.

    */
    
    const checkEnable = (value1, value2) => {
        if (value1 === value2) {
            setShouldDisable(false);
        } else {
            setShouldDisable(true);
        };
    };
    
    const handleChange = (e, entry, setValue) => {
        e.preventDefault();
        setValue(entry);
        console.log(entry);
    };

    

    const handleSubmit = () => {
        axios
            .post('http://localhost:1337/api/auth/local', {
                identifier: email,
                password: password
            })
            .then(response => {
                console.log('User profile', response.data.user);
                console.log('User token', response.data.jwt);
                // Set the current user in the context
                ctx.currentUser = response.data.user;
                // Set the user as logged in and update the type for
                // conditional rendering of options in the navbar
                setLoggedIn(true);
                setUserRole(ctx.currentUser.type);
                console.log(`ctx user is ${ctx.currentUser.username} and is of type ${ctx.currentUser.type}`);
            })
            .catch(error => {
                console.log('An error occurred:', error.response);
            });
    };

    return (
        <div>
            <h4>Email:</h4>
            <input className="input-field" type="text" placeholder="Enter your email" onChange={(e) => {handleChange(e, e.target.value, setEmail)}}/>
            <h4>Password:</h4>
            <input className="input-field" type="password" placeholder="Choose a password" onChange={(e) => {handleChange(e, e.target.value, setPassword)}}/><br/><br/>
            <button className="button-full" onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default LoginForm;