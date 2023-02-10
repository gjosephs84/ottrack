import React from "react";
import LoginForm from "../components/loginForm";
import AssignedShifts from "../components/assignedShifts";
import MITCard from "../components/mitCard";
import restoreSession from "../components/restoreSession";

// import the context
import { UserContext } from "../context/context";

const Home = () => {
    // Set the context
    const ctx = React.useContext(UserContext)
    const [loggedIn, setLoggedIn] = ctx.loginState;
    const [userRole, setUserRole] = ctx.userRole;
    const [loginSuccess, setLoginSuccess] = React.useState(false);
    const [headerTitle, setHeaderTitle] = React.useState("Login");
    console.log('session storage is: ', sessionStorage);
    console.log(`login state is ${loggedIn} `);
    console.log(`currentUser is ${JSON.stringify(ctx.currentUser)}`);
    if (sessionStorage.getItem('ctx') != null) {
        console.log("we have session storage!!!!");
    } else {
        console.log("No session storage found");
    }
    const restored = restoreSession();
    console.log('restored is: ', restored);
    if (restored === true) {
        setLoggedIn(true);
        setUserRole(ctx.currentUser.type);
    }
    console.log('ctx in its entirety is: ', ctx);

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