import React, { useContext } from "react";
import { UserContext } from "../context/context";
import { gql, useQuery } from "@apollo/client";

const GET_SHIFTS = gql`
query getShifts($id: ID) {
    usersPermissionsUsers(filters: {id: {eq: $id}})  {
      data{
        id
        attributes {
          username
          shifts {
            data {
              id
              attributes {
                startTime
                startLocation
                endTime
                endLocation
                date
              }
            }
          }
        }
      }
    }
  }
  `;

  const AssignedShifts = () => {
    const ctx = useContext(UserContext);
    const { loading, error, data } = useQuery(GET_SHIFTS, {
        variables: {"id": ctx.currentUser.id}
    });

    if (loading) return <p>Loading Shifts ...</p>
    if (error) return <p>Error</p>

    return (
        <p>{JSON.stringify(data)}</p>
    )
  };

  export default AssignedShifts;