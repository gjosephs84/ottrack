import React from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import Register from "../components/register";
import LoginForm from "../components/loginForm";
import MITCard from "../components/mitCard";

// import the context
import { UserContext } from "../context/context";

// The graphql query
const GET_SHIFTS = gql`
query GetShifts{
    shifts {
      data {
        attributes {
          date
          startTime
          startLocation
          endTime
          endLocation
        }
      }
    }
  }
`;


// A function just to test out if we're getting data
const DisplayData = () => {
    const { loading, error, data } = useQuery(GET_SHIFTS);

    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error :</p>
    console.log(data);

    return (
        <div>
        <p>{JSON.stringify(data)}</p>
        <h3>{JSON.stringify(data.shifts.data[0].attributes.date)}</h3>
       </div>
    )
}

const Home = () => {
    // Set the context
    const ctx = React.useContext(UserContext)
    const [loggedIn, setLoggedIn] = ctx.loginState;
    console.log(`login state is ${loggedIn} `);
    console.log(`currentUser is ${JSON.stringify(ctx.currentUser)}`);
    

    return (
        <div>
            <div className="centered">
            <h1>Welcome to OTTrack</h1>
            </div>
            <div className="centered">
                <div className="form-card">
                    <div className="form-card-header">
                        <h2>Login</h2>
                    </div>
                    <div className="form-card-body">
                        <LoginForm/>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Home;