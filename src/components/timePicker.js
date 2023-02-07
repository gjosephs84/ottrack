import React from "react";

const TimePicker = ({parentState, setParentState, name}) => {
    // State variables to hold changes to the select elements
    const [hour, setHour]       = React.useState(0);
    const [minute, setMinute]   = React.useState(0);
    const [amPm, setAmPm]       = React.useState("AM");

    // The options to populate the select elements
    const hours = [
        {value: '—', text: '—'},
        {value: 1, text: '01'},
        {value: 2, text: '02'},
        {value: 3, text: '03'},
        {value: 4, text: '04'},
        {value: 5, text: '05'},
        {value: 6, text: '06'},
        {value: 7, text: '07'},
        {value: 8, text: '08'},
        {value: 9, text: '09'},
        {value: 10, text: '10'},
        {value: 11, text: '11'},
        {value: 12, text: '12'},
    ];
    const mins = [
        {value: '—', text: '—'},
        {value: 0, text: '00'},
        {value: 15, text: '15'},
        {value: 30, text: '30'},
        {value: 45, text: '45'},
    ];

    const convertToTwentyFour = () => {
        let hours = document.getElementById(`${name}-hours`).value;
        let minutes = document.getElementById(`${name}-minutes`).value;
        let amOrPm = document.getElementById(`${name}-ampm`).value;
        let time = hours * 100;
        time += Number(minutes);
        if (amOrPm == "PM" && hours !== 12) {
            time += 1200;
        }
        return time;
    };

    const handleChange = (e, value, setState) => {
        e.preventDefault();
        if (value == '—') {
            setState(0);
        } else {
            setState(value);
        };
        // Now, convert all the data we're getting to 24 hour time:

        let time = convertToTwentyFour();
        setParentState(time);
    };

    return (
        <div>
            <select onChange={(e) => {handleChange(e, e.target.value, setHour)}} id={`${name}-hours`}>
                {hours.map((hour) => {
                    return (
                        <option key={hour.value} value={hour.value}>{hour.text}</option>
                    )
                })}
            </select>
            <select onChange={(e) => {handleChange(e, e.target.value, setMinute)}} id={`${name}-minutes`}>
                {mins.map((min) => {
                    return (
                        <option key={min.value} value={min.value}>{min.text}</option>
                    )
                })}
            </select>
            <select onChange={(e) => {handleChange(e, e.target.value, setAmPm)}} id={`${name}-ampm`}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        </div>
    )
}

export default TimePicker;