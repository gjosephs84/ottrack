import React from "react";
import LoginForm from "../components/loginForm";

// import the context
import { UserContext } from "../context/context";

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