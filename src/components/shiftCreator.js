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

const ShiftCreator = ({title, createOffering, quickAssign, shifts, setShifts, offering}) => {
  const [date, setDate]                     = React.useState(null);
  const [startTime, setStartTime]           = React.useState(null);
  const [endTime, setEndTime]               = React.useState(null);
  const [startLocation, setStartLocation]   = React.useState(null);
  const [endLocation, setEndLocation]       = React.useState(null);
  const [holiday, setHoliday]               = React.useState(null);
  const [shiftType, setShiftType]           = React.useState(null);
  const [guardId, setGuardId]               = React.useState(null);
  const [showSuccess, setShowSuccess]       = React.useState(false);
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
   

  // A function to handle changes in the form
  const handleChange = (e, setUpdate, value) => {
    e.preventDefault();
    setUpdate(value);
    console.log('value is: ', value);
  };

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
                onChange={(e) => {handleChange(e, setDate, e.target.value)}}/>
              <h4>Start Time:</h4>
              <TimePicker 
                parentState={startTime} 
                setParentState={setStartTime} 
                name={"startTime"}/>
              <h4>End Time:</h4>
              <TimePicker 
                parentState={endTime} 
                setParentState={setEndTime} 
                name={"endTime"}/>
              <h4>Starting Location:</h4>
              <select 
                name="start-location"
                onChange={(e) => {handleChange(e, setStartLocation, e.target.value)}}>
                <option value="Alumni Pool">Alumni Pool</option>
                <option value="Z-Center">Z-Center</option>
              </select>
              <h4>Ending Location:</h4>
              <select 
                name="end-location"
                onChange={(e) => {handleChange(e, setEndLocation, e.target.value)}}>
                <option value="Alumni Pool">Alumni Pool</option>
                <option value="Z-Center">Z-Center</option>
              </select>
              {/* THE FOLLOWING IS CONDITIONAL FOR CREATING MULTIPLE SHIFTS */}
              {createOffering &&
              <div>
                <h4>Holiday/Special Closing:</h4> 
                <select
                  name="special-holiday"
                  onChange={(e) => {handleChange(e, setHoliday, e.target.value)}}>
                    <option value="">—</option>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </select>
                <br/>
                <br/>
                <button
                  className="button-full"
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
                  onChange={(e) => {handleChange(e, setShiftType, e.target.value)}}>
                    <option value="">—</option>
                    <option value="extension">Extension</option>
                    <option value="call-in">Call In</option>
                </select>
                <h4>Assign To:</h4>
                <select 
                  name="assign-to"
                  onChange={(e) => {handleChange(e, setGuardId, e.target.value)}}>
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