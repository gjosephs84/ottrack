import React from "react";

const OfferingRequestsResponse = ({offering}) => {
    console.log("offering coming in is: ", offering);
    // Let's process our respondants to display in a table of sorts
    // responses will hold an array of new objects showing the username
    // and their responses in either "NO" or ranking
    const responses = [];
    const shiftIds = [];
    // Get the shift ids and put them in the array above
    offering.shifts.forEach(shift => {
        shiftIds.push(shift.id);
    });
    // Now the magic of extracting those preferences so we can see them.
    // Go through each respondant's answers and account for anything missing
    // as a "NO"
    offering.responses.forEach(response => {
        const responsesToMap = [];
        const { shiftResponses } = response;
        
        shiftIds.forEach(id => {
            let answer = "NO";
            for (let i=0; i<shiftResponses.length; i++) {
                if (shiftResponses[i].shift == id) {
                    answer = shiftResponses[i].ranking
                }
            };
            responsesToMap.push(answer);
        })
        responses.push({
            username: response.username,
            responses: responsesToMap
        })
    }
    );

    return (
        <div className="offering-response">
            <div className="response-shifts-column">
                <div className="response-header">
                    <h5>Shift</h5>
                </div>
                {offering.shifts.map((shift, i) => {
                    return (
                        <div key={i} className="response-shift">
                            <div>
                                {shift.date} | {shift.startTime} - {shift.endTime}
                            </div>
                            <div>
                                Starts at: {shift.startLocation} | Ends at: {shift.endLocation}
                            </div>
                        </div>
                    ) 
                })}
            </div>
            {responses.map((response) => {
                console.log("response is: ", response);
                return (
                    <div key={response.username} className="response-column">
                        <div className="response-header">
                            <h5>{response.username}</h5>
                        </div>
                        {response.responses.map((answer, i) => {
                            let classToGive;
                            if (answer == "NO") {
                                classToGive = "response-div no"
                            } else {
                                classToGive = "response-div yes"
                            }
                            return (
                                <div key={i} className={classToGive}>
                                    <strong>{answer}</strong>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
};

export default OfferingRequestsResponse;