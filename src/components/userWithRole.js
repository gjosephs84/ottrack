import React from "react";
import axios from 'axios';

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

export default UserWithRole;