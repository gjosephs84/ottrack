import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import Register from "../components/register";
import LoginForm from "../components/loginForm";

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
    

    return (
        <div>
            Home Page
            <Link to="create-offering">Create Offering</Link>
            <DisplayData />
            <Register />
            <LoginForm />


        </div>
    );
}

export default Home;