import React from "react";
import { UserContext } from "../context/context";
import { ShiftContext } from "../context/shift-context";
import convertTime from "./timeConverter";

const Day = ({dayOfWeek}) => {
    const ctx       = React.useContext(UserContext);
    const shiftCtx  = React.useContext(ShiftContext);

    let existingSchedule;
    if (ctx.currentUser !== null) {
        existingSchedule=ctx.currentUser.weeklySchedule;
        shiftCtx.schedule = ctx.currentUser.weeklySchedule;
    } else {
        existingSchedule = shiftCtx.schedule
    };

    console.log('existingSchedule is: ', existingSchedule);
    
    let existingStart;
    let existingEnd;

    switch (dayOfWeek) {
        case "Monday" :
            existingStart = convertTime(existingSchedule.monday.start);
            existingEnd = convertTime(existingSchedule.monday.end);
            break;
        case "Tuesday" :
            existingStart = convertTime(existingSchedule.tuesday.start);
            existingEnd = convertTime(existingSchedule.tuesday.end);
            break;
        case "Wednesday" :
            existingStart = convertTime(existingSchedule.wednesday.start);
            existingEnd = convertTime(existingSchedule.wednesday.end);
            break;
        case "Thursday" :
            existingStart = convertTime(existingSchedule.thursday.start);
            existingEnd = convertTime(existingSchedule.thursday.end);
            break;
        case "Friday" :
            existingStart = convertTime(existingSchedule.friday.start);
            existingEnd = convertTime(existingSchedule.friday.end);
            break;
        case "Saturday" :
            existingStart = convertTime(existingSchedule.saturday.start);
            existingEnd = convertTime(existingSchedule.saturday.end);
            break;
        case "Sunday" :
            existingStart = convertTime(existingSchedule.sunday.start);
            existingEnd = convertTime(existingSchedule.sunday.end);
            break;
        default :
            existingStart = "No Schedule Set";
            existingEnd = "";
    };

    if (existingStart == "off") {existingEnd = ""};

    const [show, setShow]   = React.useState(false);
    const [start, setStart] = React.useState(existingStart);
    const [end, setEnd]     = React.useState(existingEnd);
    const handleClick = () => setShow(!show);

    const DailySchedulePicker = ({dayOfWeek}) => {
        const [startHour, setStartHour]     = React.useState(0);
        const [startMin, setStartMin]       = React.useState(0);
        const [startAmPm, setStartAmPm]     = React.useState('AM');
        const [endHour, setEndHour]         = React.useState(0);
        const [endMin, setEndMin]           = React.useState(0);
        const [endAmPm, setEndAmPm]         = React.useState('AM');
        const [message, setMessage]         = React.useState(null);
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
    
        const handleChange = (e, value, setState) => {
            e.preventDefault();
            setMessage(null);
            if (value == '—') {
                setState(0);
            } else {
                setState(value);
            }
        };
    
        // A function to update the schedule in the ShiftContext
        const updateSchedule = (day, start, end) => {
            switch (day) {
                case 'Monday' : shiftCtx.schedule.monday = {
                    start: start,
                    end: end
                    };
                    break;
                case 'Tuesday' : shiftCtx.schedule.tuesday = {
                    start: start,
                    end: end
                    };
                    break;
                case 'Wednesday' : shiftCtx.schedule.wednesday = {
                    start: start,
                    end: end
                    };
                    break;
                case 'Thursday' : shiftCtx.schedule.thursday = {
                    start: start,
                    end: end
                    };
                    break;
                case 'Friday' : shiftCtx.schedule.friday = {
                    start: start,
                    end: end
                    };
                    break;
                case 'Saturday' : shiftCtx.schedule.saturday = {
                    start: start,
                    end: end
                    };
                    break;
                case 'Sunday' : shiftCtx.schedule.sunday = {
                    start: start,
                    end: end
                    };
                    break;
                default:
                    console.log('There was an error');
            };
            console.log('shiftCtx.schedule is: ', shiftCtx.schedule);
            ctx.currentUser.weeklySchedule = shiftCtx.schedule;
        };

        const validateSchedule = () => {
            let startTime = (startHour * 100);
            if (startAmPm == "PM") {
                if (startHour != 12) {
                    startTime += 1200
                }
            };
            startTime += Number(startMin);
            console.log('Start Time is: ', startTime);
            let endTime = (endHour * 100);
            if (endAmPm == "PM") {
                if (endHour != 12) {
                    endTime += 1200
                }
            };
            endTime += Number(endMin);
            console.log('End Time is: ', endTime);
            let duration = endTime - startTime;
            if (duration == 0) {
                setMessage(`${dayOfWeek} has been marked as a day off`);
                setStart('Off');
                setEnd('');
                updateSchedule(dayOfWeek, startTime, endTime);
                setShow(false);
                return;
            }
            if (duration != 800) {
                setMessage("Shifts must be exactly 8 hours");
                return;
            };
            setMessage('Success!');
            setStart(`${startHour}:${startMin} ${startAmPm} - `);
            setEnd(`${endHour}:${endMin} ${endAmPm}`);
            updateSchedule(dayOfWeek, startTime, endTime);
            setShow(false);    
        }
    
        return (
            <div>
                <div>Start Time:
                    <div>
                        <select onChange={(e) => {handleChange(e, e.target.value, setStartHour)}}>
                            {hours.map((hour) => {
                                return (
                                    <option key={hour.value} value={hour.value}>{hour.text}</option>
                                )
                            })}
                        </select>
                        <select onChange={(e) => {handleChange(e, e.target.value, setStartMin)}}>
                            {mins.map((min) => {
                                return (
                                    <option key={min.value} value={min.value}>{min.text}</option>
                                )
                            })}
                        </select>
                        <select onChange={(e) => {handleChange(e, e.target.value, setStartAmPm)}}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>
                </div>
                <div>End Time:
                    <div>
                        <select onChange={(e) => {handleChange(e, e.target.value, setEndHour)}}>
                            {hours.map((hour) => {
                                return (
                                    <option key={hour.value} value={hour.value}>{hour.text}</option>
                                )
                            })}
                        </select>
                        <select onChange={(e) => {handleChange(e, e.target.value, setEndMin)}}>
                            {mins.map((min) => {
                                return (
                                    <option key={min.value} value={min.value}>{min.text}</option>
                                )
                            })}
                        </select>
                        <select onChange={(e) => {handleChange(e, e.target.value, setEndAmPm)}}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>
                </div>
                <br/>
                <button className="button-full" onClick={validateSchedule}>Confirm</button><br/>
                <div>{message}</div>
                <hr/>
            </div>
        );
    };

    return (
        <div>
            {show && <hr/>}
            <div onClick={handleClick} className="daily-schedule">
                <div>
                    <h5>{dayOfWeek}</h5>
                </div>
                <div className="align-right">{start} {end}</div>
                </div>
            {show && <div>
                <DailySchedulePicker dayOfWeek={dayOfWeek} />
            </div>}
        </div>
    )
}

export default Day;