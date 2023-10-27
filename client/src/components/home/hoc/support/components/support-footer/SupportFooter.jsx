import './scss/supportFooter.scss';
import web from './assets/faa4afbc252ccaa8d959cedf65f6e59b4d75b167.svg';
import android from './assets/fc0920a1ef72122cbcd69849ff4431fc8095a11b.svg';
import apple from './assets/e2b9fb24a30f282977edd9c280820029e767b160.svg';
import window from './assets/47100981c9f8e640b597c228528f303b5b5ae4ac.svg';
import logo from '../../../../navbar/assets/free-icon-computer-settings-2888694.png';

const SupportFooter = () => {
  return (
    <div className="support-footer">
      <div className="wrap">
        <div className="hook">
          <button>LEARN MORE</button>
          <div className="icons">
            <div className="web">
              <img src={web} alt="" />
            </div>
            <div className="mobile">
              <img src={android} alt="" />
              <img src={apple} alt="" />
            </div>
            <div className="window">
              <img src={window} alt="" />
            </div>
          </div>
        </div>
        <div className="support-footer-nav">
          <div className="logoWrapper">
            <div className="logo">
              <img src={logo} alt="" />
              <h4>DevBoard</h4>
            </div>
          </div>
          <div className="links-col">
            <span>Download</span>
            <span>Help & Support</span>
            <span>Feedback</span>
            <span>Status</span>
          </div>
          <div className="links-col">
            <span>Company</span>
            <span>Jobs</span>
            <span>GitHub</span>
            <span>Blog</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportFooter
