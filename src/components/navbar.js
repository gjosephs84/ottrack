import React from 'react';
import {Navbar, Container, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

// Context is being brought in here because it contains the state variables
// required to conditionally show login/logout in the navbar
// based on whether the login has actually occurred or not

// import { UserContext } from './user-context';

function NavigationBar() {
    // Setting the context as ctx
    // const ctx = React.useContext(UserContext);
    // Grabbing the state variable from context
    // const [loggedIn, setLoggedIn] = ctx.loginState;
    return (
        <Navbar className="color-nav" variant="light" expand="lg">
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
                        <LinkContainer to="select-shifts">
                            <Nav.Link title="Select Shifts">Select Shifts</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="create-offering">
                            <Nav.Link title="Create Offering">Create Offering</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="history">
                            <Nav.Link title="View Offering History">Offerings History</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="employee">
                            <Nav.Link title="My Account">View Account</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="admin">
                            <Nav.Link title="Administration Panel">Admin</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="login">
                            <Nav.Link title="Login">Login</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar> 
    );
}

export default NavigationBar;