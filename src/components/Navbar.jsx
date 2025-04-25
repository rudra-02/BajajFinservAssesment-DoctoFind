import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          DoctoFind
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/doctors" className="nav-link">Find Doctors</Link>
          </li>
          <li className="nav-item">
            <Link to="/appointments" className="nav-link">My Appointments</Link>
          </li>
          <li className="nav-item">
            <button className="login-button">Login / Register</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;