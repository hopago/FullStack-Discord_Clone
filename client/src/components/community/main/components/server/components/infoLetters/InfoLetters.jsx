import explore from './assets/f5fcce7c509fcb9e2e7f.svg';
import './infoLetters.scss';

const InfoLetters = () => {
  return (
    <div className="community-server-infoLetters">
      <img src={explore} alt="" />
      <div className="texts">
        <h1>더 많은 커뮤니티가 있어요!</h1>
        <span>스크롤을 내려보세요.</span>
      </div>
    </div>
  );
}

export default InfoLetters
