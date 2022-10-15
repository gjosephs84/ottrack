import React from "react";
import { useQuery, gql } from "@apollo/client";

// The graphql query to retrieve all the offerings requests
const GET_OFFERINGS_REQUESTS = gql`
query GetActiveOfferingsResponses{
    offerings(filters: {active: {eq: true}}){
      data {
        attributes{
          active
          offering_response {
            data {
              id
              attributes {
                respondants {
                  data {
                    attributes {
                      users_permissions_user {
                        data {
                          id
                          attributes {
                            username
                            seniority
                          }
                        }
                      }
                      requested_shifts {
                        data {
                          attributes {
                            shift {
                              data {
                                id
                              }
                            }
                            ranking
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
      }
    }
  }
`;

const OfferingsRequests = () => {
    const { loading, error, data } = useQuery(GET_OFFERINGS_REQUESTS);
    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error</p>

    // Let's make this data manageable. First, let's isolate the respondants
    // We need the offerings (if there is more than one) isolated first
    const rawOfferings = [];
    for (let i=0; i<data.offerings.data.length; i++) {
        let current = data.offerings.data[i];
        rawOfferings.push(current);
    };
    // Now let's work our way into the offering_response to get respondants
    // rawRespondants is going to hold an object for the respondants of each
    // active offering, in case there are multiple active.
    const rawRespondants = [];
    for (let i=0; i<rawOfferings.length; i++) {
        let currentOfferingResponse = rawOfferings[i].attributes.offering_response.data.attributes;
        rawRespondants.push(currentOfferingResponse.respondants);
    };

    // Now let's turn those raw respondants into something actually useable

    const cleanResponses = [];
    for (let i=0; i<rawRespondants.length; i++) {
        let currentOfferingResponse = rawRespondants[i].data;
        for (let j=0; j<currentOfferingResponse.length; j++) {
            // Let's destructure to save some time and typing
            const { requested_shifts, users_permissions_user} = currentOfferingResponse[j].attributes;
            // Now let's destructure some more and make a new clean object array
            const cleanShifts=[];
            // We'll need this destructured user data
            const {username, seniority} = users_permissions_user.data.attributes;
            const id = users_permissions_user.data.id;
            requested_shifts.data.forEach(element => {
                const {shift, ranking} = element.attributes;
                const cleanShift = {
                    shift: shift.data.id,
                    ranking: ranking
                };
                cleanShifts.push(cleanShift)

            });
            cleanResponses.push({
                username: username,
                userId: id,
                seniority: seniority,
                shiftResponses: cleanShifts
            });
        }
        console.log("cleanResponses is: ", cleanResponses);
    }


    return (
        <div>
            Check the console.
        </div>
    )
};

export default OfferingsRequests;