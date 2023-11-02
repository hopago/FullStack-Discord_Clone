import './categoryInput.scss';
import arrow from '../assets/ebd4163d89c2d849ec54.svg';
import { categories } from '../../../../home/discover/utils/data';

const CategoryInput = () => {
  return (
    <>
      <div className="top">
        <h1>서버 만들기</h1>
        <div className="topText">
          서버는 다른 분들과 함께 어울리는 공간입니다. 서버를 만들고 대화를
          시작해보세요.
        </div>
      </div>
      <div className="center">
        <div className="text">카테고리 고르기</div>
        {categories.map((category) => (
          <button key={`server-${category.category}-button`}>
            {category.icon}
            {category.category}
            <img src={arrow} alt="" />
          </button>
        ))}
      </div>
      <div className="bottom">
        <h2>이미 초대장을 받으셨나요?</h2>
        <button>서버 참가하기</button>
      </div>
    </>
  );
}

export default CategoryInput
