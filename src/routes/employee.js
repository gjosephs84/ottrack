import React from "react";
import axios from 'axios';
import { UserContext } from "../context/context";
import { ShiftContext } from "../context/shift-context";
import MITCard from "../components/mitCard";
import AssignedShifts from "../components/assignedShifts";
import Day from "../components/dailySchedulePicker";
import restoreSession from "../components/restoreSession";
const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
]


const Employee = () => {
    // Bring in the contexts
    const ctx = React.useContext(UserContext);
    const shiftCtx = React.useContext(ShiftContext);

    const [loggedIn, setLoggedIn]               = ctx.loginState;
    const [userRole, setUserRole]               = ctx.userRole;

    const restored = restoreSession();
    console.log('restored is: ', restored);
    if (restored === true) {
        setLoggedIn(true);
        setUserRole(ctx.currentUser.type);
    }
    console.log('ctx in its entirety is: ', ctx);

    // A function for updating a user's schedule
    const updateSchedule = async () => {
        let userId = ctx.currentUser.id;
        console.log('inside updateSchedule, userId is: ', userId);
        const url = `https://ottrack-backend.herokuapp.com/api/users/${userId}`;
        let updateUserSchedule = await axios
            .put(url, {
                weeklySchedule: shiftCtx.schedule
            })
            .then(response => {
                console.log(response.data.data)
            })
            .catch(error => {
                console.log('An error occurred: ', error.response);
            })
    };

    return (
        <div>
        <MITCard cardTitle={"Weekly Schedule"} cardBody={
            <div>
            {daysOfWeek.map((day) => {
                return (
                    <Day key={day} dayOfWeek={day} id={day}/>
                )
            })}
            <button className="button-full" onClick={updateSchedule}>Update Schedule</button>
            </div>
        }/>
        <br/>
        <AssignedShifts/>
        </div>
    );
}

export default Employee;