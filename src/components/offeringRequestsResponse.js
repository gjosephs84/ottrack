import axios from "axios";
import React from "react";
import { UserContext } from "../context/context";
import MITCard from "./mitCard";
import convertTime from "./timeConverter";

const OfferingRequestsResponse = ({offering, lastRecipient, emails}) => {
    console.log("emails is: ", emails);
    console.log("offering is: ", offering);
    console.log(offering.offeringId);
    let emailTemplate = "mailto:";
    emails.forEach(email => emailTemplate += `${email},`);
    console.log("emailTemplate is: ", emailTemplate);
    emailTemplate.slice(0,-1);
    emailTemplate += `?subject=New Overtime Shifts have been Assigned&body=Hello team, new overtime shifts have been assigned. To check results, please visit OTTrack. Any upcoming shifts you were awarded will appear on your dashboard. Feel free to respond here if you have any questions. Thanks!`
    // Bring in the context in order to record who is doing the assigning
    const ctx = React.useContext(UserContext);
    if (offering.responses.length == 0) {
        return (<p>Nothing to see here yet.</p>)
    }
    const responses = [];
    const shiftIds = [];
    const conflicts = [];
    const assignmentLog = [];
    let defaultFirstGuard;
    let defaultFirstGuardIndex;
    let alternateFirstGuard;
    let alternateFirstGuardIndex = 0;   
    let finalGuard; // Keep track of the last person to get assigned something
    let finalShift; // Keep track of the last shift assigned
    
/*****
  * * * * *
    * * * * *
    
         Get the shift ids and put them in the arrays above   

    * * * * * 
  * * * * *
*****/
 
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

/*****
  * * * * *
    * * * * *
    
         Find conflicting shifts. That is, to say, shifts whose start/end times overlap with each other  

    * * * * * 
  * * * * *
*****/

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

/*****
  * * * * *
    * * * * *
    
        Now the magic of extracting employee shift preferences so we can see them.
        Go through each respondant's answers and account for anything missing
        as a "NO" 

    * * * * * 
  * * * * *
*****/
    
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
      });
      responses.push({
        username: response.username,
        seniority: response.seniority,
        userId: response.userId,
        responses: responsesToMap
      })  
    }
    );

/*****
  * * * * *
    * * * * *
    
        Sort the responses by seniority, then figure out which guard got the last overtime.
        That way the next person in the seniority order can be set as
        defaultFirstGuard

    * * * * * 
  * * * * *
*****/

    responses.sort((a, b) => (a.seniority > b.seniority) ? 1 : -1);
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

