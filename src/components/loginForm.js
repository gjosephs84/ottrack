import React from "react";
import axios from 'axios';

const LoginForm = () => {
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
            })
            .catch(error => {
                console.log('An error occurred:', error.response);
            });
    };

    return (
        <div>
            <h2>Login:</h2>

            <h4>Email:</h4>
            <input type="text" placeholder="Enter your email" onChange={(e) => {handleChange(e, e.target.value, setEmail)}}/>
            <h4>Password:</h4>
            <input type="password" placeholder="Choose a password" onChange={(e) => {handleChange(e, e.target.value, setPassword)}}/>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default LoginForm;