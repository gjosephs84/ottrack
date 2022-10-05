import React from "react";
import axios from 'axios';

const Register = () => {
    const [name, setName]                       = React.useState("");
    const [email, setEmail]                     = React.useState("");
    const [role, setRole] = React.useState(null);
    const [password, setPassword]               = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
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
            .post('http://localhost:1337/api/auth/local/register', {
                username: name,
                email: email,
                password: password,
                type: role
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
            <h4>Name:</h4>
            <input className="input-field" type="text" placeholder="Enter your name" onChange={(e) => {handleChange(e, e.target.value, setName)}}/>
            <h4>Role:</h4>
            <select className="input-field" onChange={(e) => {handleChange(e, e.target.value, setRole)}}>
                <option>Choose a Role</option>
                <option>Lifeguard</option>
                <option>Manager</option>
            </select>
            <h4>Email:</h4>
            <input className="input-field" type="text" placeholder="Enter your email" onChange={(e) => {handleChange(e, e.target.value, setEmail)}}/>
            <h4>Password:</h4>
            <input className="input-field" type="password" placeholder="Choose a password" onChange={(e) => {handleChange(e, e.target.value, setPassword)}}/>
            <h4>Confirm Password:</h4>
            <input className="input-field" type="password" placeholder="Confirm your password" onChange={(e) => {handleChange(e, e.target.value, setConfirmPassword);
            checkEnable(password, e.target.value)}}/><br/><br/>
            <button className="button-full" onClick={handleSubmit} disabled={shouldDisable}>Submit</button>
        </div>
    )
}

export default Register;