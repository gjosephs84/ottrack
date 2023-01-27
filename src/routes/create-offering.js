import React from "react";
import axios from 'axios';
import { useQuery, gql } from "@apollo/client";
import ShiftCreator from "../components/shiftCreator";
import ShiftTable from "../components/shift-table";
import ConfirmBox from "../components/confirmBox";
import { cleanOfferingData } from "../components/cleanOfferingData";

// The graphql query to retrieve all the offerings
const GET_OFFERINGS = gql`
query GetOfferings{
    offerings(filters: {active: {eq: true}}){
      data {
        id
        attributes {
          active
          shifts {
            data {
              attributes {
                date
                startTime
                endTime
                startLocation
                endLocation
              }
            }
          }
          offering_response {
            data {
              id
              attributes {
                respondants {
                  data {
                    id
                  }
                }
              }
              }
            }
          }
        }
      }
    }
  
`;

const offering = [];
const CreateOffering = () => {
  console.log("Offering is: ", offering);
  // A state variable to hold all the shifts in the offering
  const [shifts, setShifts] = React.useState(offering);
  const [startTime, setStartTime] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
  const [showSubmitted, setShowSubmitted] = React.useState(false);
  const [showDeleted, setShowDeleted] = React.useState(false);

  // Check to see if an offering already exists
  const { loading, error, data } = useQuery(GET_OFFERINGS, {
    fetchPolicy: 'network-only'
  });
  if (loading) return <p>Loading ... Checking for existing offerings.</p>;
  if (error) return <p>Error</p>
  console.log('data, even when empty, is: ', data); 
  if (data.offerings.data.length > 0) {
    const existingOffering = cleanOfferingData(data);
    // In case we need to delete:
    const offeringId = data.offerings.data[0].id;
    const offeringResponseId = data.offerings.data[0].attributes.offering_response.data.id;
    const offeringRespondants = [];
    // Might need to do an if here
    data.offerings.data[0].attributes.offering_response.data.attributes.respondants.data.forEach(respondant => {
      offeringRespondants.push(respondant.id);
    })
    console.log('offeringRespondants is: ', offeringRespondants);

    // A function to delete an active offering
  const deleteOffering = async() => {
    // begin by deleting any respondants

    const deleteRespondant = async(respondant) => {
      let deleteIt = await axios
        .delete(`https://ottrack-backend.herokuapp.com/api/respondants/${respondant}`)
        .then(response => console.log(response))
        .catch(error => console.log('an error has occurred ', error))
    }
    
      offeringRespondants.forEach(respondant => {
        deleteRespondant(respondant)
      });

      let deleteOfferingResponse = await axios
      .delete(`https://ottrack-backend.herokuapp.com/api/offering-responses/${offeringResponseId}`)
      .then(response => console.log(response))
      .catch(error => console.log('an error has occurred ', error));

      let deleteTheOffering = await axios
      .delete(`https://ottrack-backend.herokuapp.com/api/offerings/${offeringId}`)
      .then(response => console.log(response))
      .catch(error => console.log('an error has occurred ', error));
      setShowConfirmDelete(false);
      setShowDeleted(true);
    
  }

    return (
      <div>
        {showConfirmDelete && 
      <ConfirmBox 
        header="Delete Active Offering"
        message="Are you sure you want to delete this offering? This action cannot be undone."
        handleYes={deleteOffering}
        buttonYes="Yes"
        setConfirm={setShowConfirmDelete}
        buttonNo="No"
      />}
      {showDeleted ? (
      <div>
        <div className="centered">
            <h2>Create a New Overtime Offering</h2>
          </div>
          <div className="centered">
            <p className="box-350">
              Success! The offering has been successfully deleted.
            </p>
          </div>
      </div>
      ) : (
      <div className="centered">
        <div>
          <h2 style={{textAlign:"center"}}>An Active Offering Already Exists</h2>
          <p className="box-350">Please assign shifts to this offering by navigating to Admin in the navigation menu before continuing.</p>
          <p className="box-350">Alternatively, you may either quick-assign an extension of shift, or a call-in shift, also from Admin, or delete this active offering entirely.</p>
          {existingOffering.map((offering, i) =>
                <div key={i}>
                <ShiftTable key={i}
                title={"Current Offering"} 
                shifts={offering}
                editMode={true}
                setConfirmState={setShowConfirmDelete}
                buttonText="Delete Offering"
                minWidth={"350px"}
                />
                <br/>
                </div>
            )}
        </div>
      </div>)}
      </div>
    )
  }



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
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!! Inside removeShift index is: ", index);
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
      // Show the "final" everything submitted message
      setShowSubmitted(true);
  }

 

  return (
    <div>
      {showSubmitted ? (
        <div>
          <div className="centered">
            <h2>Create a New Overtime Offering</h2>
          </div>
          <div className="centered">
            <p className="box-350">
              Success! The offering has been published. You may check for lifeguard responses and assign shifts from the Admin page.
            </p>
          </div>
        </div>
      ) : (
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
            <ShiftCreator 
              title={"Create a Shift"}
              createOffering={true}
              shifts={shifts}
              setShifts={setShifts}
              offering={offering}
            />


          </div>
          <div>
            <ShiftTable 
              title="Shifts to Offer"
              shifts={shifts} 
              removeShift={removeShift} 
              createMode={true} 
              editMode={true}
              setConfirmState={setShowConfirm}
              buttonText="Submit Offering"
              minWidth={"350px"}
              /><br/>
          </div>
          </div>
        </div>
      </div>
      </div>
      )}
    </div>  
  )
}

export default CreateOffering;