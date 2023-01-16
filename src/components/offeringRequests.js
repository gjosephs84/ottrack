import React from "react";
import { useQuery, gql } from "@apollo/client";
import OfferingRequestsResponse from "./offeringRequestsResponse";

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
    usersPermissionsUsers(filters: { role: { name: { contains: "Employee" } } }) {
      data {
        id
        attributes {
          username
        }
      }
    }
    lastRecipients {
      data{
        id
        attributes {
          userId
          createdAt
          dateAssigned
          assignedBy {
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
const guards = [];
const lastRecipients = [];

const OfferingsRequests = () => {
    const { loading, error, data } = useQuery(GET_OFFERINGS_REQUESTS, {
      fetchPolicy: 'network-only'
    });
    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error</p>

    console.log("Checking the data: ", data);

    // First let's find our last recipient of Overtime

    data.usersPermissionsUsers.data.forEach(guard => {
      const id = guard.id;
      const name = guard.attributes.username
      guards.push({id: id, name: name})
    });
    data.lastRecipients.data.forEach(recipient => {
      const id = Number(recipient.id);
      const employeeId = recipient.attributes.userId;
      const assignedBy = recipient.attributes.assignedBy.data.attributes.username;
      const dateAssigned = recipient.attributes.dateAssigned;
      lastRecipients.push({id: id, employee: employeeId, assignedBy: assignedBy, dateAssigned: dateAssigned})
    })

    

  // Sort by name
    guards.sort((a, b) => (a.name > b.name) ? 1 : -1);

  // Sort past recipients by id of the record
  lastRecipients.sort((a,b) => (Number(a.id) < Number(b.id)) ? 1 : -1);

  console.log("Past recipient data is: ", lastRecipients);
  console.log("lastRecipients[0].employeeId is: ", lastRecipients[0].employee);

  const lastRecipInfo = guards.filter(guard => 
    guard.id == lastRecipients[0].employee
  );

  console.log("Last recip is: ", lastRecipInfo[0].name);
  console.log("All data for last recip is: ", lastRecipInfo[0]);

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

    // Let's also bundle last recipient info for a nice clean readout

    const lastAssignedDate = lastRecipients[0].dateAssigned.slice(0,10);
    const lastAssigned = {
      name: lastRecipInfo[0].name,
      id: lastRecipInfo[0].id,
      assignedBy: lastRecipients[0].assignedBy,
      date: lastAssignedDate
    }

    return (
        <div>
          <p className="centered-text">Last recorded overtime assigned to {lastAssigned.name}, by {lastAssigned.assignedBy}, on {lastAssigned.date}</p>
        <div className="centered">
            {cleanOfferingsWithResponses.map((offering, i) => {
                return (
                    <OfferingRequestsResponse key={i} offering={offering} lastRecipient={lastAssigned}/>
                )
            })}
        </div>
        </div>
    )
};

export default OfferingsRequests;