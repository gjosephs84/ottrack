/*

    ----- SHIFTCREATOR COMPONENT -----

    The purpose of this componenent is to have a single place to both create multiple shifts, as well as to quick-assign call-ins and extensions of shift.

    At the top level, an API call is used to generate an array of lifeguards available to quick-assign call-ins and extensions of shift.

    Also, the variables date, startLocation, endLocation, holiday, shiftType, and guardId exist outside to ShiftCreator function, allowing them to retain their values for the purposes of validation, even when a setState causes the component to re-render.

    The output is a div using the MITCard formatting which includes fields for Date, Start Time, End Time, Starting Location, Ending Location, and conditionally:

        For creating and offering:
            Holiday
        
        For quick assigining:
            Shift Type
            Assign To

    ShiftCreator takes the following props:

        title: The specific card title, which may vary by usage
        createOffering: A boolean, to determine whether to show options specific to creating an offering.
        quickAssign: Another boolean, to determine whether to show options specific to quick assigning.
        shifts: the state-managed array to hold shifts in case createOffering is true.
        setShifts: the setState for shifts.
        offering: the offering array in case createOffering is true.

*/

import React from "react";
import { useQuery, gql } from "@apollo/client";
import axios from "axios";
import TimePicker from "./timePicker";
import MITCard from "./mitCard";

const GET_GUARDS = gql`
query getGuards {
    usersPermissionsUsers(filters: { role: { name: { contains: "Employee" } } }) {
      data {
        id
        attributes {
          username
        }
      }
    }
  }
`

let date = null;
let startLocation = null;
let endLocation = null;
let holiday = null;
let shiftType = null;
let guardId = null;

