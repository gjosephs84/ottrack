import React from "react";
import { UserContext } from "../context/context";

const restoreSession = () => {
    const ctx = React.useContext(UserContext);

    // See if there is a user currently in context
    if (ctx.currentUser != null) {
        return false;
    } else {
        // get the info from sessionStorage
        if (sessionStorage.getItem('ctx') == null) {
            console.log("Nothing in session storage");
            return false;
        }
        const storedUser = JSON.parse(sessionStorage.getItem('ctx'));
        ctx.currentUser = storedUser.currentUser;
        console.log('ctx after restore session is: ', ctx);
    }
    return true;
}

export default restoreSession;