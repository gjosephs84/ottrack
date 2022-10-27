import React from "react";
import convertTime from "./timeConverter";

const ShiftTable = ({shifts, removeShift}) => {
    return (
        <div>
            <div className="shift-table-header">
                <h6>Date</h6>
                <h6>Start Time</h6>
                <h6>End Time</h6>
                <h6>Starts At</h6>
                <h6>Ends At</h6>
            </div>
            <div className="shift-table-body">
                {shifts.length === 0 && <h4 className="centered">Nothing here yet! Add a shift to begin.</h4>}
                {shifts.length > 0 &&
                shifts.map((shift, i) => {
                    const start = convertTime(shift.startTime);
                    const end = convertTime(shift.endTime);
                    return (
                        <div key={i} id={i} className="shift-row">
                            <div>{shift.date}</div>
                            <div className="centered">{start}</div>
                            <div>{end}</div>
                            <div>{shift.startLocation}</div>
                            <div>{shift.endLocation}</div>
                            <div onClick={()=>removeShift()}>Remove</div>
                        </div>
                    )
                })
                }
            </div>
        </div>
    )
}

export default ShiftTable;