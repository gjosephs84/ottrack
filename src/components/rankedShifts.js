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

const RankOption = ({choice}) => {
    const [shouldDisable, setShouldDisable] = React.useState(false);
    return (
        <option disabled={shouldDisable}>{choice}</option>
    );
}

const RankSelector = (selectorId) => {
    // get the context to know how many shifts were selected
    const shiftCtx = React.useContext(ShiftContext);
    const choices = [];
    const choicesHistory = [];
    for (let i=0; i<shiftCtx.selected.length; i++) {
        choices.push(i + 1);
        choicesHistory.push(
            {
                choice: i + 1,
                used: false
            }
        );
        }
    
    const handleChange = () => {
        alert("Changed.");
    }
    console.log("choices is ", choices);
    console.log("selectorId in RankedSelector is", selectorId);
    return (
        <select className="ranker" onChange={handleChange}>
            <option> - </option>
            {choices.map((choice, i) => {
                return (
                    <RankOption key={i} id={i} choice={choice}/>
                )
            })}
        </select>
    );
    };

const AShift = (shift, i) => {
    const theDate = new Date(shift.shift.shift.shift.date).toDateString();
    return (
        <div className="selected-shift">
            <div>
                <div>{theDate} {shift.shift.shift.shift.startTime} - {shift.shift.shift.shift.endTime}</div>
                <div>Starts at: {shift.shift.shift.shift.startLocation} | Ends at: {shift.shift.shift.shift.endLocation}</div>
            </div>
        </div>
    )   

}

const ShiftWithRanker = (shift, selectorId) => {
    console.log("SelectorId coming into shiftwithranker is", selectorId);
    return (
        <div className="shift-selector">
            <AShift shift={shift}/>
            <RankSelector selectorId={selectorId}/>
        </div>
    )
}

const RankedShifts = ({shifts}) => {

    return (
        <div>
        {shifts.map((shift, i) => {
            console.log("i is", i);
            const selectorId = {selector: `selector-${i}`};
            console.log("selectorId is", selectorId);
            return (
               <ShiftWithRanker shift={shift} key={i} id={i}/>
            )
        })}
        </div>
    )
}

export default RankedShifts;