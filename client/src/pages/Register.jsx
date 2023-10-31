import { Link, useNavigate } from 'react-router-dom';
import './scss/register.scss';
import { useRef, useState, useEffect } from 'react';
import {
  Error,
  Report
} from '@mui/icons-material';
import { useRegisterMutation } from '../features/authentication/slice/authApiSlice';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
  const [register, { isLoading }] = useRegisterMutation();
  
  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [errMsg, setErrMsg] = useState('');

  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('');

  const [userName, setUserName] = useState('');
  const [validUserName, setValidUserName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(userName);
    setValidUserName(result);
  }, [userName]);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg('');
  }, [userName, password, matchPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validateUserName = USER_REGEX.test(userName);
    const validatePassword = PASSWORD_REGEX.test(password);
    if (!validateUserName || !validatePassword) {
      setErrMsg("Invalid Entry...");
      return;
    }

    const user = {
      userName,
      email,
      password,
      language
    };

    try {
      await register(user).unwrap();
      setUserName('');
      setEmail('');
      setPassword('');
      setMatchPassword('');
      setLanguage('');
      navigate('/login');
    } catch (err) {
      if (err?.originalStatus) {
        setErrMsg('No server response...');
      } else if (err.originalStatus === 400) {
        setErrMsg('All fields except language are required...');
      } else if (err.originalStatus === 409) {
        setErrMsg('User already exists...');
      } else {
        setErrMsg("Register failure...");
      }
    }    
  };

  return (
    <section className="register">
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
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              autoComplete="off"
              name="userName"
              placeholder="사용자명"
              ref={userRef}
              onChange={(e) => setUserName(e.target.value)}
              required
              aria-invalid={validUserName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            {userFocus && userName && !validUserName && (
              <p className="instruction">
                <Error />
                사용자명은 영문이어야하며 4~24 글자입니다.
                <br />
                첫 글자는 대문자로 시작해야 합니다.
                <br />
                영문을 제외하고 숫자나 -, _와 같은 특수 문자들이 허용됩니다.
              </p>
            )}
            <input
              type="email"
              autoComplete="off"
              name="email"
              placeholder="이메일"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            {passwordFocus && !validPassword && (
              <p id="pwdnote" className="instruction">
                <Error />
                사용자명은 영문이어야하며 4~24 글자입니다.
                <br />
                반드시 대문자나 소문자를 하나 포함해야하며, 숫자나 특수 문자
                역시 필요합니다.
                <br />
                특수 문자: !, @, #, $, %
              </p>
            )}
            <input
              type="password"
              name="matchPassword"
              placeholder="비빌번호 재입력"
              onChange={(e) => setMatchPassword(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            {matchFocus && !validMatch && (
              <p id="confirmnote" className="instruction">
                <Error />
                패스워드가 일치하지 않습니다.
              </p>
            )}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="">Language</option>
              <option value="javascript">Javascript</option>
              <option value="react">React</option>
              <option value="next">Next</option>
            </select>
            <button
              disabled={
                !validUserName || !validPassword || !validMatch ? true : false
              }
            >
              회원가입
            </button>
            {errMsg && (
              <p
                ref={errRef}
                className={errMsg ? "errMsg" : "offScreen"}
                aria-live="assertive"
              >
                <Report style={{ color: "color: #c4302b" }} />
                {errMsg}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register
