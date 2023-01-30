import ShiftTable from "../components/shift-table";
import { useQuery, gql } from "@apollo/client";

// The graphql query to retrieve all the offerings
const GET_OFFERINGS = gql`
query GetOfferings{
  offerings (sort: "createdAt:desc", pagination: { limit: 100 }) {
    data {
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
    }
  }
}
`;

const History = () => {
    const { loading, error, data } = useQuery(GET_OFFERINGS, {
      fetchPolicy: 'network-only'
    });
    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error</p>
    // The data coming in is messy. Time to clean it up so it's useable.
    // First get the data in its raw form
    let rawOfferings = data.offerings.data;
    console.log("rawOfferings is: ", rawOfferings);
    // Then create a clean array to push it into
    const currentOfferings = [];
    const oldOfferings = [];
    // Isolate one of the dirty offerings at a time
    for (let i=0; i<rawOfferings.length; i++) {
        let current = rawOfferings[i].attributes.shifts.data;
        // Clean it up further -- Get down past the attributes to the meat
        // of the shift
        // Begin with a place to hold the super-clean version
        const cleanOffering = [];
        for (let j=0; j<current.length; j++) {
            let assigned;
            if (current[j].attributes.assigned_to.data == null) {
              assigned = "Not Assigned"
            } else {
              assigned = current[j].attributes.assigned_to.data.attributes.username
            }
            const shiftData = current[j].attributes;
            const cleanShiftObject = {
              startTime: shiftData.startTime,
              endTime: shiftData.endTime,
              startLocation: shiftData.startLocation,
              endLocation: shiftData.endLocation,
              date: shiftData.date,
              assignedTo: assigned
            }
            cleanOffering.push(cleanShiftObject);
        };
        // Now push the clean offering into offerings
        console.log("cleanOffering is: ", cleanOffering);
        if (rawOfferings[i].attributes.active == true) {
          currentOfferings.push(cleanOffering);
        } else {
          oldOfferings.push(cleanOffering);
        }
        
    };
    // Reverse the array so offerings appear with most recent first
    currentOfferings.reverse();
    return (
        <div className="centered">
            <div>
                <h2 className="centered">Offerings History</h2>
                <br/>
            {currentOfferings.map((offering, i) =>
                <div key={i}>
                <ShiftTable key={i} shifts={offering} removeShift={null} title={"Current Offering"}/>
                <br/>
                </div>
            )}
            {oldOfferings.map((offering, i) =>
                <div key={i}>
                <ShiftTable 
                  key={i} 
                  shifts={offering} 
                  removeShift={null} 
                  title={"Previous Offering"} 
                  minWidth={"350px"}
                  showAssigned={true}
                  />
                <br/>
                </div>
            )}
            </div>
        </div>
    );
}

export default History;