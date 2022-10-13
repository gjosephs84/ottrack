import React from "react";
import { ShiftContext } from "../context/shift-context";

// Here's an empty array to hold the options
// for the <select> to be populated by the
// getOptions() function


// Here's a function to generate the options for the <select>:
const getOptions = (length) => {
    const selectOptions = [
        {value: '', text: '—'}
    ];
    for (let i=0; i<length; i++) {
        const val = i+1;
        const option = {
            value: val,
            text: `${val}`
        };
        selectOptions.push(option);
        console.log(selectOptions);
    };
    return selectOptions;       
}

const ShiftRanker = (shift) => {
    // First let's isolate the data from the shift coming in
    const {date, startTime, endTime, startLocation, endLocation } = shift.shift;
    
    // Then, let's get a date string
    const theDate = new Date(date).toDateString();
    
    // Next, let's figure out how many options need to be be in the select.
    // Begin by bringing in the context
    const shiftCtx = React.useContext(ShiftContext);

    // Then, see how many shifts were selected:

    const length = shiftCtx.selected.length;

    // Then pass that to getOptions();

    const selectOptions = getOptions(length);
    
    // Now, let's return the shift
    return(
        <div className="selected-shift-with-ranker">
            <div>
                <div>{theDate} {startTime} - {endTime}</div>
                <div>Starts at: {startLocation} | Ends at: {endLocation}</div>
            </div>
            <div>
                <select>
                    {selectOptions.map((option) => {
                        return (
                            <option key={option.value} value={option.value}>{option.text}</option>
                        )
                    })}
                </select>
            </div>
        </div>
    )
};

export default ShiftRanker;