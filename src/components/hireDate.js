import React from "react";

const HireDate = ({seniority, setSeniority}) => {
    const [year, setYear]   = React.useState(2000);
    const [month, setMonth]  = React.useState(1);
    const [day, setDay]     = React.useState(1);

    const yearOptions = [];
    const monthOptions = [
        {
            value: "01",
            text: "Jan"
        },
        {
            value: "02",
            text: "Feb"
        },
        {
            value: "03",
            text: "Mar"
        },
        {
            value: "04",
            text: "Apr"
        },
        {
            value: "05",
            text: "May"
        },
        {
            value: "06",
            text: "Jun"
        },
        {
            value: "07",
            text: "Jul"
        },
        {
            value: "08",
            text: "Aug"
        },
        {
            value: "09",
            text: "Sep"
        },
        {
            value: "10",
            text: "Oct"
        },
        {
            value: "11",
            text: "Nov"
        },
        {
            value: "12",
            text: "Dec"
        }
    ];
    const dayOptions =[];

    for (let i=0; i<41; i++) {
        yearOptions.push({
            value: 2000 + i,
            text: 2000 + i
            });
    };

    for (let i=0; i<31; i++) {
        dayOptions.push({
            value: i + 1,
            text: i + 1
            });
    } 

    const handleChange = (e, value, setState, kind) => {
        e.preventDefault();
        setState(value);
        let theYear = year.toString();
        let theMonth = month;
        let theDay = day;
        switch (kind) {
            case "year" :
                theYear = value.toString();
                break;
            case "month" :
                theMonth = value;
                break;
            case "day" :
                theDay = value;
                break;
        }
        let dayString;
        if (theDay < 10) {
            dayString = "0" + theDay.toString();
            console.log("dayString is: ", dayString);
        } else {
            dayString = theDay.toString();
        };
        let hireString = theYear + theMonth + dayString;
        console.log(hireString);
        setSeniority(Number(hireString));
        console.log(seniority);
    }

    return (
        <div className="hire-date">
            <h5>Year</h5>
            <h5>Month</h5>
            <h5>Day</h5>
            <select onChange={(e) => {handleChange(e, e.target.value, setYear, "year")}}>
                {yearOptions.map((year) => {
                    return (
                        <option 
                        key={year.value} 
                        value={year.value}>
                            {year.text}
                        </option>
                    )
                })}
            </select>
            <select onChange={(e) => {handleChange(e, e.target.value, setMonth, "month")}}>
                {monthOptions.map((month) => {
                    return (
                        <option 
                        key={month.value} 
                        value={month.value}>
                            {month.text}
                        </option>
                    )
                })}
            </select>
            <select onChange={(e) => {handleChange(e, e.target.value, setDay, "day")}}>
                {dayOptions.map((day) => {
                    return (
                        <option 
                        key={day.value} 
                        value={day.value}>
                            {day.text}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

export default HireDate;