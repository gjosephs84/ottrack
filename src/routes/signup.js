import MITCard from "../components/mitCard";
import Register from "../components/register";

const Signup = () => {
    return (
        <div>
            <MITCard 
                cardTitle="Sign Up"
                cardBody={<Register/>}
            
            />
        </div>
    );
}

export default Signup;