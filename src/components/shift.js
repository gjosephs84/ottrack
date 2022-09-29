import React from "react";

const Shift = ({shift, index, remove}) => {
    const handle = () => {
        remove(index);
    }
    return (
        <div className="shift">
            <div className="shift-date">
                <h4>Date:</h4>
                {shift.date}
            </div>
            <div>
                <h4>Start Time:</h4>
                {shift.startTime}
            </div>
            <div>
                <h4>End Time:</h4>
                {shift.endTime}
            </div>
            <div>
                <h4>Start Location:</h4>
                {shift.startLocation}
            </div>
            <div>
                <h4>End Location:</h4>
                {shift.endLocation}
            </div>
            <button onClick={handle}>Remove</button>
        </div>
    );
}

export default Shift;