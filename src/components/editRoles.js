import React from 'react';
import { useQuery, gql } from '@apollo/client';
import UserWithRole from './userWithRole';

// The graphql query to retrieve all the users and their roles
const GET_USERS_AND_ROLES = gql`
query getUsers {
    usersPermissionsUsers {
      data {
        id
        attributes {
          username
          role {
            data {
                attributes {
                name
              }         
            }
          }
        }
      }
    }
  }
`;

const EditRoles = () => {
    const { loading, error, data } = useQuery(GET_USERS_AND_ROLES);
    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error</p>

    // Let's make this manageable. First make all users into digestible objects
    const allUsers = [];
    data.usersPermissionsUsers.data.forEach(user => {
        allUsers.push(
            {
                id: user.id,
                username: user.attributes.username,
                role: user.attributes.role.data.attributes.name
            }
        )

    });

    // Next, separate those users by role
    const pending = [];
    const employees = [];
    const managers = [];
    allUsers.forEach(user => {
        if (user.role === "Pending") {pending.push(user)};
        if (user.role === "Employee") {employees.push(user)};
        if (user.role === "Manager") {managers.push(user)};
        console.log("pending is: ", pending, " and user passed in was: ", user);
    })




    return (
        <div>
            <h3>Pending</h3>
            {pending.map((user) => {
                const { username, role, id } = user;
                return (
                    <UserWithRole key={username} username={username} role={role} id={id}/>
                )
            })}

            <h3>Employees</h3>
            {JSON.stringify(employees)}

            <h3>managers</h3>
            {JSON.stringify(managers)}
        </div>
    )

};

export default EditRoles;