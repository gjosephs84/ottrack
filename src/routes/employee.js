import React from "react";
import axios from 'axios';
import { UserContext } from "../context/context";
import { ShiftContext } from "../context/shift-context";
import MITCard from "../components/mitCard";
import Day from "../components/dailySchedulePicker";
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

    // A function for updating a user's schedule
    const updateSchedule = async () => {
        let userId = ctx.currentUser.id;
        console.log('inside updateSchedule, userId is: ', userId);
        const url = `http://localhost:1337/api/users/${userId}`;
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
        <MITCard cardTitle={"My Weekly Schedule"} cardBody={
            <div>
            {daysOfWeek.map((day) => {
                return (
                    <Day key={day} dayOfWeek={day} id={day}/>
                )
            })}
            <button className="button-full" onClick={updateSchedule}>Update Schedule</button>
            </div>
        }/> 
    );
}

export default Employee;