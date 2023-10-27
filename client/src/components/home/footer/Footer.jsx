import {
    ExpandMore,
    Twitter,
    Instagram,
    Facebook,
    YouTube,
    GitHub
} from '@mui/icons-material';
import Flag from './assets/Flag_of_South_Korea.png';
import './scss/footer.scss';
import logo from '../navbar/assets/free-icon-computer-settings-2888694.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="footer">
      <div className="row1">
        <div className="colItem-firstChild">
          <div className="item">
            <div className="lang">
              <img src={Flag} alt="" />
              <p>한국어</p>
              <ExpandMore style={{ cursor: "pointer" }} />
            </div>
          </div>
          <div className="item">
            <div className="icons">
              <Twitter style={{ cursor: "pointer" }} />
              <Instagram style={{ cursor: "pointer" }} />
              <Facebook style={{ cursor: "pointer" }} />
              <YouTube style={{ cursor: "pointer" }} />
              <GitHub style={{ cursor: "pointer" }} />
            </div>
          </div>
        </div>
        <div className="colItem-links">
          <span>앱</span>
          <ul>
            <li>다운로드</li>
            <li>상태</li>
            <li>소스코드</li>
          </ul>
        </div>
        <div className="colItem-links">
          <span>회사</span>
          <ul>
            <li>소개</li>
            <li>채용</li>
            <li>브랜드</li>
            <li>뉴스</li>
          </ul>
        </div>
        <div className="colItem-links">
          <span>자원</span>
          <ul>
            <li>지원</li>
            <li>보안</li>
            <li>깃허브</li>
            <li>블로그</li>
            <li>개발자</li>
          </ul>
        </div>
        <div className="colItem-links">
          <span>정책</span>
          <ul>
            <li>이용 약관</li>
            <li>쿠키 설정</li>
            <li>지침</li>
            <li>감사</li>
            <li>회사 정보</li>
          </ul>
        </div>
      </div>
      <div className="row2">
        <div className="logo">
          <img src={logo} alt="" />
          <h4>DevBoard</h4>
        </div>
        <Link to="/community" className="link">
          <button>DevBoard 열기</button>
        </Link>
      </div>
    </div>
  );
}

export default Footer
