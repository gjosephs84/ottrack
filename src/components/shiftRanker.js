import React from "react";
import DateBox from "./dateBox";
import convertTime from "./timeConverter";
import { ShiftContext } from "../context/shift-context";

// Here's a function to generate the options for the <select>:
const getOptions = (length) => {
    const selectOptions = [
        {value: '—', text: '—'}
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
};

// Here's a function to set the array for validation
const getValidationArray = (length) => {
    const validationArray = [];
    for (let i=0; i<length; i++) {
        validationArray.push((i + 1).toString());
    };
    return validationArray;
};

const ShiftRanker = (shift) => {

    // First let's isolate the data from the shift coming in
    const {date, startTime, endTime, startLocation, endLocation } = shift.shift;
    
    // Then, let's get a date string
    const theDate = new Date(new Date(date).setHours(24,0,0,0)).toDateString();
    
    // Next, let's figure out how many options need to be be in the select.
    // Begin by bringing in the context
    const shiftCtx = React.useContext(ShiftContext);

    // Then, see how many shifts were selected:

    const length = shiftCtx.selected.length;

    // Then pass that to getOptions() and getValidationArray();

    const selectOptions = getOptions(length);
    console.log("shiftCtx.ranked is ", shiftCtx.ranked);
    const validationArray = getValidationArray(length);

    // Here is a function to validate and set the submit button in select-shifts.js to enable
    const validate = () => {
        // First, let's reach into shiftCtx.ranked and pull out existing rankings into a new array
        const rankings = [];
        for (let i=0; i<shiftCtx.ranked.length; i++) {
            rankings.push(shiftCtx.ranked[i].rank);
        };
        console.log("rankings before any sorting is", rankings);
        // Now let's grab the state updaters from the shift context
        const [disabled, setDisabled] = shiftCtx.disabledState;
        const [error, setError] = shiftCtx.errorState;
        // If anything is left unranked, keep button disabled and return
        if (rankings.includes("—")) {
            console.log("**************** No —");
            setDisabled(true);
            setError("All shifts require a ranking to proceed");
            console.log("disabled is", disabled);
            return;
        };
        // Now, let's sort rankings so the numbers are ascending
        rankings.sort();
        console.log("rankings after sorting is", rankings);
        /* validationArray should be an ascending list of numbers. If it is equal to ranking (now sorted, the button can be enabled because there are no duplicate rankings and nothing is left unranked) */
        for (let i=0; i<validationArray.length; i++) {
            if (rankings[i] !== validationArray[i]) {
                setDisabled(true);
                if (rankings[i] !== null) {
                    setError("Check your rankings. Make sure each ranking is only used once.")
                console.log("!!!!!!mismatch!!!!!!");
                };
                return;
            }
        };
        // If everything matches, enable!!!!
        console.log("Looks like everything matched!!!!!!!");
        setDisabled(false);
        setError(null);
    };


    // A function to update preferences when the <select> value changes
    const handleChange = (e, value) => {
        e.preventDefault();
        console.log(value);
        let idToChange
        // Let's find the index of the corresponding entry in shiftCtx.ranked
        for (let i=0; i<shiftCtx.ranked.length; i++) {
            if (shiftCtx.ranked[i].id === shift.shift.id) {
                idToChange = i;
            };
        };
        // Now let's update that entry
        shiftCtx.ranked[idToChange].rank = value;
        console.log("Updated entry is: ", shiftCtx.ranked[idToChange]);
        console.log(shiftCtx.ranked);
        // Finally, let's run validation to see if the submit button can enable
        validate();

    }
    
    // Now, let's return the shift
    const start = convertTime(startTime);
    const end = convertTime(endTime);
    return(
        <div className="selected-shift-with-ranker">
             <div className="shift-layout-narrower align-right">
                    <DateBox date={theDate} available={true}/>
                    <div className="shift-info">
                        <h4>{start} - {end}</h4>
                        <h6 style={{marginTop: "5px"}}>Starts at: {startLocation}</h6>
                        <h6 style={{marginTop: "-5px", marginBottom: "-5px"}}>Ends at: {endLocation}</h6>
                    </div>
                </div>
            <div className="centered left-offset">
                <select onChange={(e) => {handleChange(e, e.target.value)}}>
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