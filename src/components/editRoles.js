import React from 'react';
import { useQuery, gql } from '@apollo/client';
import axios from 'axios';
import RolesDisplay from './rolesDisplay';

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
    });
    // The component to edit pending user roles
    const UserWithRole = ({username, role, id}) => {

        const handleChange = async (e, value, userId) => {
            e.preventDefault();
            // Figure out the type
            let userType;
            if (value == 4) {userType = "Lifeguard"};
            if (value == 5) {userType = "Manager"};
            // Update the user's role
            const url = `http://localhost:1337/api/users/${userId}`;
            let updatedUser = await axios
                .put(url, {
                    role: value,
                    type: userType
                }
                )
                .then(response => {
                    console.log(response.data.data);
                })
                .catch(error => {
                    console.log('An error occurred: ', error.response);
                })
    
    
        };
        console.log("user is: ", username, role, id);
        return (
            <div>
                {username}
                <select onChange={(e) => {handleChange(e, e.target.value, id)}}>
                    <option value="" disabled={true}>Choose a Role</option>
                    <option value="4">Lifeguard</option>
                    <option value="5">Manager</option>
                </select>
            </div>
        )
    }

    /* The next goal is to get the pending stuff to disappear after a choice is made
    Probably to do that I need to have a component that returns pending where I pass pending into
    the component and use state variables there to do the mapping
    */
    return (
        <div>
            <RolesDisplay pend={pending} emp={employees} mngr={managers}/>
        </div>
    )

};

export default EditRoles;