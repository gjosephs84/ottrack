import React from "react";
import SelectableShifts from "../components/selectableShifts";
import { useQuery, gql } from "@apollo/client";

// The graphql query to retrieve all the active offerings
/* 
    -----NOTE ON THE FILTER IN THE QUERY-----
    By putting a filter on offerings, I should ONLY get the offerings
    that are listed as active at the time of the query. Should follow
    the format (filters: {fieldImFilerting : {condition}})

*/

const GET_ACTIVE_OFFERINGS = gql`
query GetActiveOfferings{
    offerings(filters: {active: {eq: true}}){
      data {
        attributes{
          active
          offering_response {
            data {
              id
            }
          }
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

const SelectShifts = () => {
    // Start by getting the active offering
    const { loading, error, data } = useQuery(GET_ACTIVE_OFFERINGS);
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
        <div>
            <div className="centered">
                <h2>Select Shifts</h2>
            </div>
            <div className="centered">
                <p>Begin by tapping/clicking shifts you are interested in working.</p>
            </div>
            <div className="centered">
                <div>
                {offerings.map((offering, i) => {
                    return (
                    <SelectableShifts shifts={offering} key={i} id={i}></SelectableShifts> 
                    )
                })
                }
                </div>
            </div>
        </div>
    );
}

export default SelectShifts;