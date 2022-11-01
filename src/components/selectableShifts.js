import React from "react";
import { UserContext } from "../context/context";
import { ShiftContext } from "../context/shift-context";
import convertTime from "./timeConverter";
import DateBox from "./dateBox";

/*
    -----WHAT IS GOING ON HERE?----

        First off, we are creating a SelectableShifts component. That is to say, for each
        active offering retrieved via GraphQl on the select shifts page, the program is going
        to iterate over the shifts inside said offering and creat <AShift> for each.

        Moving into the AShift component, we start by bringing in the ShiftContext, which
        will be used to hold a record of which shifts an employee selects.

        Upon clicking/tapping one of the AShift components, the color will change to green
        and update the context to indicate selection/red to show unselected.
*/
const getDayOfWeek = (date) => {
    const theDay = new Date(new Date(date).setHours(24,0,0,0)).getDay();
    let dayOfWeek;
    switch (theDay) {
        case 0 : 
            dayOfWeek = "sunday";
            break;
        case 1 : 
            dayOfWeek = "monday";
            break;
        case 2 : 
            dayOfWeek = "tuesday";
            break;
        case 3 : 
            dayOfWeek = "wednesday";
            break;
        case 4 : 
            dayOfWeek = "thursday";
            break;
        case 5 : 
            dayOfWeek = "friday";
            break;
        case 6 : 
            dayOfWeek = "saturday";
            break;
        default :
            console.log('an error occurred getting the day of week');
    };

    return dayOfWeek;
}

const checkConflict = (dayOfWeek, startTime, endTime, userSchedule) => {
    console.log('userSchedule inside checkConflict is: ', userSchedule);
    const userStart = userSchedule[dayOfWeek].start;
    const userEnd = userSchedule[dayOfWeek].end;
    // if the shift starts before user starts and ends AFTER a user starts, no go!
    if ((startTime <= userStart) && (endTime > (userStart + 16))) { return true };
    // if the shift starts after a user starts, but before a user ends, no go
    if ((startTime >= userStart) && (startTime <= (userEnd - 16))) { return true };
    // otherwise, I think we're good
    return false;
}

const AShift = (shift, i) => {
    const ctx = React.useContext(UserContext);
    // Grab ahold of the current user's schedule
    const userSchedule = ctx.currentUser.weeklySchedule;
    const shiftCtx = React.useContext(ShiftContext);
     // Let's make life easier by doing a little destructuring:
    const { date, startTime, endTime, startLocation, endLocation, holiday } = shift.shift;
    let unselectedClass;
    if (holiday == true) 
        {
        unselectedClass="unselected-holiday"
        } else {
        unselectedClass="unselected-shift"
        };
    const [selected, setSelected] = React.useState(unselectedClass);
    // A function to change class upon selection
    // and to add/remove selected shifts to the ShiftContext
    const handleSelect = () => {
        if (selected === unselectedClass) {
            setSelected("selected-shift");
            shiftCtx.selected.push(shift);
            shiftCtx.ranked.push(
                {
                    id: shift.shift.id,
                    rank: null
                }
            )
            console.log("Added shift:")
            console.log(shiftCtx.selected);
            console.log(shiftCtx.ranked);
        } else {
            setSelected(unselectedClass);
            shiftCtx.selected.splice(i, 1);
            shiftCtx.ranked.splice(i, 1);
            console.log("Removed Shift:");
            console.log(shiftCtx.selected);
            console.log(shiftCtx.ranked);

        };
    }
   
    //THIS IS AN ABSOLUTE CLUSTERFUCK!!!!! BUT IT WORKS!
    const theDate = new Date(new Date(date).setHours(24,0,0,0)).toDateString();
    console.log('The date coming in is: ', theDate);
    const longDate = new Date(date).getUTCDate();
    console.log('longer form: ', longDate);
    // Next, let's figure out the day of the week the shift is occurring:
    const dayOfWeek = getDayOfWeek(date);
    // Now, let's check to see if there is a conflict between the shift and the current user's schedule
    const conflict = checkConflict(dayOfWeek, startTime, endTime, userSchedule);

    const start = convertTime(startTime);
    const end = convertTime(endTime);

    if (holiday || !conflict) {
        return (
            <div className={selected} key={i} id={i} onClick={handleSelect}>
                <div className="shift-layout align-right">
                    <DateBox date={theDate} available={true}/>
                    <div className="shift-info">
                        <h4>{start} - {end}</h4>
                        <h6 style={{marginTop: "5px"}}>Starts at: {startLocation}</h6>
                        <h6 style={{marginTop: "-5px", marginBottom: "-5px"}}>Ends at: {endLocation}</h6>
                    </div>
                </div>
            </div>
        )   
    } else {
        return (
            <div className="unavailable-shift" key={i} id={i}>
                <div className="shift-layout align-right">
                    <DateBox date={theDate} available={false}/>
                    <div className="shift-info">
                        <h4>{start} - {end}</h4>
                        <h6 style={{marginTop: "5px"}}>Starts at: {startLocation}</h6>
                        <h6 style={{marginTop: "-5px", marginBottom: "-5px"}}>Ends at: {endLocation}</h6>
                    </div>
                </div>
            </div>
        )   
    }
}

const SelectableShifts = ({shifts}) => {
    
    const theDate = new Date(shifts[0].date);
    console.log(theDate);

    return (
        <div>
        {shifts.map((shift, i) => {
            return (
                <AShift key={i} shift={shift} i={i}></AShift>
            )
        })}
        </div>
    )
}

export default SelectableShifts;