import React from "react";
import { ShiftContext } from "../context/shift-context";
import TimePicker from "./timePicker";
import ShiftTable from "./shift-table";

const PartialAvailability = ({offering}) => {
    const shiftCtx = React.useContext(ShiftContext);
    const shiftIds = [];
    const [partialShifts, setPartialShifts] = React.useState([]);
    const [showDecline, setShowDecline] = shiftCtx.declineState;
    offering.forEach(shift => {
        shiftIds.push({
            shift: shift.id,
            value: shift.id
        });
    });
    console.log("shiftIds is: ", shiftIds);
    let shiftId;

    // A component for selecting partial shifts
    const PartialShift = ({shiftIds}) => {
        const [start, setStart] = React.useState(null);
        const [end, setEnd] = React.useState(null);
        // A function to remove a submitted shift
        const removeShift = (index) => {
            let temp = [...partialShifts];
            temp.splice(index, 1);
            setPartialShifts(temp);
            shiftCtx.partial = temp;
            if (temp.length == 0 && shiftCtx.selected.length == 0) {
                console.log("shiftCtx.partial is: ", shiftCtx.partial);
                setShowDecline(true);
            }
        }
        // A function to add the partial availability shift
        const handleClick = (id, start, end) => {
            let date;
            offering.forEach(shift => {
                if (shift.id === id) {
                    date = shift.date
                };
            });
            const tempShifts = [...partialShifts];
            tempShifts.push({
                id: id,
                date: date,
                startTime: start,
                endTime: end,
                startLocation: "TBD",
                endLocation: "TBD"
            });
            setPartialShifts(tempShifts);
            shiftCtx.partial = tempShifts;
            setShowDecline(false);

        }
        return (
            <div>
            <div className="partial-shift">
                <select className="id-picker" onChange={(e) => {shiftId = e.target.value;
                }}>
                    <option value={null}>—</option>
                    {shiftIds.map((id) => {
                        return (
                            <option key={id.shift} value={id.id}>{id.shift}</option>
                        )
                    })}
                </select>
                <div className="partial-time">
                <h5>Start: </h5>
                <TimePicker parentState={start} setParentState={setStart} name={"start"} />
                <h5>End: </h5>
                <TimePicker parentState={end} setParentState={setEnd} name={"end"} />
                </div>
            </div>
            <button className="button-wide" onClick={() => handleClick(shiftId, start, end)}>Confirm</button>
            <br/><br/>
            {partialShifts.length > 0 && <div>
                <ShiftTable 
                    title={"My Partial Availability"}
                    shifts={partialShifts}
                    createMode={true}
                    minWidth={"350px"}
                    removeShift={removeShift}
                />
                <br/>
                </div>}
            </div>
        )
    }

    return (
        <div>
        <div className="partial-shift">
            <h5>ID</h5>
            <h5>Availability</h5>
        </div>
        <PartialShift shiftIds={shiftIds}/>
        </div>
    )

}

export default PartialAvailability;