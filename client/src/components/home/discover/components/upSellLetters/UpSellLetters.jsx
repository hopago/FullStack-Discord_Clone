import { Link } from 'react-router-dom';
import './scss/upSellLetters.scss';

const UpSellLetters = () => {
  return (
    <div className='upSellLetters-container'>
      <h4>찾으시는 서버가 있었나요?</h4>
      <Link to="/community/server" className='link'>
        <button>
            서버 탭 둘러보기
        </button>
      </Link>
    </div>
  )
}

export default UpSellLetters
