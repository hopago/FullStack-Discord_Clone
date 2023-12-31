import './categoryInput.scss';
import arrow from '../assets/ebd4163d89c2d849ec54.svg';
import { categories } from '../../../../home/discover/utils/data';

const CategoryInput = ({ setCurrPage, handleInputs }) => {
  const handleClick = (e) => {
    handleInputs(e);
    setCurrPage(1);
  };

  return (
    <section className="serverCreateModal-1">
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
          <button
            onClick={handleClick}
            name="server_category"
            value={category.category}
            key={`server-${category.category}-button`}
          >
            {category.icon}
            <div name="server_category" className="grow">
              {category.category}
            </div>
            <img name="server_category" src={arrow} alt="" />
          </button>
        ))}
      </div>
      <div className="bottom">
        <h2>이미 초대장을 받으셨나요?</h2>
        <button>서버 참가하기</button>
      </div>
    </section>
  );
}

export default CategoryInput
