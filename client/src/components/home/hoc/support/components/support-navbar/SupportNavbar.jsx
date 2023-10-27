import "./scss/supportNavbar.scss";
import logo from '../../../../navbar/assets/free-icon-computer-settings-2888694.png';
import { Link } from 'react-router-dom';

const SupportNavbar = () => {
  return (
    <div className="supportNavbar">
      <div className="navWrap">
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
            <Link to="/register" className="link">
              <li>Sign In</li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SupportNavbar