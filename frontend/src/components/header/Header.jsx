
import "./header.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Navbar>
      <Container>
        <Navbar.Brand as={Link} to="/home">
          Proyecto 1 - 1S2024
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">

            <Nav.Link as={Link} to="/mtreal">
              Tiempo Real
            </Nav.Link>
            <Nav.Link as={Link} to="/mthistorico">
              Tiempo Historico
            </Nav.Link>
            <Nav.Link as={Link} to="/arbolprocesos">
              Arbol procesos
            </Nav.Link>
            <Nav.Link as={Link} to="/simulacion">
              Simulacion
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
