import React from "react";
import axios from "axios";
import ShiftTable from "./shift-table";
import { UserContext } from "../context/context";

const AssignPartial = ({shifts, offeringId}) => {
    const ctx = React.useContext(UserContext);
    console.log("Shifts coming into AssignPartial is: ", shifts);
    console.log("offering ID coming in is: ", offeringId);
    const [available, setAvailable]         = React.useState(shifts);
    const [chosen, setChosen]               = React.useState([]);
    const [showAvailable, setShowAvailable] = React.useState(true);
    const [showSubmitted, setShowSubmitted] = React.useState(false);
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
        chosen.forEach(async shift => {
            let shiftId;
            const { date, startTime, endTime } = shift;
            let theShift = await axios
            .post('https://ottrack-backend.herokuapp.com/api/shifts', {
            data: {
                date: date,
                startTime: startTime,
                endTime: endTime,
                startLocation: "TBD",
                endLocation: "TBD",
                holiday: false,
                offering: offeringId,
                assigned_to: shift.userId
            }
        })
        .then (response => {
            console.log("response to assign partial is: ", response);
            shiftId = response.data.data.id;
        })
        .catch (error => {
            console.log("An error occurred assigning partial: ", error);
        });
        if ((endTime - startTime) >= 400) {
            const currentDate = new Date();
            let updateLastRecipient = await axios
            .post('https://ottrack-backend.herokuapp.com/api/last-recipients', {
                data: {
                userId: shift.userId,
                shift: shiftId,
                dateAssigned: currentDate,
                assignedBy: ctx.currentUser.id
                }
            })
            .then (response => {
                console.log("response to making last recipient is: ", response);
            })
            .catch(error => {
                console.log("An error occurred updating last recipient: ", error);
            });
        }

        })
        setShowSubmitted(true);   
    }
    return (
        <div>
            {!showSubmitted && <div>
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
            </div>}
            {showSubmitted && <div>
                <div className="box-350">
            <h3>Success!</h3>
            <p>Partial shifts have been assigned!
            </p>
            </div>
            </div>}
        </div>
    )
}

export default AssignPartial;