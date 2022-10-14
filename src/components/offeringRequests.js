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
        console.log("rawRespondants is: ", rawRespondants);
    };

    // Stopping here for today so I can get the dog out for a walk.


    return (
        <div>
            Check the console.
        </div>
    )
};

export default OfferingsRequests;