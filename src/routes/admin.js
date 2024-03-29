import React from "react";
import { UserContext } from "../context/context";
import OfferingsRequests from "../components/offeringRequests";
import EditRoles from "../components/editRoles";
import ShiftCreator from "../components/shiftCreator";
import ButtonMenu from "../components/buttonMenu";
import restoreSession from "../components/restoreSession";

const Admin = () => {
    const ctx = React.useContext(UserContext);
    const [showRequests, setShowRequests]       = React.useState(false);
    const [showRoles, setShowRoles]             = React.useState(false);
    const [showQuickAssign, setShowQuickAssign] = React.useState(false);
    const [loggedIn, setLoggedIn]               = ctx.loginState;
    const [userRole, setUserRole]               = ctx.userRole;

    const restored = restoreSession();
    console.log('restored is: ', restored);
    if (restored === true) {
        setLoggedIn(true);
        setUserRole(ctx.currentUser.type);
    }
    console.log('ctx in its entirety is: ', ctx);

    return (
        <div>
            <h2 style={{margin:"auto", textAlign:"center"}}>Manager Admin Panel</h2>
            <h4 style={{margin:"auto", textAlign:"center"}}>Hello {ctx.currentUser.username}, what would you like to do?</h4>
            <ButtonMenu 
                menuOptions={[
                    {
                        text:"Show Requests",
                        show: showRequests,
                        setShow: setShowRequests
                    },
                    {
                        text: "Quick Assign",
                        show: showQuickAssign,
                        setShow: setShowQuickAssign
                    },
                    {
                        text: "Manage Roles",
                        show: showRoles,
                        setShow: setShowRoles
                    }
                ]
                }
            />
            {showRequests && <OfferingsRequests/>}
            {showQuickAssign && <ShiftCreator 
              title="Quick Assign"
              quickAssign={true}
              />}
            {showRoles && <EditRoles/>}
        </div>
    );
}

export default Admin;