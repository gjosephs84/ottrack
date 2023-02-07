import React from "react";
import ShiftTable from "./shift-table";

const AssignPartial = ({shifts}) => {
    console.log("Shifts coming into AssignPartial is: ", shifts);
    const [available, setAvailable]         = React.useState(shifts);
    const [chosen, setChosen]               = React.useState([]);
    const [showAvailable, setShowAvailable] = React.useState(true);
    console.log("available is: ", available);
    console.log("chosen is: ", chosen);
    const addShift = (index) => {
        let temp = [...available];
        const added = temp.splice(index, 1);
        console.log("added is: ", added);
        if (temp.length == 0) {
            setShowAvailable(false);
        }
        setAvailable(temp);
        let chosenTemp = [...chosen];
        const { username, userId, id, date, startTime, endTime} = added[0];
        chosenTemp.push({
            username: username,
            userId: userId,
            id: id,
            date: date,
            startTime: startTime,
            endTime: endTime
        });
        setChosen(chosenTemp);
    }
    const removeShift = (index) => {
        let temp = [...chosen];
        const removed = temp.splice(index, 1);
        setChosen(temp);
        let availableTemp = [...available];
        const { username, userId, id, date, startTime, endTime } = removed[0];
        availableTemp.push({
            username: username,
            userId: userId,
            id: id,
            date: date,
            startTime: startTime,
            endTime: endTime
        });
        setAvailable(availableTemp);
        setShowAvailable(true);
    };
    const submitPartials = () => {
        alert("submitted");
    }
    return (
        <div>
            <div className="box-350">
            <h3>Partial Shift Availability</h3>
            <p>Not all shifts were assigned in their entirety.<br/>
            Lifeguards have expressed interest in working portions of the shifts listed below.
            To accept these shifts, click/tap the green check next to any/all. You will then be given the chance to confirm.
            </p>
            </div>
            {showAvailable && <ShiftTable 
                title={"Available Partials"}
                shifts={available}
                minWidth={"350px"}
                partialAvailability={true}
                addShift={addShift}
            />}
            {chosen.length > 0 && <ShiftTable 
                title={"Selected Partials"}
                shifts={chosen}
                minWidth={"350px"}
                editMode={true}
                createMode={true}
                partialAvailability={true}
                buttonText={"Confirm Partial Shifts"}
                removeShift={removeShift}
                onPartialsConfirm={submitPartials}
            />}
        </div>
    )
}

export default AssignPartial;