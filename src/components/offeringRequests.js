import React from "react";
import { useQuery, gql } from "@apollo/client";

// The graphql query to retrieve all the offerings requests
const GET_OFFERINGS_REQUESTS = gql`
query GetActiveOfferingsResponses{
    offerings(filters: {active: {eq: true}}){
      data {
        attributes{
          active
          shifts {
            data {
                id
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

    // We need the offerings (if there is more than one) isolated first
    const rawOfferings = [];
    data.offerings.data.forEach(element => {
        rawOfferings.push(element);
    });

    // Next, let's isolate the shifts. We need the id, and the other attributes neatly bundled in objects
    // This array will hold everything we need
    const cleanOfferingsWithResponses = [];
    rawOfferings.forEach(offering => {

        // To arrays to hold info we need
        const rawRespondants = [];
        const cleanShifts = [];

        // Isolate the respondants and their data
        offering.attributes.offering_response.data.attributes.respondants.data.forEach(respondant => {
            rawRespondants.push(respondant);
        });

        // Next, isolate the shifts
        offering.attributes.shifts.data.forEach(shift => {
            const shiftId = shift.id;
            const {date, startTime, endTime, startLocation, endLocation } = shift.attributes;
            cleanShifts.push({
                id: shiftId,
                date: date,
                startTime: startTime,
                endTime: endTime,
                startLocation: startLocation,
                endLocation: endLocation
            });

        });

        // Finally, turn the respondants into something useable.
        const cleanResponses = [];
        rawRespondants.forEach(respondant => {

            // Begin by isolating the user data
            const { username, seniority } = respondant.attributes.users_permissions_user.data.attributes;
            const id = respondant.attributes.users_permissions_user.data.id;
            
            // Now, isolate the shifts
            const cleanShifts = [];
            respondant.attributes.requested_shifts.data.forEach(element => {
                const {shift, ranking} = element.attributes;
                cleanShifts.push({
                    shift: shift.data.id,
                    ranking: ranking
                })
            });
            cleanResponses.push({
                username: username,
                userId: id,
                seniority: seniority,
                shiftResponses: cleanShifts
            });
        });

        // Bundle everything into a nice, clean object
        cleanOfferingsWithResponses.push({
            shifts: cleanShifts,
            responses: cleanResponses
        });
    });
    console.log("cleanOfferingsWithResponses is: ", cleanOfferingsWithResponses);

    return (
        <div>
            {JSON.stringify(cleanOfferingsWithResponses)}
        </div>
    )
};

export default OfferingsRequests;