const ShiftCreator = ({title, createOffering, quickAssign, shifts, setShifts, offering}) => {
  const [startTime, setStartTime]           = React.useState(null);
  const [endTime, setEndTime]               = React.useState(null);
  const [showSuccess, setShowSuccess]       = React.useState(false);
  const [shouldDisable, setShouldDisable]   = React.useState(true);
  const [timeMessage, setTimeMessage]       = React.useState("");
  const guards = [];
  

  // Get the lifeguards in case of QuickAssign
  const {loading, error, data} = useQuery(GET_GUARDS);
    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error</p>;
    
  // Clean up the data that came in
    data.usersPermissionsUsers.data.forEach(guard => {
      const id = guard.id;
      const name = guard.attributes.username
      guards.push({id: id, name: name})
    });
  // Sort by name
    guards.sort((a, b) => (a.name > b.name) ? 1 : -1);
   

  // A function to validate fields and see if the submit button shoudld enable
  const checkEnable = () => {
    console.log("createOffering is: ", createOffering, " and quickAssign is: ", quickAssign);
    // First, make an array of the variables shared by both createOffering and quickAssign
    const varsToCheck = [date, startTime, endTime, startLocation, endLocation];
    // Then if any of them are null, keep the button disabled
    let nullValue = false;
    varsToCheck.forEach(field => {
      if (field == null) {
        setShouldDisable(true);
        nullValue = true;
        console.log("field with a null value is: ", varsToCheck);
        return;
      }
    });
    if (nullValue == true) {
        console.log("Found a null value while validating!");
        return;
    }

    // Next, let's see if the start and end times are appropriate.
    let passedTimeCheck = false;
    if ((endTime - startTime) < 400) {
      setTimeMessage("Overtime shifts, unless they are extensions of shift, must be at least 4 hours long");
      // See if we can reset shift-type to default
      setShouldDisable(true);
      console.log("shift is less than 4 hours");
    } else {
      setTimeMessage("");
      console.log("setting passedTimeCheck to true after determing a shift is longer than four hours")
      passedTimeCheck = true;
    }
    if (shiftType == "extension") {
      if ((endTime - startTime) > 400) {
        setTimeMessage("Extensions of shift must be less than 4 hours. Longer shifts should be offered to everyone as part of an offering, or assigned as call-in at a minimum of 6 hours. Please change the start/end times, or shift type to continue.");
        // See if we can reset shift-type to default
        document.getElementById("shift-type").options[0].selected = true;
        setShouldDisable(true);
        passedTimeCheck = false;
      } else {
        setTimeMessage("");
        console.log("being an extension, setting passedTimeCheck as true");
        passedTimeCheck = true;
      }
    };
    if (shiftType == "call-in") {
      if ((endTime - startTime) < 600) {
        setTimeMessage("Call-in shifts must be at least 6 hours long. Please change the start/end times, or shift type to continue.");
        document.getElementById("shift-type").options[0].selected = true;
        setShouldDisable(true);
        passedTimeCheck = false;
        } else {
        setTimeMessage("");
        console.log("being a call in, setting passed time check as true");
        passedTimeCheck= true;
        }
    };

    console.log("got through all the time checks, and passedTimeCheck is: ", passedTimeCheck);
    // Now, specific to createOffering
    if (createOffering == true) {
        if (holiday == null) {
            setShouldDisable(true);
            return;
        }
    };
    // Finally, specific to quickAssign
    if (quickAssign == true) {
        console.log("inside the quickAssign if")
        if ((shiftType == null) || (guardId == null)) {
            console.log("showing one of our values as null");
            setShouldDisable(true);
            return;
        }
    };
    console.log("before the final if statement, passedTimeCheck is: ", passedTimeCheck);
    // If the time check is true, enable the button, otherwise, keep disabled
    if (passedTimeCheck == true) {
        setShouldDisable(false);
    }
  };

  // A function to handle changes in the form

  const handleChange = (e, theField, value) => {
    e.preventDefault();
    switch (theField) {
        case 'date' : 
          date = value;
          break;
        case 'startLocation' :
          startLocation = value;
          break;
        case 'endLocation' :
          endLocation = value;
          break;
        case 'holiday' :
          holiday = value;
          break;
        case 'shiftType' :
          shiftType = value;
          break;
        case 'guardId' :
          guardId = value;
          break;
        default:
          console.log("Switch didn't do anything");
    };
    checkEnable();
  }

  // A function to create the shift in create offering
  const createShift = () => {
    const newShift = {
        date: date,
        startTime: startTime,
        endTime: endTime,
        startLocation: startLocation,
        endLocation: endLocation,
        holiday: holiday
    };

    let temp = [...shifts];
    temp.push(newShift);
    offering.push(newShift);
    setShifts(temp);
  }

  // A function to assign the shift in quick assign
  const assignShift = async () => {
    console.log('here is what is coming in: ', date, startLocation, endLocation, guardId);
    let offeringId;

    // Create an offering
    let theOffering = await axios
      .post('https://ottrack-backend.herokuapp.com/api/offerings', {
        data: {
          shifts: [],
          active: false
        }
      })
      .then(response => {
        offeringId = response.data.data.id;
      })
      .catch(error => {
        console.log('An error occurred:', error.response);
      });

    let theShift = await axios
     .post('https://ottrack-backend.herokuapp.com/api/shifts', {
        data: {
          date: date,
          startTime: startTime,
          endTime: endTime,
          startLocation: startLocation,
          endLocation: endLocation,
          holiday: false,
          offering: offeringId,
          assigned_to: guardId
        }
     })
     .then (response => {
        console.log("response to quick assign is: ", response)
     })
     .catch(error => {
        console.log("an error occurred in quick assign: ", error)
     });

     // Set Show success to true so the confirmation appears
     setShowSuccess(true);
  }

    return (
      <div>
      {showSuccess ? 
      <div>
        <h2 style={{margin:"auto", textAlign:"center"}}>Success!</h2>
        <h4 style={{margin:"auto", textAlign:"center"}}>Your quick assign shift was successfully created.
        </h4>
        <br/>
        <button 
          className="button-wide centered"
          style={{margin:"auto"}}
          onClick={() => {setShowSuccess(false)}}
        >Quick Assign Another Shift</button>
      </div> :
      <div>
        <MITCard
          cardTitle={title}  
          cardBody={
            <div>
              <h4>Date:</h4>
              <input 
                type="date" 
                onChange={(e) => {handleChange(e, "date", e.target.value)}}/>
              <h4>Start Time:</h4>
              <TimePicker 
                parentState={startTime} 
                setParentState={setStartTime} 
                name={"startTime"}
                />
              <h4>End Time:</h4>
              <TimePicker 
                parentState={endTime} 
                setParentState={setEndTime} 
                name={"endTime"}
                />
              <h4>Starting Location:</h4>
              <select 
                name="start-location"
                onChange={(e) => {handleChange(e, "startLocation", e.target.value)}}>
                <option value={null}>—</option>
                <option value="Alumni Pool">Alumni Pool</option>
                <option value="Z-Center">Z-Center</option>
              </select>
              <h4>Ending Location:</h4>
              <select 
                name="end-location"
                onChange={(e) => {handleChange(e, "endLocation", e.target.value)}}>
                <option value={null}>—</option>
                <option value="Alumni Pool">Alumni Pool</option>
                <option value="Z-Center">Z-Center</option>
              </select>
              <h5>{timeMessage}</h5>
              {/* THE FOLLOWING IS CONDITIONAL FOR CREATING MULTIPLE SHIFTS */}
              {createOffering &&
              <div>
                <h4>Holiday/Special Closing:</h4> 
                <select
                  name="special-holiday"
                  id="holiday"
                  onChange={(e) => {handleChange(e, "holiday", e.target.value)}}>
                    <option value={null}>—</option>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </select>
                <br/>
                <br/>
                <button
                  className="button-full"
                  disabled={shouldDisable}
                  onClick={createShift}>
                  Create Shift
                </button>
              </div>
              }
              {/* THE FOLLOWING IS CONDITIONAL FOR QUICK ASSIGNING */}
              {quickAssign &&
              <div>
                <h4>Shift Type:</h4> 
                <select
                  name="shift-type"
                  id="shift-type"
                  onChange={(e) => {handleChange(e, "shiftType", e.target.value)}}>
                    <option value={null}>—</option>
                    <option value="extension">Extension</option>
                    <option value="call-in">Call In</option>
                </select>
                <h4>Assign To:</h4>
                <select 
                  name="assign-to"
                  onChange={(e) => {handleChange(e, "guardId", e.target.value)}}>
                    <option value="">—</option>
                    {guards.map((guard) => {
                      return (
                        <option
                          key={guard.id}
                          value={guard.id}>
                            {guard.name}
                          </option>
                        )
                    })}
                </select>
                <br/>
                <br/>
                <button
                  className="button-full"
                  disabled={shouldDisable}
                  onClick={assignShift}>
                  Assign Shift
                </button>
              </div>
              }
            </div>
          }
        />
      </div>}
      </div>
    )

}

export default ShiftCreator;