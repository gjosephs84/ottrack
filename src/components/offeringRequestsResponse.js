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
            let answer = {
                ranking: 0,
                id: id
                };
            for (let i=0; i<shiftResponses.length; i++) {
                if (shiftResponses[i].shift == id) {
                    answer.ranking = shiftResponses[i].ranking
                    }
                }
            responsesToMap.push(answer);
        })
        responses.push({
            username: response.username,
            seniority: response.seniority,
            userId: response.userId,
            responses: responsesToMap
        })  
    }
    );

    // Let's try to assign shifts!!!!!!
    const assignShifts = () => {
        // First let's take a look at what repsonses looks like:
        console.log('responses inside of assignShifts is: ', responses);
        // Assume seniority 1 always starts for now.
        const responsesByRankings = [];
        responses.forEach(response => {
            console.log('response.responses is: ', response.responses);
            response.responses.sort((a, b) => (a.ranking > b.ranking) ? 1 : ((b.ranking > a.ranking) ? -1 : 0));
            responsesByRankings.push(response);
        });
        console.log('responsesByRanking is: ', responsesByRankings);
        // Let's get rid of any shifts a respondant isn't interested in:
        const theYesses = [];
        responsesByRankings.forEach(response => {
            const onlyYesses = []
            for (let i=0; i<response.responses.length; i++) {
                if (response.responses[i].ranking != 0) {onlyYesses.push(response.responses[i])}
            };
            theYesses.push({
                username: response.username,
                seniority: response.seniority,
                userId: response.userId,
                responses: onlyYesses
            });
        });
        console.log('After removing unwanted shifts, theYesses is: ', theYesses);
        // Let's attempt a while loop to assign the shifts
        // First a variable to specify which guard's responses are being considered: (May need to make sure theYesses is always in seniority order)
        let currentGuard = 0
        const numOfGuards = theYesses.length;
        // Create an array of assigned shfts to populate
        const assignedShifts = [];
        // Set up the objects in each
        shiftIds.forEach(shift => {
            assignedShifts.push({
                id: shift,
                assignedTo: null
            })
        })
        console.log('assignedShifts is: ', assignedShifts);
        let continueAssign = true;
        while (continueAssign == true) {
            const guard = theYesses[currentGuard];
            console.log('Current Lifeguard is: ', guard.username);
            const responses = guard.responses;
            // For each response, see if the shift is available
            for (let i=0; i<responses.length; i++) {
                // We'll use this variable to see if we should break the for loop early
                let shouldBreak = false;
                for (let j=0; j<assignedShifts.length; j++) {
                    // If and only if it hasn't been assigned ...
                    if (assignedShifts[j].assignedTo == null) {
                        console.log('Attempting to assign shift: ', assignedShifts[j].id, " to: ", guard.username);
                        if (assignedShifts[j].id == responses[i].id) {
                            console.log('And the shift is available!!!');
                            // Assign the shift!!!!!!!
                            assignedShifts[j].assignedTo = guard.userId;
                            // delete the request straight out of theYesses
                            theYesses[currentGuard].responses.splice(i, 1);
                            // Update shouldBreak so we can exit the i loop early
                            shouldBreak = true;
                        }
                        if (shouldBreak == true) {
                            break;
                        };
                    }
                    // If it's not equal to null, then just continue by looking at the next shift
                }
                // If something was assigned, break out of the i loop
                if (shouldBreak == true) {
                    //Attempting to break
                    break;
                };
                // If we got this far and didn't assign anything, remove the request straight out of theYesses
                //theYesses[currentGuard].responses.splice(i, 1);
                // Then move on to the next response from the current guard
            };
            // If nothing could be assigned, change the guard!
            currentGuard++;
            // But again, if we've reache the end of the number of guards, reset to zero
            if (currentGuard == numOfGuards) {
                currentGuard = 0;
            };
            // Finally, let's see if we should continue to assign
            let shouldContinue = false;
            assignedShifts.forEach(shift => {
                if (shift.assignedTo == null) {
                    shouldContinue = true;
                };
            });
            continueAssign = shouldContinue;
            console.log('assignedShifts is: ', assignedShifts);

        };

    }

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
                            let answerToGive;
                            if (answer.ranking == 0) {
                                classToGive = "response-div no"
                                answerToGive = "NO"
                            } else {
                                classToGive = "response-div yes"
                                answerToGive = answer.ranking;
                            }
                            return (
                                <div key={i} className={classToGive}>
                                    <strong>{answerToGive}</strong>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
            <button onClick={assignShifts}>Assign Shifts</button>
        </div>
    )
};

export default OfferingRequestsResponse;