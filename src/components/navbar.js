import React from 'react';
import {Navbar, Container, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

// Context is being brought in here because it contains the state variables
// required to conditionally show login/logout in the navbar
// based on whether the login has actually occurred or not

import { UserContext } from '../context/context';

function NavigationBar() {
    // Setting the context as ctx
    const ctx = React.useContext(UserContext);
    // Grabbing the state variable from context
    const [loggedIn, setLoggedIn] = ctx.loginState;
    const [userRole, setUserRole] = ctx.userRole;

    // A function to handle logging out
    const logout = () => {
        setLoggedIn(false);
        ctx.currentUser = null;
        setUserRole(null);
    }
    return (
        <div>
            {/* Here is the navbar before a successful login */}
            {!loggedIn && <Navbar className="color-nav" variant="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">OTTrack</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <LinkContainer to="/">
                                <Nav.Link title="Home Page">Home</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="signup">
                                <Nav.Link title="Create an Account">Sign Up</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>}
            {/* Here is the navbar after a successful login */}
            {loggedIn && <Navbar className="color-nav" variant="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">OTTrack</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <LinkContainer to="/">
                                <Nav.Link title="Home Page">Home</Nav.Link>
                            </LinkContainer>
                            {userRole==="Lifeguard" && <LinkContainer to="select-shifts">
                                <Nav.Link title="Select Shifts">Select Shifts</Nav.Link>
                            </LinkContainer>}
                            {userRole==="Manager" && <LinkContainer to="create-offering">
                                <Nav.Link title="Create Offering">Create Offering</Nav.Link>
                            </LinkContainer>}
                            <LinkContainer to="history">
                                <Nav.Link title="View Offering History">Offerings History</Nav.Link>
                            </LinkContainer>
                            {userRole==="Lifeguard" && <LinkContainer to="employee">
                                <Nav.Link title="My Account">View Account</Nav.Link>
                            </LinkContainer>}
                            {userRole==="Manager" && <LinkContainer to="admin">
                                <Nav.Link title="Administration Panel">Admin</Nav.Link>
                            </LinkContainer>}
                            <LinkContainer to="/" onClick={() => {logout();}}>
                                <Nav.Link title="Log Out">Logout</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>} 
        </div>
    );
}

export default NavigationBar;