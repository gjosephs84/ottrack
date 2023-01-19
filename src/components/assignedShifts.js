import React, { useContext } from "react";
import { UserContext } from "../context/context";
import { gql, useQuery } from "@apollo/client";
import ShiftTable from "./shift-table";

const GET_SHIFTS = gql`
query getShifts($id: ID) {
    usersPermissionsUsers(filters: {id: {eq: $id}})  {
      data{
        id
        attributes {
          username
          shifts {
            data {
              id
              attributes {
                startTime
                startLocation
                endTime
                endLocation
                date
              }
            }
          }
        }
      }
    }
  }
  `;

  const AssignedShifts = () => {
    const ctx = useContext(UserContext);
    const { loading, error, data } = useQuery(GET_SHIFTS, {
        variables: {"id": ctx.currentUser.id}
    });

    if (loading) return <p>Loading Shifts ...</p>
    if (error) return <p>Error</p>
    const rawShifts = data.usersPermissionsUsers.data[0].attributes.shifts.data;
    console.log("Raw shifts is: ", rawShifts);
    const pastShifts = [];
    const upcomingShifts = [];
    const todaysRawDate = new Date().toString();
    console.log("today's raw date is: ", todaysRawDate);
    let cleanDate;
    const dateArray = todaysRawDate.split(' ');
    console.log("dateArray is: ", dateArray);
    let numMonth;
    switch (dateArray[1]) {
        case 'Jan' :
            numMonth = '01';
            break;
        case 'Feb' :
            numMonth = '02';
            break;
        case 'Mar' :
            numMonth = '03';
            break;
        case 'Apr' :
            numMonth = '04';
            break;
        case 'May' :
            numMonth = '05';
            break;
        case 'Jun' :
            numMonth = '06';
            break;
        case 'Jul' :
            numMonth = '07';
            break;
        case 'Aug' :
            numMonth = '08';
            break;
        case 'Sep' :
            numMonth = '09';
            break;
        case 'Oct' :
            numMonth = '10';
            break;
        case 'Nov' :
            numMonth = '11';
            break;
        case 'Dec' :
            numMonth = '12';
            break;
        default : 
            numMonth = "00";
            break;
    };

    console.log('numMonth is: ', numMonth);
    cleanDate = `${dateArray[3]}-${numMonth}-${dateArray[2]}`;
    console.log("Today's clean date is: ", cleanDate);

    rawShifts.forEach(shift => {
        const { startTime, endTime, startLocation, endLocation, date } = shift.attributes;
        if (date < cleanDate) {
            pastShifts.push({
                startTime: startTime,
                endTime: endTime,
                startLocation: startLocation,
                endLocation: endLocation,
                date: date
            })
        } else {
            upcomingShifts.push({
                startTime: startTime,
                endTime: endTime,
                startLocation: startLocation,
                endLocation: endLocation,
                date: date
            })
        }
        
    });
    console.log("Raw shifts is: ", rawShifts);
    return (
        <div>
        <ShiftTable
            shifts={upcomingShifts}
            title="Your Upcoming Shifts"
            minWidth="350px"
        />
        <br/>
        <ShiftTable 
            shifts={pastShifts}
            title="Your Past Overtime Shifts"
            minWidth="350px"
        />
        </div>
    )
  };

  export default AssignedShifts;