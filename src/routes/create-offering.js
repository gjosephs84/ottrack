import React from "react";
import axios from 'axios';
import ShiftTable from "../components/shift-table";
import MITCard from "../components/mitCard";
import TimePicker from "../components/timePicker";
import ConfirmBox from "../components/confirmBox";

const offering = [];
const CreateOffering = () => {

// A state variable to hold all the shifts in the offering
  const [shifts, setShifts] = React.useState(offering);
  const [startTime, setStartTime] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const [showConfirm, setShowConfirm] = React.useState(false);

  // A function to handle the form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newShift = {
      date: document.getElementById("date").value,
      startTime: startTime,
      endTime: endTime,
      startLocation: document.getElementById("start-location").value,
      endLocation: document.getElementById("end-location").value,
      holiday: document.getElementById("special-closing").value
    };
    let temp = [...shifts];
    temp.push(newShift);
    offering.push(newShift);
    setShifts(temp);
    console.log(offering);
  }

  // A function to remove a submitted shift
  const removeShift = (index) => {
    let temp = [...shifts];
    temp.splice(index, 1);
    setShifts(temp);
    offering.splice(index, 1);
  }

  // A function to submit the offering
  const submitOffering = async() => {
    let offeringId;
  
    // First, let's create an offering
    let theOffering = await axios
      .post('https://ottrack-backend.herokuapp.com/api/offerings', {
        data: {
          shifts: [],
          active: true
        }
      })
      .then(response => {
        offeringId = response.data.data.id;
      })
      .catch(error => {
        console.log('An error occurred:', error.response);
      });
      
      // Next, create an offering_response to hold respondants and their preferences

      let theOfferingResponse = await axios
        .post('https://ottrack-backend.herokuapp.com/api/offering-responses', {
          data: {
            offering: offeringId
          }
        })
        .then(response => {
          console.log("Created Offering Response:");
          console.log(response);
        })
        .catch(error => {
          console.log('An error occurred:', error.response);
        })
  
      // Now, let's create shifts and attach them to the offering using the offering ID just created
      for (let i=0; i<offering.length; i++) {
        let theShift = await axios
          .post('https://ottrack-backend.herokuapp.com/api/shifts', {
            data: {
              date: offering[i].date,
              startTime: offering[i].startTime,
              endTime: offering[i].endTime,
              startLocation: offering[i].startLocation,
              endLocation: offering[i].endLocation,
              holiday: offering[i].holiday,
              offering: offeringId
            }
          })
          .then(response => {
            console.log(response.data.data);
          })
          .catch(error => {
            console.log('An error occurred in shift:', error.response);
          });
      }
  }

 

  return (
    <div>
      {showConfirm && 
      <ConfirmBox 
        header="Publish Offering"
        message="Are you sure you are ready to publish this overtime offering?"
        handleYes={submitOffering}
        buttonYes="Yes"
        setConfirm={setShowConfirm}
        buttonNo="No"
      />}
    <div>
      <h2 className="centered">Create a New Overtime Offering</h2>
      <br/>
      <div className="centered">
      <div className="offering-card">
        <div>
          <MITCard 
            cardTitle={"Create a Shift"}
            cardBody={
              <div>
              <h4>Date:</h4>
        <input type="date" name="date" id="date"></input>
        <h4>Start Time:</h4>
        <TimePicker parentState={startTime} setParentState={setStartTime} name={"startTime"}/>
        <h4>End Time:</h4>
        <TimePicker parentState={endTime} setParentState={setEndTime} name={"endTime"}/>
        <h4>Starting Location:</h4>
        <select name="start-location" id="start-location">
          <option value="Alumni Pool">Alumni Pool</option>
          <option value="Z-Center">Z-Center</option>
        </select>
        <h4>Ending Location:</h4>
        <select name="end-location" id="end-location">
          <option value="Alumni Pool">Alumni Pool</option>
          <option value="Z-Center">Z-Center</option>
        </select>
        <h4>Holiday:</h4>
        <select id="special-closing">
          <option value="">—</option>
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
        <br/><br/>
        <button className="button-full" onClick={handleSubmit}>Submit</button>
        </div>
            }
          />


        </div>
        <div>
          <ShiftTable 
            shifts={shifts} 
            removeShift={removeShift} 
            createMode={true} 
            setConfirmState={setShowConfirm}/><br/>
        </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default CreateOffering;