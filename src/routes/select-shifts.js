import React from "react";
import axios from 'axios';
import SelectableShifts from "../components/selectableShifts";
import ShiftRanker from "../components/shiftRanker";
import { useQuery, gql } from "@apollo/client";
import { ShiftContext } from "../context/shift-context";
import { UserContext } from "../context/context";

// The graphql query to retrieve all the active offerings
/* 
    -----NOTE ON THE FILTER IN THE QUERY-----
    By putting a filter on offerings, I should ONLY get the offerings
    that are listed as active at the time of the query. Should follow
    the format (filters: {fieldImFilerting : {condition}})

*/

const GET_ACTIVE_OFFERINGS = gql`
query GetActiveOfferings{
    offerings(filters: {active: {eq: true}}){
      data {
        attributes{
          active
          offering_response {
            data {
              id
            }
          }
          shifts {
            data {
              id
              attributes {
                date
                startTime
                endTime
                startLocation
                endLocation
                holiday
              }
            }
          }
        }
      }
    }
  }
  `;

const SelectShifts = () => {
    // Bring in the context
    const shiftCtx = React.useContext(ShiftContext);
    const ctx = React.useContext(UserContext);
    const [show, setShow] = React.useState(true);
    const [showDecline, setShowDecline] = React.useState(true);
    
    // This state variable is going to be used for validation in the submit button
    // And will be called inside <ShiftRanker> to be updated there onChange of the shift <select>
    const [disableSubmit, setDisableSubmit] = React.useState(true);
    // This state variable will show why the submit button is not enabling
    const [rankingError, setRankingError] = React.useState(null);
    // Inject the state variables into the shift context
    shiftCtx.declineState = [showDecline, setShowDecline];
    shiftCtx.disabledState = [disableSubmit, setDisableSubmit];
    shiftCtx.errorState = [rankingError, setRankingError];
    


    // A function to handle submit of initial preferences
    const handleSubmit = () => {
      console.log("Shifts selected are:");
      console.log(shiftCtx.selected);
      console.log("Selected by:");
      console.log(ctx.currentUser.username);
      setShow(false);
    };

    // A function to go back to selecting preferences
    const goBack = () => {
      shiftCtx.selected = [];
      shiftCtx.ranked = [];
      console.log("in the go back selected has become", shiftCtx.selected);
      setShow(true);
      setDisableSubmit(true);
      setShowDecline(true);
      setRankingError("");
    }

    // Start by getting the active offering
    const { loading, error, data } = useQuery(GET_ACTIVE_OFFERINGS);
    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error</p>
    // The data coming in is messy. Time to clean it up so it's useable.
    // First get the data in its raw form
    let rawOfferings = data.offerings.data;
    // Then create a clean array to push it into
    const offerings = [];
    // And one to hold the ids of the offering responses
    const responseIds = [];
    // Isolate one of the dirty offerings at a time
    for (let i=0; i<rawOfferings.length; i++) {
        let current = rawOfferings[i].attributes.shifts.data;
        let currentId = rawOfferings[i].attributes.offering_response.data.id;
        // Clean it up further -- Get down past the attributes to the meat
        // of the shift
        // Begin with a place to hold the super-clean version
        const cleanOffering = [];
        for (let j=0; j<current.length; j++) {
            // isolate the shift
            // but grab the shift's id on the way
            const { date, startTime, endTime, startLocation, endLocation, holiday } = current[j].attributes;
            let cleanShift = {
              id: current[j].id,
              date: date,
              startTime: startTime,
              endTime: endTime,
              startLocation: startLocation,
              endLocation: endLocation,
              holiday: holiday
              };
            console.log("Clean Shift is:");
            console.log(cleanShift);
            cleanOffering.push(cleanShift);
        };
        // Now push the clean offering into offerings
        offerings.push(cleanOffering);
        responseIds.push(currentId);
    };
    // Reverse the arrays so offerings appear with most recent first
    offerings.reverse();
    responseIds.reverse();

    // Here we decline everything
    const declineAll = () => {
      console.log('declining all');
      alert("declining all");
      shiftCtx.ranked = [];
      submitResponse();
    };
    
    // Here we submit the responses

    const submitResponse = async() => {
      alert("Clicked!!!!");
      let respondantId;

      // First let's create a respondant
      let theRespondant = await axios
        .post('https://ottrack-backend.herokuapp.com/api/respondants', {
          data: {
            offering_response: responseIds[0],
            users_permissions_user: ctx.currentUser.id,
            name: ctx.currentUser.username,
            seniority: 0
          }
        })
        .then(response => {
          console.log(response.data.data);
          respondantId = response.data.data.id;
        })
        .catch(error => {
          console.log('An error occurred in respondant:', error.response);
        });

        // Then let's create shifts as responses
      for (let i=0; i<shiftCtx.ranked.length; i++) {
        alert("inside the for loop");
        let requestedShift = await axios
          .post('https://ottrack-backend.herokuapp.com/api/requested-shifts', {
            data: {
              shift: shiftCtx.ranked[i].id,
              ranking: shiftCtx.ranked[i].rank,
              respondant: respondantId
            }
          })
          .then(response => {
            console.log(response.data.data);
          })
          .catch(error => {
            console.log("Error occurred in requested shift: ", error.response);
          });
      }

      };


    return (
      <div>
        {show ? (
          <div>
            <div className="centered">
                <h2>Select Shifts</h2>
            </div>
            <div className="centered">
                <p>Begin by tapping/clicking shifts you are interested in working.</p>
            </div>
            <div className="centered">
                <div>
                {offerings.map((offering, i) => {
                    return (
                    <SelectableShifts 
                    shifts={offering} 
                    key={i} 
                    id={i}
                    >
                    </SelectableShifts> 
                    )
                })
                }
                </div>
            </div>
            <br/>
            <div className="centered">
                {showDecline && <button className="button-wide" onClick={declineAll}>Decline All</button>}
                {!showDecline && <button className="button-wide" onClick={handleSubmit}>Continue</button>}
            </div>
          </div>) : (
            <div>
              <div className="centered">
                <h2>Rank Assignment Prefeference</h2>
              </div>
              <div className="centered">
                <p>Please rank the shifts below from 1 through {shiftCtx.selected.length},<br/>
                with 1 being your first choice,<br/>and {shiftCtx.selected.length} being your
                last choice.</p>
              </div>
              <div className="centered">
                <div>
                {shiftCtx.selected.map((shift) => {
                  return (
                    <ShiftRanker key={shift.id} shift={shift.shift}/>
                  )
                } )}
                </div>
              </div>
              <br/>
              <div className="centered">
                <button className="button-wide" onClick={goBack}>Go Back</button>
              </div>
              <br/>
              <div className="centered">
                <button className="button-wide" disabled={disableSubmit} onClick={submitResponse}>Submit</button>
              </div>
              <h4>{rankingError}</h4>
            </div>
          ) }
        </div>
    );
}

export default SelectShifts;