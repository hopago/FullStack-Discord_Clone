import './scss/hero.scss';

const Hero = () => {
  return (
    <div className="hero">
      <div className="wrap">
        <div className="text">
          <h1>DevBoard에 오신것을 환영합니다!</h1>
          <p>
            C, C#, Javascript, React 등 다양한 언어를 사용하는 커뮤니티에
            소속되어 유대감을 느낄 수 있는 커뮤니티입니다.
            <br />팀 프로젝트부터 사소한 문제 해결까지 팀원들과 함께 해보세요.
          </p>
        </div>
        <div className="buttons">
          <button>고객지원</button>
          <button>개발자 커뮤니티</button>
        </div>
      </div>
    </div>
  );
}

export default Hero
