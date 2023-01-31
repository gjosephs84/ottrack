import {utils, writeFileXLSX } from "xlsx";
import { useQuery, gql } from "@apollo/client";

const GET_SHIFTS = gql`
query getShifts {
    shifts (sort: "date:desc", pagination: { limit: 100}) {
      data {
        attributes {
          date
          startTime
          endTime
          startLocation
          endLocation
          assigned_to {
            data {
              attributes {
                username
              }
            }
          }
        }
      }
    }
  }
`;
const ExportExcel = () => {
    const { loading, error, data } = useQuery(GET_SHIFTS, {
        fetchPolicy: 'network-only'
      });
      if (loading) return <p>Loading ...</p>;
      if (error) return <p>Error</p>
      console.log("data is: ", data.shifts.data);
      const offering = data.shifts.data;
    // First create a workbook
    var workbook = utils.book_new();
    // Create an array of arrays to populate the worksheet
    const wSheet = [];
    // First row will be the header
    wSheet.push(['Date','Start Time','End Time','Start Location','End Location','Shift Length','Assigned To']);
    // Now generate the rows
    console.log("I think I want ... ", offering);
    offering.forEach(shift => {
        const theShift = shift.attributes;
        const shiftLength = theShift.endTime - theShift.startTime;
        console.log("Shift Length is: ", shiftLength);
        wSheet.push([theShift.date, theShift.startTime, theShift.endTime, theShift.startLocation, theShift.endLocation, shiftLength, theShift.assigned_to.data.attributes.username]);
    });
    console.log("wSheet is: ", wSheet);
    // Now, create the worksheet
    var worksheet = utils.aoa_to_sheet(wSheet);
    console.log('worksheet is: ', worksheet);

    // Now add the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, "shifts");
    // A function to actually try to export the file
    const handleClick = () => {
        writeFileXLSX(workbook, "OTShifts.xlsx");
        console.log("Triggered handleClick. Did it work?");
    }
    return (
        <button onClick={handleClick}>Export to Excel</button>
    )
}

export default ExportExcel;