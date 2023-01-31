/*

var XLSX = require("xlsx");

const ExportExcel = (offering) => {
    console.log("Offering coming in is: ", offering);
    // First create a workbook
    var workbook = XLSX.utils.book_new();
    // Create an array of arrays to populate the worksheet
    const wSheet = [];
    // First row will be the header
    wSheet.push(['Date','Start Time','End Time','Start Location','End Location','Shift Length','Assigned To']);
    // Now generate the rows
    console.log("I think I want ... ", offering.offering);
    offering.offering.forEach(shift => {
        const shiftLength = shift.endTime - shift.startTime;
        console.log("Shift Length is: ", shiftLength);
        wSheet.push([shift.date, shift.startTime, shift.endTime, shift.startLocation, shift.endLocation, shiftLength, shift.assignedTo]);
    });
    console.log("wSheet is: ", wSheet);
    // Now, create the worksheet
    var worksheet = XLSX.utils.aoa_to_sheet(wSheet);
    console.log('worksheet is: ', worksheet);

    // Now add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "shifts");
    // A function to actually try to export the file
    const handleClick = () => {
        XLSX.writeFileXLSX(workbook, "OTShifts.xlsx");
        console.log("Triggered handleClick. Did it work?");
    }
    return (
        <button onClick={handleClick}>Export to Excel</button>
    )
}

export default ExportExcel;
*/