import React from "react";
import axios from 'axios';
import ShiftTable from "../components/shift-table";
import MITCard from "../components/mitCard";

const offering = [];




const CreateOffering = () => {

// A state variable to hold all the shifts in the offering
  const [shifts, setShifts] = React.useState(offering);

  // A function to handle the form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const sHour = document.getElementById("start-hour").value;
    const sMinute = document.getElementById("start-minute").value;
    const sAmPm = document.getElementById("start-am-pm").value;

    const eHour = document.getElementById("end-hour").value;
    const eMinute = document.getElementById("end-minute").value;
    const eAmPm = document.getElementById("end-am-pm").value;

    const sTime = `${sHour}:${sMinute} ${sAmPm}`;
    const eTime = `${eHour}:${eMinute} ${eAmPm}`;
    const newShift = {
      date: document.getElementById("date").value,
      startTime: sTime,
      endTime: eTime,
      startLocation: document.getElementById("start-location").value,
      endLocation: document.getElementById("end-location").value
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
  }

  // A function to submit the offering
  const submitOffering = async() => {
    let offeringId;
  
    // First, let's create an offering
    let theOffering = await axios
      .post('http://localhost:1337/api/offerings', {
        data: {
          shifts: []
        }
      })
      .then(response => {
        offeringId = response.data.data.id;
      })
      .catch(error => {
        console.log('An error occurred:', error.response);
      });
      
  
      // Now, let's create shifts and attach them to the offering using the offering ID just created
      for (let i=0; i<offering.length; i++) {
        let theShift = await axios
          .post('http://localhost:1337/api/shifts', {
            data: {
              date: offering[i].date,
              startTime: offering[i].startTime,
              endTime: offering[i].endTime,
              startLocation: offering[i].startLocation,
              endLocation: offering[i].endLocation,
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
      <h2 className="centered">Create a New Overtime Offering</h2>
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
        <div className="time-selector">
          <select name="start-hour" id="start-hour">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
          <select name="start-minute" id="start-minute">
            <option value="00">00</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
          </select>
          <select name="start-am-pm" id="start-am-pm">
            <option value="AM">AM</option>
            <option value="PM">PM</option>
        </select>
        </div>
        <h4>End Time:</h4>
        <div className="time-selector">
          <select name="end-hour" id="end-hour">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
          <select name="end-minute" id="end-minute">
            <option value="00">00</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
          </select>
          <select name="end-am-pm" id="end-am-pm">
            <option value="AM">AM</option>
            <option value="PM">PM</option>
        </select>
        </div>
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
        <br/><br/>
        <button className="button-full" onClick={handleSubmit}>Submit</button>
        </div>
            }
          />


        </div>
        <div>
          <ShiftTable shifts={shifts} removeShift={removeShift}/><br/>
          <button onClick={submitOffering}>Publish Offering</button>
        </div>
        </div>
      </div>

      {/* 
      <form className="shift-form">
        <h4>Date:</h4>
        <input type="date" name="date" id="date"></input>
        <h4>Start Time:</h4>
        <input type="time" name="start-time" id="start-time" min="05:30" max="23:15" step="900"></input>
        <h4>End Time:</h4>
        <input type="time" name="end-time" id="end-time"></input>
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
        <button onClick={handleSubmit}>Submit</button>
        </form>
        {shifts.length > 0 &&
          shifts.map((shift, i) => {
            return (
              <Shift key={i} id={i} shift={shift} index={i} remove={removeShift}></Shift>
            )
          })
        }
        */}
    </div>
  )
}

export default CreateOffering;