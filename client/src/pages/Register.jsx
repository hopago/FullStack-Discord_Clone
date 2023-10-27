import { Link } from 'react-router-dom';
import './scss/register.scss';

const Register = () => {
  return (
    <div className="register">
      <div className="register-card">
        <div className="register-left">
          <Link to="/" className="link">
            <h1>DevBoard</h1>
          </Link>
          <p>
            DevBoard는 온라인 개발자 커뮤니티입니다.
            <br />
            개발자 뉴스 & 포럼, 정보 공유와 사용자들간의 협업을 지향합니다.
            <br />
            저희 커뮤니티는 실력있는 당신과 함께하는 것을 고대하고 있습니다.
          </p>
          <div className="left__toLogin">
            <span>계정이 이미 있으신가요?</span>
            <Link to="/login" className="link">
              <button>로그인</button>
            </Link>
          </div>
        </div>
        <div className="register-right">
          <form>
            <input
              type="text"
              autoComplete="off"
              name="userName"
              placeholder="사용자명"
            />
            <input
              type="text"
              autoComplete="off"
              name="name"
              placeholder="성함"
            />
            <input
              type="email"
              autoComplete="off"
              name="email"
              placeholder="이메일"
            />
            <input type="password" name="password" placeholder="비밀번호" />
            <input
              type="password"
              name="passwordAgain"
              placeholder="비빌번호 재입력"
            />
            {/* select -> language skill */}
            <button>회원가입</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register
