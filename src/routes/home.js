import React from "react";
import LoginForm from "../components/loginForm";
import AssignedShifts from "../components/assignedShifts";
import MITCard from "../components/mitCard";

// import the context
import { UserContext } from "../context/context";

const Home = () => {
    // Set the context
    const ctx = React.useContext(UserContext)
    const [loggedIn, setLoggedIn] = ctx.loginState;
    const [loginSuccess, setLoginSuccess] = React.useState(false);
    const [headerTitle, setHeaderTitle] = React.useState("Login");
    console.log(`login state is ${loggedIn} `);
    console.log(`currentUser is ${JSON.stringify(ctx.currentUser)}`);

    return (
        <div>
            <div className="centered">
            <h1>Welcome to OTTrack</h1>
            </div>
            <MITCard 
                cardTitle={headerTitle}
                cardBody={<LoginForm loginSuccess={loginSuccess} setLoginSuccess={setLoginSuccess}/>}
                minWidth={"250px"}
                maxWidth={"350px"}
            />
            <br/>
            {loginSuccess && <div>
                <AssignedShifts/>
                </div>}
        </div>
    );
}

export default Home;