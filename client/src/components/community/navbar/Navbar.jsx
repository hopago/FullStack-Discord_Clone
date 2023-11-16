import logo from '../../home/navbar/assets/free-icon-computer-settings-2888694.png';

import './navbar.scss';

import CreateModal from './modal/CreateModal';

import serverImg from './assets/kisspng-community-of-practice-organization-social-group-on-stakeholder-management-5b03c46322fe96.2547190115269735391434.png';
import serverImg2 from './assets/community-icon-29131.png';

import ExploreIcon from '@mui/icons-material/Explore';
import AddIcon from '@mui/icons-material/Add';

import { Link } from 'react-router-dom';

import { selectCurrentUser } from '../../../features/users/slice/userSlice';
import { useSelector } from 'react-redux';

import { useRef, useState } from 'react';

const Navbar = () => {
  const dummyServerId = "dummyServerId";

  const currentUser = useSelector(state => selectCurrentUser(state));
  
  const modalRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const modalOutsideClick = (e) => {
      if (modalRef.current === e.target) {
          setShowModal(false);
      }
  };

  return (
    <div className="community-navbar-lefts">
      <nav className="navbar-wrapper">
        <div className="scroller">
          <div className="tutorialContainer">
            <div className="pill">
              <span></span>
            </div>
            <Link to="/community" className="link">
              <div className="tut-itemWrapper">
                <img src={logo} alt="navbar-tut-logo" />
              </div>
            </Link>
          </div>
          <hr />
          <div aria-label="server" className="server">
            <div className="flex-col">
              {/* fetch server later... & memoization */}
              <Link to={`/community/server/${dummyServerId}`}>
                <div className="server-items">
                  <div className="pill"></div>
                  <div className="server-itemWrapper">
                    <img src={serverImg} alt="" />
                  </div>
                </div>
              </Link>
              <Link to={`/community/server/${dummyServerId}`}>
                <div className="server-items">
                  <div className="pill"></div>
                  <div className="server-itemWrapper">
                    <img src={serverImg2} alt="" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <hr />
          <div className="tutorialContainer-2">
            <div className="flex-col">
              <div className="tut-itemWrapper" onClick={() => setShowModal(true)}>
                <AddIcon className="icon" />
              </div>
              <Link to="/community/server" className="link">
                <div className="tut-itemWrapper">
                  <ExploreIcon className="icon" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {showModal && (
        <CreateModal modalRef={modalRef} modalOutsideClick={modalOutsideClick} setShowModal={setShowModal} />
      )}
    </div>
  );
}

export default Navbar