/*****
  * * * * *
    * * * * *
    
        THE RESPONSES TABLE COMPONENT
            Here we are going to put together the table that will show all
            the responses from guards. The state variables exist 
            so that after responses are actually assigned, the table will update
            to reflect which guard got what shift

    * * * * * 
  * * * * *
*****/

    const ResponsesTable = () => {
      const [allResponses, setAllResponses] = React.useState(responses);
      const [showResults, setShowResults] = React.useState(false);
        
/*****
  * * * * *
    * * * * *
    
        THE ASSIGNSHIFTS FUNCTION
            Here is the actual function to assign shifts to guards.
            It takes an input of firstGuard, which, in the default case, is
            the index stored in defaultFirstGuardIndex, referencing the position
            in the responses/theYesses array corresponding with the guard up next for
            overtime assignment.

            Because there is a potential scenario when a previous overtime offering
            was not recorded by a manager, there is an option below the responses table to
            override the guard the system believes is up next. In this situation, the index value
            stored in alternateFirstGuardIndex is passed in instead, allowing for said bypass to occur.

    * * * * * 
  * * * * *
*****/
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
            
            // Sort theYesses by seniority
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

// ********************
    // ********************

    // HERE STARTS THE WHILE LOOP FOR ASSIGNING

    // ********************
// ********************

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
                    // If and only if it hasn't been assigned ...
                    if (assignedShifts[j].assignedTo == null) {
                      if (assignedShifts[j].id == responses[i].id) {
                        assignmentLog.push(`${guard.username} requested shift number ${responses[i].id} which was their number ${responses[i].ranking} choice. The shift is available, so assigning to them now!`);
                        // Assign the shift!!!!!!!
                        assignedShifts[j].assignedTo = guard.userId;
                        // Update finalGuard in case this is the end
                        finalGuard = currentGuard;
                        finalShift = assignedShifts[j].id;
                        // Check to see if there are any conflicting shifts the to the one being assigned
                        if (conflicts[j].conflictingShifts.length !== 0) {
                          const conflictIndexes = [];
                          // Check to see if the current gaurd WANTED any conflicting shifts
                          for (let k=0; k<theYesses[currentGuard].responses.length; k++ ) {
                            for (let l=0; l<conflicts[j].conflictingShifts.length; l++) {
                              if (conflicts[j].conflictingShifts[l] === theYesses[currentGuard].responses[k].id) {
                                conflictIndexes.push(k);
                              };
                            };
                          };
                          if (conflictIndexes.length > 0) {
                            conflictIndexes.forEach(index => {
                              assignmentLog.push(`${guard.username} also requested shift number ${guard.responses[index].id}, which conflicts with the shift just assigned, so deleting that one from possible shifts to assign to ${guard.username}`);
                              theYesses[currentGuard].responses.splice(index, 1)
                            });
                          };
                        } else {
                          console.log("No conflicting shifts here");
                        };
                        // delete the request straight out of theYesses
                        theYesses[currentGuard].responses.splice(i, 1);
                        // Update shouldBreak so we can exit the i loop early
                        shouldBreak = true;
                      };
                      if (shouldBreak == true) {
                        break;
                      };
                    };
                    // If it's not equal to null, let's see if the guard wanted the shift and then delete that request from theYesses
                    if (assignedShifts[j].assignedTo != null) {
                      if (assignedShifts[j].id == responses[i].id) {
                        assignmentLog.push(`${guard.username} requested shift number ${responses[i].id} as their ${responses[i].ranking} choice, but it was already taken. Moving on to their next choice ...`);
                        // delete the request straight out of theYesses
                        theYesses[currentGuard].responses.splice(i, 1);
                        j = -1;
                        // if the guard is out of remaining responses, break at the top of the j loop
                        if (theYesses[currentGuard].responses.length == 0) {
                          assignmentLog.push(`There is nothing left to assign to ${guard.username}`);
                          shouldBreak = true;
                        }
                      }
                    }
                  }
                // If something was assigned, break out of the i loop
                  if (shouldBreak == true) {
                    assignmentLog.push(`Since a shift was assigned to ${guard.username}, let's move on to the next guard ...`);
                    break;
                  };
                };
                // If nothing could be assigned, change the guard!
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
                    responsesLeft = true;
                  };
                });
                assignedShifts.forEach(shift => {
                  if (shift.assignedTo == null) {
                    shouldContinue = true;
                  };
                });
                if ((responsesLeft == true) && (shouldContinue == true)) {
                  continueAssign = true;
                } else {
                  continueAssign = false;
                  // Since we're done, let's update last recipient
                  const currentDate = new Date();
                  const guardId = theYesses[finalGuard].userId;
                  let updateLastRecipient = axios
                    .post('https://ottrack-backend.herokuapp.com/api/last-recipients', {
                    data: {
                      userId: guardId,
                      shift: finalShift,
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
                  // Make the current offering inactive
                  let deactivateOffering = axios
                    .put(`https://ottrack-backend.herokuapp.com/api/offerings/${offering.offeringId}`, {
                        data: {
                            active: false
                        }
                    })
                    .then (response => {
                        console.log("response to deactivating offering is: ", response);
                    })
                    .catch(error => {
                        console.log("An error occurred deactivating the offering: ", error);
                    })
                }
            };

// ********************
    // ********************

    // HERE ENDS THE WHILE LOOP FOR ASSIGNING

    // ********************
// ********************            
    
            // Now let's see if we can port those results to the responses array. First, sort by assignedTo:
            assignedShifts.sort((a,b) => (a.assignedTo < b.assignedTo) ? 1 : -1);
            assignedShifts.forEach(shift => {
              const { id, assignedTo } = shift;
              if (assignedTo == null) {
                return;
              }
              // Find the right respondant
              for (let i=0; i<responses.length; i++) {
                if (responses[i].userId == assignedTo) {
                  responses[i].responses.forEach(response => {
                    if (response.id == id) {
                      response.assigned = true
                      }
                  })
                }
              }
            });
    
            // Make sure shifts in responses show up in the correct order
            responses.forEach(response => {
              response.responses.sort((a,b) => (a.id > b.id) ? 1 : -1);
            });
            
// LETS UPDATE THE DATABASE TO ACTUALLY ATTACH GUARDS TO SHIFTS!!!!!!!!!!!!!!
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            assignedShifts.forEach(shift => {
              const url = `https://ottrack-backend.herokuapp.com/api/shifts/${shift.id}`
              let updateShift = axios
              .put(url, {
                data: {
                  assigned_to: shift.assignedTo
                }
              })
              .then(response => {
                console.log("Updating shifts:");
                console.log(response.data.data);
              })
              .catch(error => {
                console.log('An error occurred: ', error.response);
              })
            });

        setAllResponses(responses);
        setShowResults(true);
        }

// ********************
    // ********************

    // HERE ENDS THE ASSIGNSHIFT FUNCTION

    // ********************
// ********************

/*****
  * * * * *
    * * * * *
    
        THE RETURN
           

    * * * * * 
  * * * * *
*****/
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
              console.log("!!!!!shift data is: ", shift);
              let cleanStart = convertTime(shift.startTime);
              let cleanEnd = convertTime(shift.endTime);
              return (
                <div key={i} className="response-shift">
                  <div>
                    <strong>ID: {shift.id}</strong> | {shift.date} | {cleanStart} - {cleanEnd}
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
                      classToGive = "response-div no";
                      answerToGive = "NO";
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
            {showResults && <div> 
            <div className="offering-response">
                <div className="response-shifts-column">
                    <div className="response-header">
                        <h5>Shift</h5>
                    </div>
                    {offering.shifts.map((shift, i) => {
                        let cleanStart = convertTime(shift.startTime);
                        let cleanEnd = convertTime(shift.endTime);
                        return (
                            <div key={i} className="response-shift">
                                <div>
                                    <strong>ID: {shift.id}</strong> | {shift.date} | {cleanStart} - {cleanEnd}
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
            </div>
            <br/>
            <a href={emailTemplate}>
            <button>Notify Guards of Results</button></a>
            </div>
            }
            </div>
    )
        
    }
    
    return (
            <ResponsesTable/>
    )
};

export default OfferingRequestsResponse;