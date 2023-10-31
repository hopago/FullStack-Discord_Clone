import './scss/login.scss';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/authentication/slice/authSlice';
import { useLoginMutation } from '../features/authentication/slice/authApiSlice';

import {
  Report
} from '@mui/icons-material';

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState({
    userName: '',
    password: ''
  });
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await login(user).unwrap();
      dispatch(setCredentials({ ...userData }));
      setUser('');
      navigate('/community');
    } catch (err) {
      console.log(err);
      if (!err?.originalStatus) {
        setErrMsg('No Server Response...');
      } else if (err.originalStatus === 400) {
        setErrMsg('Missing UserName or Password...');
      } else if (err.originalStatus === 401) {
        setErrMsg('Unauthorized...');
      } else {
        setErrMsg('Login failure...');
      }
      errRef.current?.focus();
    }
  };

  const handleUserInput = (e) => setUser(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));

  return (
    <section className="login">
      <div className="login-card">
        <div className="login-left">
          <Link to="/" className="link">
            <h1>DevBoard</h1>
          </Link>
          <p>
            DevBoard는 개발자 커뮤니티로서 개발자 뉴스 & 포럼과 정보 공유,
            문제해결과 가장 맞닿아있는 웹 사이트입니다.
          </p>
          <div className="left__toRegister">
            <span>계정이 아직 없으신가요?</span>
            <Link to="/register" className="link">
              <button>회원가입</button>
            </Link>
          </div>
        </div>
        <div className="login-right">
          <h1>로그인</h1>
          <form onSubmit={handleSubmit}>
            <input
              autoComplete="off"
              type="text"
              name="userName"
              placeholder="사용자명"
              onChange={handleUserInput}
              ref={userRef}
            />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              onChange={handleUserInput}
            />
            <button disabled={isLoading ? true : false}>로그인</button>
            {errMsg && (
              <p ref={errRef} className="instruction" aria-live="assertive">
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

export default Login
