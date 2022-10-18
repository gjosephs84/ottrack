import React from "react";
import OfferingsRequests from "../components/offeringRequests";

const Admin = () => {
    const [showRequests, setShowRequests] = React.useState(false);
    return (
        <div>
            {showRequests && <OfferingsRequests/>}
            <button onClick={() => {setShowRequests(!showRequests)}}>Show Requests</button>
        </div>
    );
}

export default Admin;