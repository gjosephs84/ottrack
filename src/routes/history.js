import ShiftTable from "../components/shift-table";
import { useQuery, gql } from "@apollo/client";

// The graphql query to retrieve all the offerings
const GET_OFFERINGS = gql`
query GetOfferings{
    offerings {
      data {
        attributes {
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
        }
      }
    }
  }
`;

const History = () => {
    const { loading, error, data } = useQuery(GET_OFFERINGS);
    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error</p>
    // The data coming in is messy. Time to clean it up so it's useable.
    // First get the data in its raw form
    let rawOfferings = data.offerings.data;
    // Then create a clean array to push it into
    const offerings = [];
    // Isolate one of the dirty offerings at a time
    for (let i=0; i<rawOfferings.length; i++) {
        let current = rawOfferings[i].attributes.shifts.data;
        // Clean it up further -- Get down past the attributes to the meat
        // of the shift
        // Begin with a place to hold the super-clean version
        const cleanOffering = [];
        for (let j=0; j<current.length; j++) {
            cleanOffering.push(current[j].attributes);
        };
        // Now push the clean offering into offerings
        offerings.push(cleanOffering);
    };
    // Reverse the array so offerings appear with most recent first
    offerings.reverse();
    return (
        <div className="centered">
            <div>
                <h2 className="centered">Offerings History</h2>
                <br/>
            {offerings.map((offering, i) =>
                <div key={i}>
                <ShiftTable key={i} shifts={offering} removeShift={null}/>
                <br/>
                </div>
            )}
            </div>
        </div>
    );
}

export default History;