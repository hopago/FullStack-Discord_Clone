import './scss/navbar.scss';
import logo from './assets/free-icon-computer-settings-2888694.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/" className="link">
        <div className="logo">
          <img src={logo} alt="" />
          <h4>DevBoard</h4>
        </div>
      </Link>
      <div className="links">
        <ul>
          <Link to="/discover" className="link">
            <li>Discover</li>
          </Link>
          <Link to="/support" className="link">
            <li>Support</li>
          </Link>
          <Link to="/careers" className="link">
            <li>Career</li>
          </Link>
        </ul>
      </div>
      <Link to="/community" className="link">
        <button>Join DevBoard</button>
      </Link>
    </div>
  );
}

export default Navbar
