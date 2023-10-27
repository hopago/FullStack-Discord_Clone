import { Search } from '@mui/icons-material';
import './hero.scss';
import background from './fcf4c0943984017de6b7.svg';

const Hero = () => {
  return (
    <div className="serverList-hero">
      <img src={background} alt="" className="serverList-backGround" />
      <div className="contents">
        <h1>DevBoard에서 커뮤니티 찾기</h1>
        <p>코딩, 자기계발, 학습까지 원하는 걸 찾아보세요.</p>
        <div className="searchBox">
          <div className="inputWrap">
            <input placeholder="커뮤니티 살펴보기" type="text" />
          </div>
          <div className="searchBox-icon">
            <Search style={{ color: "#313338" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero
