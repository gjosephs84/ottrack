import React              from "react";
import axios              from 'axios';
import SelectableShifts   from "../components/selectableShifts";
import ShiftRanker        from "../components/shiftRanker";
import ConfirmBox         from "../components/confirmBox";
import PartialAvailability from "../components/partial-availability";
import ShiftTable from "../components/shift-table";
import { useQuery, gql }  from "@apollo/client";
import { ShiftContext }   from "../context/shift-context";
import { UserContext }    from "../context/context";

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
              attributes {
                respondants {
                  data {
                    attributes {
                      name
                    }
                  }
                }
              }
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
    const shiftCtx         = React.useContext(ShiftContext);
    const ctx              = React.useContext(UserContext);

    // Initialize all the state variables
    const [show, setShow]                           = React.useState(true);
    const [showSuccess, setShowSuccess]             = React.useState(false);
    const [showDecline, setShowDecline]             = React.useState(true);
    const [showPartial, setShowPartial]             = React.useState(false);
    const [disableSubmit, setDisableSubmit]         = React.useState(true);
    const [rankingError, setRankingError]           = React.useState(null);
    const [confirmDeclineAll, setConfirmDeclineAll] = React.useState(false);
    
    // Inject the state variables into the shift context
    shiftCtx.declineState = [showDecline, setShowDecline];
    shiftCtx.disabledState = [disableSubmit, setDisableSubmit];
    shiftCtx.errorState = [rankingError, setRankingError];

    // A function to handle submit of initial preferences
    const handleSubmit = () => {
      window.scrollTo(0,0);
      setShow(false);
      if (shiftCtx.selected.length === 0) {
        setDisableSubmit(false);
      }
    };

    // A function to go back to selecting preferences
    const goBack = () => {
      window.scrollTo(0,0);
      shiftCtx.selected = [];
      shiftCtx.ranked = [];
      shiftCtx.partial = [];
      setShow(true);
      setShowPartial(false);
      setDisableSubmit(true);
      setShowDecline(true);
      setRankingError("");
    }

    // Start by getting the active offering
    const { loading, error, data } = useQuery(GET_ACTIVE_OFFERINGS, {
      fetchPolicy: 'network-only'
    });
    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error</p>

    
    // If there isn't currently and offering, gracefully
    // handle that and give a nice, gentle message
    if (data.offerings.data.length ==0) {
      return (
      <div>
        <div className="centered">
            <h2>Select Shifts</h2>
          </div>
          <div className="centered">
            <p className="box-350">
              It looks like there aren't any shifts available right now. You will be notified when new shifts become available.
            </p>
          </div>
      </div>
      )
    }
    // Now that that data has been retrieved, first thing needs to be to create a list
    // of who already responded so we can check to see if the current guard has
    // responded or not.
    const alreadyResponded = [];

                      //This is going to need to be fixed in case of multiple
                      //offerings at the same time, but it works for now


    data.offerings.data[0].attributes.offering_response.data.attributes.respondants.data.forEach(guard => {
      alreadyResponded.push(guard.attributes.name);
    });
    
    if (alreadyResponded.includes(ctx.currentUser.username)) {
      return (
        <div>
          <div className="centered">
            <h2>Select Shifts</h2>
          </div>
          <div className="centered">
            <p className="box-350">
              It looks like you've already sent in your preferences for currently-available shifts. You will be notified once shifts are assigned, as well as when new shifts become available.
            </p>
          </div>
        </div>
      )
    }


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
      shiftCtx.ranked = [];
      submitResponse();
      setConfirmDeclineAll(false);
    };
    
    // Here we submit the responses
    const submitResponse = async() => {
      window.scrollTo(0,0);
      let respondantId;

      // First let's create a respondant
      let theRespondant = await axios
        .post('https://ottrack-backend.herokuapp.com/api/respondants', {
          data: {
            offering_response: responseIds[0],
            users_permissions_user: ctx.currentUser.id,
            name: ctx.currentUser.username,
            partials: shiftCtx.partial
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
      };
      // Finally, let's show a success message
      setShowSuccess(true);

      };


    return (
      <div>

        {/*

        This first section will display when either the 
        user has successfully submitted their preferences
        or has done so previously, so there are no shifts
        to select from.

        */}

        {showSuccess ? (
          <div>
            <div className="centered">
              <h2>Success!</h2>
            </div>
            <div className="centered">
              <p className="box-350">
                Nice job! Your preferences have been successfully recorded. You will be contacted once shifts have been assigned, as well as when new shifts become available.
              </p>
            </div>
          </div>
        ) : (
          <div>
        
        {/* 

        This next section displays when there are shifts
        to be selected, but before any ranking occurs

        */}

          {show ? (
            <div>
              <div className="centered">
                  <h2>Select Shifts</h2>
              </div>
              <div className="centered">
                  <p className="box-350">Begin by tapping/clicking shifts you are interested in working.</p>
              </div>
              <div className="centered">
                  <div>
                  {offerings.map((offering, i) => {
                      return (
                      <SelectableShifts 
                      shifts={offering} 
                      key={i} 
                      id={i}
                      />
                      )
                  })
                  }
                  </div>
              </div>
              <br/>
              {confirmDeclineAll && 
              <ConfirmBox 
                header="Decline All Shifts"
                message="Are you sure you want to decline all available shifts?"
                handleYes={declineAll}
                buttonYes="Yes"
                setConfirm={setConfirmDeclineAll}
                buttonNo="No"
              />
              }
              <div className="centered">
                <h4>Add Partial Availability?</h4>
              </div>
              <div className="centered">
                <select onChange={(e) => {
                  if (e.target.value == "false") {
                    setShowPartial(false);
                  };
                  if (e.target.value == "true") {
                    setShowPartial(true);
                  }
                }}>
                  <option value={"false"}>No</option>
                  <option value={"true"}>Yes</option>
                </select>
              </div>
              <br/>
              {showPartial && <div>
                <div className="centered">
                <p className="box-350">Available to work just part of a shift listed above? Select the shift number and the hours you are available to work.</p>
              </div>
              <div className="centered">
                <PartialAvailability offering={offerings[0]}/>
              </div>
              </div>}
              <div className="centered">
                  {showDecline && <button className="button-wide button-tall" onClick={() => {setConfirmDeclineAll(true)}}>Decline All</button>}
                  {!showDecline && <button className="button-wide button-tall" onClick={handleSubmit}>Continue</button>}
              </div>
              <br/>
            <br/>
            <div> </div>
            </div>) : (
              <div>

        {/* 

        This section shows the ranking portion
        
        */}

                <div className="centered">
                  <h2>Rank Assignment Preference</h2>
                </div>
                <div className="centered">
                  {shiftCtx.selected.length > 0 && <p style={{textAlign:"center"}}>Please rank the shifts below from 1 through {shiftCtx.selected.length},<br/>
                  with 1 being your first choice,<br/>and {shiftCtx.selected.length} being your
                  last choice.</p>}
                  {shiftCtx.selected.length === 0 && <p style={{textAlign:"center"}}>Nothing here to rank! Submit or go back.</p>}
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
                {shiftCtx.partial.length > 0 && <div>
                  <ShiftTable
                    title={"My Partial Availability"}
                    shifts={shiftCtx.partial}
                    minWidth="350px"
                  />
                  <h5 className="box-350" style={{textAlign:"center"}}>NOTE: You will be assigned partial shifts in accordance with your preferences at a managers discretion, and only if the shift cannot be assigned in its entirety to another lifeguard.</h5>
                  <br/>
                  </div>}
                <div className="centered">
                  <button className="button-wide button-tall" onClick={goBack}>Go Back</button>
                </div>
                <br/>
                <div className="centered">
                  <button className="button-wide button-tall" disabled={disableSubmit} onClick={submitResponse}>Submit</button>
                </div>
                <div className="centered">
                  <div className="box-350">
                    <h4 style={{textAlign:"center"}}>{rankingError}</h4>
                  </div>
                </div>
                <br/>
              </div>
            ) }
            </div>
        )}
        </div>
    );
}

export default SelectShifts;