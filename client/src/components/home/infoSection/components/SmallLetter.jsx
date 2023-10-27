import { Link } from 'react-router-dom';
import Sparkle from '../assets/a188414ce83f2454b9d71a47c3d95909.svg';
import './scss/smallLetter.scss';

const SmallLetter = () => {
  return (
    <div className='smallLetter'>
        <img src={Sparkle} alt="" />
        <h4>이제 시작해볼까요?</h4>
        <Link to="/community" className='link'>
            <button>
                개발자 커뮤니티
            </button>
        </Link>
    </div>
  )
}

export default SmallLetter
