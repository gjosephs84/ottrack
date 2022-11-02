import React from "react";
import axios from 'axios';
import { UserContext } from "../context/context";
import { ShiftContext } from "../context/shift-context";
import Day from "./dailySchedulePicker";
import HireDate from "./hireDate";

const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

const Register = () => {
    // Bring in the context
    const ctx = React.useContext(UserContext);
    const shiftCtx = React.useContext(ShiftContext);

    // Grab the state variables from context
    const [loggedIn, setLoggedIn] = ctx.loginState;
    const [userRole, setUserRole] = ctx.userRole;

    // Create the state variables
    const [name, setName]                       = React.useState("");
    const [email, setEmail]                     = React.useState("");
    const [role, setRole]                       = React.useState(null);
    const [seniority, setSeniority]             = React.useState(null);
    const [password, setPassword]               = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [shouldDisable, setShouldDisable]     = React.useState(true);
    const [showSeniority, setShowSeniority]     = React.useState(false);
    const [showSchedule, setShowSchedule]       = React.useState(false);
    const [show, setShow] = React.useState(true);

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
        if (entry == "Lifeguard") {
            setShowSeniority(true);
            setShowSchedule(true);
        };
        if (entry == "Manager") {
            setShowSeniority(false);
            setShowSchedule(false);
        };
        console.log(entry);
    };

    const handleSubmit = async() => {
        let registering = await axios
            .post('http://localhost:1337/api/auth/local/register', {
                username: name,
                email: email,
                password: password,
                type: role,
                seniority: seniority,
                weeklySchedule: shiftCtx.schedule
            })
            .then(response => {
                console.log('User profile', response.data.user);
                console.log('User token', response.data.jwt);
                ctx.currentUser = response.data.user;
                setLoggedIn(true);
                setShow(false);
                setUserRole(ctx.currentUser.type);
            })
            .catch(error => {
                console.log('An error occurred:', error.response);
            });
            
    };

    return (
        <div>
            {show ? (<div>
            <h4>Name:</h4>
            <input className="input-field" type="text" placeholder="Enter your name" onChange={(e) => {handleChange(e, e.target.value, setName)}}/>
            <h4>Email:</h4>
            <input className="input-field" type="text" placeholder="Enter your email" onChange={(e) => {handleChange(e, e.target.value, setEmail)}}/>
            <h4>Role:</h4>
            <select className="input-field" onChange={(e) => {handleChange(e, e.target.value, setRole)}}>
                <option>Choose a Role</option>
                <option>Lifeguard</option>
                <option>Manager</option>
            </select>
            {showSeniority && <h4>Hire Date:</h4>}
            {showSeniority && <HireDate seniority={seniority} setSeniority={setSeniority}/>}
            {showSchedule && <h4>Weekly Schedule:</h4>}
            {showSchedule && <p>Click/tap each day to set your base weekly schedule. For days off, simply click/tap and confirm without setting start or end times.</p>}
            {showSchedule && <div>
                {daysOfWeek.map((day) => {
                    return (
                        <Day key={day} id={day} dayOfWeek={day}/>
                    )
                })}
                </div>}
            <h4>Password:</h4>
            <input className="input-field" type="password" placeholder="Choose a password" onChange={(e) => {handleChange(e, e.target.value, setPassword)}}/>
            <h4>Confirm Password:</h4>
            <input className="input-field" type="password" placeholder="Confirm your password" onChange={(e) => {handleChange(e, e.target.value, setConfirmPassword);
            checkEnable(password, e.target.value)}}/><br/><br/>
            <button className="button-full" onClick={handleSubmit} disabled={shouldDisable}>Submit</button>
            </div>) 
            : 
            (<div>
                <h2>Welcome {ctx.currentUser.username}!</h2>
                <p>Your registration was successful, but <strong>your account is pending administrator approval.</strong></p>
                <p>Once an administrator confirms that you are a <strong>{role}</strong>, you will be notified and may begin using the system.</p>
            </div>)}
        </div>
    )
}

export default Register;