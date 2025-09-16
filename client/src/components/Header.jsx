

import {Container, Navbar, Button, Nav } from "react-bootstrap"
import { Link, Outlet, useLocation } from "react-router"
import { FaUser,FaCoins,FaTrophy } from "react-icons/fa";


const Header = (props) => {

    const location = useLocation();
    const islogin = location.pathname === '/login';



  return (
    <>

    <Navbar  bg="primary" variant="dark" expand="sm" style={{          background: "linear-gradient(135deg, #4a90e2 0%, #6fb1fc 100%)",
 }}  >
      <Container fluid className="d-flex justify-content-between align-items-center">
        <Navbar.Brand as={Link} to="/" className="fs-3 fw-bold">
          GuestQuest
        </Navbar.Brand>
        

        <Nav className="ms-auto">
          {!props.loggedIn && !islogin? (
            <Button as={Link} to="/login" variant="light" disabled={props.gameActive}>
              Login
            </Button>
          ) : (
            <>
            <div className="d-flex align-items-center me-3 px-3 py-2 border rounded bg-light shadow-sm">
              <FaTrophy className="me-2 text-warning" />
              <span>Matches: <strong>{props.user.game_played}</strong></span>
            </div>

            <div
              className="d-inline-flex align-items-center me-2 px-3 py-1 shadow-sm"
              style={{
                backgroundColor: "#fffbea", // soft yellow background
                border: "2px solid #ffc107", // Bootstrap warning color for coins
                borderRadius: "12px",
                fontWeight: "500",
                color: "#856404", // darker yellow/brown for text
                userSelect: "none",
                cursor: "default"
              }}
            >
              <FaCoins className="me-2" />
              {props.user.coins} Coins
            </div>
              
              <div
                className="d-inline-flex align-items-center me-2 px-3 py-1 shadow-sm"
                style={{
                  backgroundColor: "#ffffff",
                  border: "2px solid #0d6efd", // blue border
                  borderRadius: "0px",
                  fontWeight: "500",
                  color: "#0d6efd",
                  userSelect: "none",
                  cursor: "default"
                }}
              >
                <FaUser className="me-2" />
                {props.user.username}
              </div>
              <Button onClick={props.handleLogout} variant="danger" disabled={props.gameActive}>
                Logout
              </Button>
            </>
          )}
        </Nav>

      </Container>
    </Navbar>

    <Outlet />

    </>
  )
}

export default Header