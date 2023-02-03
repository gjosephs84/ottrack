import React from "react";
import convertTime from "./timeConverter";
import MITCard from "./mitCard";
import DateBox from "./dateBox";
import RemoveButton from "./removeButton";

const ShiftTable = ({shifts, removeShift, createMode, editMode, showAssigned, setConfirmState, title, buttonText, minWidth, maxWidth}) => {
    return (
        <div>
            <MITCard 
                minWidth={minWidth}
                maxWidth={maxWidth}
                cardTitle={title}
                cardBody={
                    <div>
                        {shifts.length === 0 && <h4 className="centered">Nothing here yet!</h4>}
                        {shifts.length > 0 &&
                        shifts.map((shift, i) => {
                            const start = convertTime(shift.startTime);
                            const end = convertTime(shift.endTime);
                            const theDate = new Date(new Date(shift.date).setHours(24,0,0,0)).toDateString();
                            return (
                                <div key={i} id={i} className="offering-row">
                                    <DateBox date={theDate} available={true}/>
                                    <div className="offering-shift-details">
                                        <h5 className="align-right"
                                            style={{
                                            marginBottom: "-5px"
                                        }
                                        }>{start} - {end}</h5>
                                        <p className="align-right">Starts at: {shift.startLocation}<br/>Ends at: {shift.endLocation}</p>
                                    </div>
                                    {createMode && <RemoveButton onClick={() => removeShift(i)}/>}
                                    {showAssigned && <p className="rotated">{shift.assignedTo}</p>}
                                </div>
                            )
                        })
                        }
                        {editMode && 
                        <div style={{marginTop:"20px"}}>
                            {shifts.length > 0 && <button 
                            className="button-full"
                            onClick={() => {setConfirmState(true)}}>
                            {buttonText}    
                            </button>}
                        </div>}
                    </div>
                }
            />
            
        </div>
    )
}

export default ShiftTable;