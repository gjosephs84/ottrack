import React from "react";
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
    return (
        <MITCard cardTitle={"My Weekly Schedule"} cardBody={
            <div>
            {daysOfWeek.map((day) => {
                return (
                    <Day key={day} dayOfWeek={day} id={day}/>
                )
            })}
            </div>
        }/>
            
       
    );
}

export default Employee;