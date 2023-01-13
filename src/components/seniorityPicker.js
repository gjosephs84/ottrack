import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_GUARDS = gql`
query getGuards {
    usersPermissionsUsers(filters: { role: { name: { contains: "Employee" } } }) {
      data {
        id
        attributes {
          username
        }
      }
    }
  }
`
