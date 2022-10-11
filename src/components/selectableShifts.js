import React from "react";
import { ShiftContext } from "../context/shift-context";



const AShift = (shift, i) => {
    const shiftCtx = React.useContext(ShiftContext);
    const [selected, setSelected] = React.useState("unselected-shift");
    // A function to change class upon selection
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