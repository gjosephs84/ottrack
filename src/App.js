import logo from './logo.svg';
import './App.css';
import React from 'react';
import Shift from './components/shift';

const offering = [];
console.log(offering);

function App() {
  // A state variable to hold all the shifts in the offering
  const [shifts, setShifts] = React.useState(offering);

  // A function to handle the form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newShift = {
      date: document.getElementById("date").value,
      startTime: document.getElementById("start-time").value,
      endTime: document.getElementById("end-time").value,
      startLocation: document.getElementById("start-location").value,
      endLocation: document.getElementById("end-location").value
    };
    let temp = [...shifts];
    temp.push(newShift);
    offering.push(newShift);
    setShifts(temp);
  }

  // A function to remove a submitted shift
  const removeShift = (index) => {
    let temp = [...shifts];
    temp.splice(index, 1);
    setShifts(temp);
  }
  return (
    <div>
      <form className="shift-form">
        <h3>Date:</h3>
        <input type="date" name="date" id="date"></input>
        <h3>Start Time:</h3>
        <input type="time" name="start-time" id="start-time" min="05:30" max="23:15" step="900"></input>
        <h3>End Time:</h3>
        <input type="time" name="end-time" id="end-time"></input>
        <h3>Starting Location:</h3>
        <select name="start-location" id="start-location">
          <option value="Alumni Pool">Alumni Pool</option>
          <option value="Z-Center">Z-Center</option>
        </select>
        <h3>Ending Location:</h3>
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

    </div>
  )
  
}

export default App;
