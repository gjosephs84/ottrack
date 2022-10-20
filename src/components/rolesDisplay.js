import React from "react";
import axios from 'axios';
import MITCard from "./mitCard";

const RolesDisplay = ({pend, emp, mngr}) => {
    // State variables to update
    const [pending, setPending] = React.useState(pend);
    const [pendMessage, setPendMessage] = React.useState("");
    const [employees, setEmployees] = React.useState(emp);
    const [managers, setManagers] = React.useState(mngr);
    const [editLifeguards, setEditLifeguards] = React.useState(false);

    // A function to change view/edit for lifeguards
    const changeLifeguardView = () => {
        setEditLifeguards(!editLifeguards);
    }

    // The component to edit pending user roles
    const UserWithRole = ({username, role, id, seniority, index}) => {

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
                const removed = temp.splice(index, 1);
                setPending(temp);
                setPendMessage(`${username}'s role has been updated to ${userType}`);
                // Put the removed user in the correct role array
                if (userType == "Lifeguard") {
                    let employeeTemp = [...employees];
                    employeeTemp.push(removed[0]);
                    setEmployees(employeeTemp);
                };
                if (userType == "Manager") {
                    let managerTemp = [...managers];
                    managerTemp.push(removed[0]);
                    setManagers(managerTemp);
                };
        };

        return (
            <div className="pending-user">
                <div>
                    {username}
                </div>
                <div>
                    <select onChange={(e) => {handleChange(e, e.target.value, id, username)}}>
                        <option value="" >Choose a Role</option>
                        <option value="4">Lifeguard</option>
                        <option value="5">Manager</option>
                    </select>
                </div>
            </div>
        )
    };

    // The employee display table
    const LifeguardTable = () => {
        return (
            <div>
                <div className="lifeguard-table lgt-header">
                    <div>Name</div>
                    <div>Seniority</div>
                </div>
                <div className="lifeguard-table">

                </div>
            </div>
        )
    }

    // The component to show employees
    const EmployeesWithSeniority = ({username, id, seniority}) => {
        return (
            <div className="lifeguard-table">
                <div>{username}</div>
                <div>{seniority}</div>
            </div>
        )
    };

    // The component to show managers
    const Manager = ({username, id}) => {
        return (
            <div>
                {username} - {id}
            </div>
        )
    };

    return (
        <div>
            {pending.length > 0 && <MITCard 
                    cardTitle={"Pending"}
                    cardBody={
                        pending.map((user, i) => {
                            const { username, role, id, seniority } = user;
                            return (
                                <UserWithRole key={username} username={username} role={role} id={id} seniority={seniority} index={i}/>
                                )
                            })
                    }
                />
            }
            <h5>{pendMessage}</h5>
            {employees.length > 0 && <MITCard 
                    cardTitle={"Lifeguards"}
                    cardBody={
                        <div>
                            {editLifeguards ? (
                                <button className="button-full" onClick={changeLifeguardView}>Submit Changes</button>
                            ) : (
                            <div>
                            <div className="lifeguard-table lgt-header">
                                <h5>Name</h5>
                                <h5>Seniority</h5>
                            </div>
                            {employees.map((user) => {
                            const { username, id, seniority } = user;
                            return (
                                <EmployeesWithSeniority key={username} username={username} id={id} seniority={seniority}/>
                                )
                            })}
                            <br/>
                            <button className="button-full" onClick={changeLifeguardView}>Edit Lifeguards</button>
                            </div>
                            )}
                        </div>
                        
                    }
                />  
            }
            <br/>
            {managers.length > 0 && <MITCard 
                cardTitle={"Managers"}
                cardBody={
                    managers.map((user) => {
                        const { username, id } = user;
                        return (
                            <Manager key={username} username={username} id={id}/>
                        )
                    })
                }
            />
            }
        </div>
    );

}

export default RolesDisplay;