import React from "react";

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
                    return (
                        <div key={i} id={i} className="shift-row">
                            <div>{shift.date}</div>
                            <div className="centered">{shift.startTime}</div>
                            <div>{shift.endTime}</div>
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