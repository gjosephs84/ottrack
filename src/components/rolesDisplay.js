import React from "react";
import axios from 'axios';

const RolesDisplay = ({pend, emp, mngr}) => {
    // State variables to update
    const [pending, setPending] = React.useState(pend);
    const [pendMessage, setPendMessage] = React.useState("");
    const [employees, setEmployees] = React.useState(emp);
    const [managers, setManagers] = React.useState(mngr);

    // The component to edit pending user roles
    const UserWithRole = ({username, role, id, index}) => {

        const handleChange = async (e, value, userId, username) => {
            e.preventDefault();
            // Figure out the type
            let userType;
            if (value == "") {
                setPendMessage(`Please choose a role for ${username}`);
                return;
            }
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
                });

                let temp = [...pending];
                temp.splice(index, 1);
                setPending(temp);
                setPendMessage(`${username}'s role has been updated to ${userType}`);
    
    
        };
        console.log("user is: ", username, role, id);
        return (
            <div>
                {username}
                <select onChange={(e) => {handleChange(e, e.target.value, id, username)}}>
                    <option value="" >Choose a Role</option>
                    <option value="4">Lifeguard</option>
                    <option value="5">Manager</option>
                </select>
            </div>
        )
    };

    // The component to show employees
    const EmployeesWithSeniority = ({username, id}) => {
        return (
            <div>
                {username} - {id}
            </div>
        )
    }

    return (
        <div>
            {pending.length > 0 && <div>
                <h3>Pending</h3>
                {pending.map((user, i) => {
                const { username, role, id } = user;
                return (
                    <UserWithRole key={username} username={username} role={role} id={id} index={i}/>
                    )
                })}
            </div>}
            <h5>{pendMessage}</h5>
            {employees.length > 0 && <div>
                <h3>Lifeguards</h3>
                {employees.map((user) => {
                    const { username, id } = user;
                    return (
                        <EmployeesWithSeniority key={username} username={username} id={id}/>
                    )
                })}
            </div>}
        </div>
    );

}

export default RolesDisplay;