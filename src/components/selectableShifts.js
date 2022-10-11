import React from "react";
import { ShiftContext } from "../context/shift-context";

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


const AShift = (shift, i) => {
    const shiftCtx = React.useContext(ShiftContext);
    const [selected, setSelected] = React.useState("unselected-shift");
    // A function to change class upon selection
    // and to add/remove selected shifts to the ShiftContext
    const handleSelect = () => {
        if (selected === "unselected-shift") {
            setSelected("selected-shift");
            shiftCtx.selected.push(shift);
            console.log("Added shift:")
            console.log(shiftCtx.selected);
        } else {
            setSelected("unselected-shift");
            shiftCtx.selected.splice(i, 1);
            console.log("Removed Shift:");
            console.log(shiftCtx.selected);

        };
    }

    const theDate = new Date(shift.shift.date).toDateString();
    return (
        <div className={selected} key={i} id={i} onClick={handleSelect}>
            <div>
                <div>{theDate} {shift.shift.startTime} - {shift.shift.endTime}</div>
                <div>Starts at: {shift.shift.startLocation} | Ends at: {shift.shift.endLocation}</div>
            </div>
        </div>
    )   

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