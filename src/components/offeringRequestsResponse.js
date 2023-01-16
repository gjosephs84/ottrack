import axios from "axios";
import React from "react";

const OfferingRequestsResponse = ({offering, lastRecipient}) => {
    console.log("Last Recipient coming in is: ", lastRecipient);
    // Let's process our respondants to display in a table of sorts
    // responses will hold an array of new objects showing the username
    // and their responses in either "NO" or ranking
    const responses = [];
    const shiftIds = [];
    const conflicts = [];
    const assignmentLog = [];
    let defaultFirstGuard;
    let defaultFirstGuardIndex;
    let alternateFirstGuard;
    let alternateFirstGuardIndex = 0;
    // Get the shift ids and put them in the arrays above
    offering.shifts.forEach(shift => {
        shiftIds.push(shift.id);
        conflicts.push(
            {
                id: shift.id,
                date: shift.date,
                startTime: shift.startTime,
                endTime: shift.endTime,
                conflictingShifts: []
            }
        );
    });

    // Let's try to find those conflicting shifts. That is, to say, shifts whose start/end times overlap with each other
    for (let i=0; i<conflicts.length; i++) {
        const { startTime, endTime, date } = conflicts[i];
        for (let j=0; j<conflicts.length; j++) {
            if (j === i) {
                console.log(`j is ${j} and i is ${i}, so we're not going to do anything this go-round.`);
            } else {
                let jDate = conflicts[j].date;
                let jStart = conflicts[j].startTime;
                let jEnd = conflicts[j].endTime;
                if (jDate !== date) {
                    console.log(`jDate is ${jDate} and date i date is ${date}, so there is no chance of conflict`);
                } else {
                    // if the j shift starts before the i shift, and ends after the i shift begins, there's a conflict!
                let triggeredFirstCase = false;
                if ((jStart <= startTime) && (jEnd > (startTime + 16))) {
                    triggeredFirstCase = true;
                    conflicts[i].conflictingShifts.push(conflicts[j].id);
                };
                // if the j shift starts after the i shift, but before the i shift ends, also a conflict!
                if ((jStart >= startTime) && (jStart <= (endTime - 16))) {
                    if (triggeredFirstCase != true) {
                        conflicts[i].conflictingShifts.push(conflicts[j].id);
                    }
                    
                };
                };
            };
        };
    };

    console.log("After all that, conflicts is: ", conflicts);
    // Now the magic of extracting those preferences so we can see them.
    // Go through each respondant's answers and account for anything missing
    // as a "NO"
    offering.responses.forEach(response => {
        const responsesToMap = [];
        const { shiftResponses } = response;
        
        shiftIds.forEach(id => {
            let answer = {
                ranking: 0,
                id: id,
                assigned: false
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

    // Let's sort responses by seniority ...
    responses.sort((a, b) => (a.seniority > b.seniority) ? 1 : -1);

    // Now figure out which guard got the last overtime so we can set the person next in seniority as defaultFirstGuard

    const numOfGuards = responses.length;
    const gotLastOT = (guard) => guard.username == lastRecipient.name;
    let lastGuard = responses.findIndex(gotLastOT);
    let nextGuard = lastGuard + 1;

    // Then, if the last guard was lowest in seniority, set the next guard as the 0 index position, otherwise, we're good already
            if (nextGuard == numOfGuards ) {
                defaultFirstGuard = responses[0];
                defaultFirstGuardIndex = 0;
            } else {
                defaultFirstGuard = responses[nextGuard];
                defaultFirstGuardIndex = nextGuard;
            };

    /* THE RESPONSES TABLE COMPONENT
        Here we are going to put together the table that will show all
        the responses from guards. I'm trying to use a state variable here so that after responses are actually assigned, the table will update
        to reflect which guard got what shift
    */

    const ResponsesTable = () => {
        // Here is the aforementioned state variable
        const [allResponses, setAllResponses] = React.useState(responses);
        const [showResults, setShowResults] = React.useState(false);
        
// Here is the function to actually assign the shifts, and eventually update the allResponses state.
        const assignShifts = (firstGuard) => {
            let currentGuard = firstGuard;
            const responsesByRankings = [];
            responses.forEach(response => {
                response.responses.sort((a, b) => (a.ranking > b.ranking) ? 1 : ((b.ranking > a.ranking) ? -1 : 0));
                responsesByRankings.push(response);
            });
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
            // Let's attempt a while loop to assign the shifts
            // First a variable to specify which guard's responses are being considered: (May need to make sure theYesses is always in seniority order)
    
            theYesses.sort((a,b) => (a.seniority > b.seniority) ? 1 : -1);
            
            let startingGuardName = theYesses[currentGuard].username;                        
            assignmentLog.push(`Starting Shift Assignments with ${startingGuardName}, because they are up first ...`);
            // Create an array of assigned shfts to populate
            const assignedShifts = [];
            // Set up the objects in each
            shiftIds.forEach(shift => {
                assignedShifts.push({
                    id: shift,
                    assignedTo: null
                })
            })
            let continueAssign = true;

// HERE STARTS THE WHILE LOOP FOR ASSIGNING

            while (continueAssign == true) {
                const guard = theYesses[currentGuard];
                assignmentLog.push(`Lifeguard to whom the next shift could be assigned is ${guard.username}`);
                const responses = guard.responses;
                // For each response, see if the shift is available
                for (let i=0; i<responses.length; i++) {
                    // We'll use this variable to see if we should break the for loop early
                    let shouldBreak = false;
                    for (let j=0; j<assignedShifts.length; j++) {
                        // If the current guard is out of responses, break
                        if (shouldBreak == true) {
                            break;
                        }
                        console.log(`      ${guard.username} is currently requesting ${responses[i].id} whose ranking is ${responses[i].ranking}`);
                        console.log('         Attempting to assign shift: ', assignedShifts[j].id, " to: ", guard.username);
                        // If and only if it hasn't been assigned ...
                        if (assignedShifts[j].assignedTo == null) {
                            if (assignedShifts[j].id == responses[i].id) {
                                console.log('            And the shift is available!!!');
                                assignmentLog.push(`${guard.username} requested shift number ${responses[i].id} which was their number ${responses[i].ranking} choice. The shift is available, so assigning to them now!`);
                                // Assign the shift!!!!!!!
                                assignedShifts[j].assignedTo = guard.userId;
                                console.log("assignedShifts[j] is: ", assignedShifts[j]);
                                console.log("meanwhile, conflicts[j] is: ", conflicts[j]);
                                // Check to see if there are any conflicting shifts the to the one being assigned
                                if (conflicts[j].conflictingShifts.length !== 0) {
                                    console.log("COOOOOONNNNFFFLIIIIIICCCCT!!!!!");
                                    const conflictIndexes = [];
                                    // Check to see if the current gaurd WANTED any conflicting shifts
                                    for (let k=0; k<theYesses[currentGuard].responses.length; k++ ) {
                                        console.log(`In the k loop and k is ${k}`);
                                        for (let l=0; l<conflicts[j].conflictingShifts.length; l++) {
                                            console.log(`Inside the l loop and l is ${l}`);
                                            console.log(`conflicts[j].conflictingShifts[l] is: ${conflicts[j].conflictingShifts[l]}`);
                                            console.log(`theYesses[currentGuard].responses[k].id is ${theYesses[currentGuard].responses[k].id}`);
                                            
                                            if (conflicts[j].conflictingShifts[l] === theYesses[currentGuard].responses[k].id) {
                                                console.log("Looks like a conflict to me!!!!");
                                                console.log(`conflicts[j].conflictingShifts[l] is: ${conflicts[j].conflictingShifts[l]}`);
                                                console.log("conflicts[j].conflictingShifts is:");
                                                console.log(conflicts[j].conflictingShifts);
                                                conflictIndexes.push(k);
                                            };
                                            
                                        }
                                    };
                                    console.log('conflictIndexes is: ', conflictIndexes);
                                    if (conflictIndexes.length > 0) {
                                        conflictIndexes.forEach(index => {
                                            console.log(`Deleting conflicting shift ${theYesses[currentGuard].responses[index].id}`);
                                            assignmentLog.push(`${guard.username} also requested shift number ${guard.responses[index].id}, which conflicts with the shift just assigned, so deleting that one from possible shifts to assign to ${guard.username}`);
                                            theYesses[currentGuard].responses.splice(index, 1)
                                        })
                                    }
                                } else {
                                    console.log("                           No conflicting shifts here");
                                }
                                // delete the request straight out of theYesses
                                theYesses[currentGuard].responses.splice(i, 1);
                                // Update shouldBreak so we can exit the i loop early
                                console.log('            Remaining responses for: ', guard.username, " is ", theYesses[currentGuard].responses);
                                shouldBreak = true;
                            }
                            if (shouldBreak == true) {
                                break;
                            };
                        }
                        // If it's not equal to null, let's see if the guard wanted the shift and then delete that request from theYesses
                        if (assignedShifts[j].assignedTo != null) {
                            console.log('      Looks like this shift was already taken by: ', assignedShifts[j].assignedTo);
                            console.log('      Checking to see if ', assignedShifts[j].id, " was requested by ", guard.username);
                            if (assignedShifts[j].id == responses[i].id) {
                                console.log(`            Found the already taken shift in ${guard.username} requests ... Better delete it.`);
                                assignmentLog.push(`${guard.username} requested shift number ${responses[i].id} as their ${responses[i].ranking} choice, but it was already taken. Moving on to their next choice ...`);
                                // delete the request straight out of theYesses
                                theYesses[currentGuard].responses.splice(i, 1);
                                console.log(`            Remaining responses for ${guard.username} are: `, theYesses[currentGuard].responses);
                                j = -1;
                                // if the guard is out of remaining responses, break at the top of the j loop
                                if (theYesses[currentGuard].responses.length == 0) {
                                    console.log(`                   ${guard.username} is out of responses!`);
                                    assignmentLog.push(`There is nothing left to assign to ${guard.username}`);
                                    shouldBreak = true;
                                }
                            }
                        }
                    }
                    // If something was assigned, break out of the i loop
                    if (shouldBreak == true) {
                        console.log(`      Since something was assigned to ${guard.username}, let's move on to the next guard ...`);
                        assignmentLog.push(`Since a shift was assigned to ${guard.username}, let's move on to the next guard ...`);
                        //Attempting to break
                        break;
                    };
                    // If we got this far and didn't assign anything, remove the request straight out of theYesses
                    //theYesses[currentGuard].responses.splice(i, 1);
                    // Then move on to the next response from the current guard
                };
                // If nothing could be assigned, change the guard!
                console.log(`      Changing the guard ...`);
                currentGuard++;
                // But again, if we've reached the end of the number of guards, reset to zero
                if (currentGuard == numOfGuards) {
                    currentGuard = 0;
                };
                // Finally, let's see if we should continue to assign
                let responsesLeft = false;
                let shouldContinue = false;
                theYesses.forEach(guard => {
                    if (guard.responses.length != 0) {
                        //console.log('found something!!!!!', guard);
                        //console.log('responsesLeft is currently: ', responsesLeft);
                        responsesLeft = true;
                        //console.log('after assigning as true, responsesLeft is: ', responsesLeft);
                    };
                })
                assignedShifts.forEach(shift => {
                    if (shift.assignedTo == null) {
                        //console.log('found a null shift, and shouldContinue is currently: ', shouldContinue);
                        shouldContinue = true;
                        //console.log('and after assigning as true, shouldContinue is: ', shouldContinue);
                    };
                });
    
                if ((responsesLeft == true) && (shouldContinue == true)) {
                    continueAssign = true;
                } else {
                    continueAssign = false;
                }
                console.log('assignedShifts is: ', assignedShifts);
                // But break if the everything has been picked over
    
            };
    
            // Now let's see if we can port those results to the responses array. First, sort by assignedTo:
    
            assignedShifts.sort((a,b) => (a.assignedTo < b.assignedTo) ? 1 : -1);
            console.log('affer sorting, assignedShifts is: ', assignedShifts);
            console.log('and for reference, responses is: ', responses);
    
            assignedShifts.forEach(shift => {
                const { id, assignedTo } = shift;
                if (assignedTo == null) {
                    console.log("found a null");
                    return;
                }
                // Find the right respondant
                for (let i=0; i<responses.length; i++) {
                    if (responses[i].userId == assignedTo) {
                        console.log('found it! ', responses[i].userId, assignedTo);
                        responses[i].responses.forEach(response => {
                            if (response.id == id) {
                                response.assigned = true
                            }
                        })
                    }
                }
            });
    
            console.log('now responses is: ', responses);
            console.log('but allResponses is: ', allResponses);

            // Make sure shifts in responses show up in the correct order
            responses.forEach(response => {
                response.responses.sort((a,b) => (a.id > b.id) ? 1 : -1);
            });
            
// LETS UPDATE THE DATABASE TO ACTUALLY ATTACH GUARDS TO SHIFTS!!!!!!!!!!!!!!
            assignedShifts.forEach(shift => {
                const url = `https://ottrack-backend.herokuapp.com/api/shifts/${shift.id}`
                let updateShift = axios
                .put(url, {
                    data: {
                        assignedTo: shift.assignedTo
                    }
                })
                .then(response => {
                    console.log(response.data.data)
                })
                .catch(error => {
                    console.log('An error occurred: ', error.response);
                })
            });


        // Here is hoping for a re-render!!!!!
        setAllResponses(responses);
        setShowResults(true);
        console.log("----------------------------------------------------");
        console.log(assignmentLog);
        }
        return (
            <div>
            {!showResults && 
            <div>
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
                {allResponses.map((response) => {
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
                                    if (answer.assigned == true) {
                                        console.log("%%%%%%%%%%%%%%%%%%%%%%%%% Setting Assigned");
                                        classToGive = "response-div assigned"
                                    }
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
            </div>
            <br/>
            <div className="centered">
            <button className="button-wide" onClick={() => assignShifts(defaultFirstGuardIndex)}>Assign Shifts starting with {defaultFirstGuard.username}</button>
            </div>
            <h4 className="centered-text">Or</h4>
            <div className="centered">
                <div>
                <div className="centered">
                <select 
                    name="guard"
                    id="guard"
                    onChange={(e) => {
                        alternateFirstGuard = responses[e.target.value];
                        alternateFirstGuardIndex = e.target.value;
                        console.log("Alternate first guard's index is: ", e.target.value);
                        console.log("Alternate first guard's full info is: ", alternateFirstGuard);
                    }}
                    >
                    {responses.map((guard, index) => {
                        return (
                            <option
                                key={guard.userId}
                                value={index}
                            >
                                {guard.username}
                            </option>
                        )
                    })}

                </select>
            </div>
            <button onClick={() => assignShifts(alternateFirstGuardIndex)}>Override Recorded Order</button>
            </div>
            </div>
            </div>
            }
            {showResults && <div className="offering-response">
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
                {allResponses.map((response) => {
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
                                    if (answer.assigned == true) {
                                        classToGive = "response-div assigned"
                                    }
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
                {JSON.stringify(assignmentLog)}
            </div>}
            </div>
    )
        
    }
    
    return (
            <ResponsesTable/>
    )
};

export default OfferingRequestsResponse;