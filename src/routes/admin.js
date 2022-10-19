import React from "react";
import OfferingsRequests from "../components/offeringRequests";
import EditRoles from "../components/editRoles";

const Admin = () => {
    const [showRequests, setShowRequests] = React.useState(false);
    return (
        <div>
            {showRequests && <OfferingsRequests/>}
            <button onClick={() => {setShowRequests(!showRequests)}}>Show Requests</button>
            <EditRoles/>
        </div>
    );
}

export default Admin;