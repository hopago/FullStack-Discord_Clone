import './careerHero.scss';
import {
    img1,
    img2,
    img3,
    img4,
    img5
} from './assets';

const CareerHero = () => {
  return (
    <div className="career-hero">
      <div className="texts">
        <h1>DevBoard에서 근무</h1>
        <p>
          DevBoard는 실무 역량 증진과 생산성을 높이는 공간을 만든다는 우리의
          사명을 믿는 열정적인 사람들이 모인 곳 입니다.
        </p>
      </div>
      <div className="img-container">
        <img src={img1} alt="" className="top-left" />
        <img src={img3} alt="" className="top-right" />
        <img src={img2} alt="" className="center" />
        <img src={img4} alt="" className="bottom-left" />
        <img src={img5} alt="" className="bottom-right" />
      </div>
    </div>
  );
}

export default CareerHero
