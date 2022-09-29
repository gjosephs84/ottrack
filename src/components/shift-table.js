import React from "react";
import ShiftRow from "./shift-row";

const ShiftTable = ({shifts}) => {
    console.log("Here we are!");
    console.log(`Shifts is ${shifts}`);
    // The lifeguards ... This needs to come from Strapi eventually
    const guards = ["Andy", "Jimmy", "Linda", "Greg", "Karen", "Zack"];
    const tableHeader = ["Shift", ...guards];
    return (
        <div>
        <div className="shift-table">
            {tableHeader.map((header) => {
                return (
                    <div>{header}</div>
                )
            })}
        </div>
        <div className="shift-table">
            {shifts.map((shift) => {
                return (
                   <ShiftRow shift={shift}></ShiftRow>
                
                )
            })
            }
        </div>
        </div>
    )
}

export default ShiftTable;