import { useState } from 'react';
import SearchBar from './components/searchBar/SearchBar';
import './scss/discover.scss';
import { categories } from './utils/data';
import Results from './components/results/Results';
import UpSellLetters from './components/upSellLetters/UpSellLetters';
import { infoSectionData } from '../../home/infoSection/utils/data';
import { Link } from 'react-router-dom';

const Discover = () => {
  const [active, setActive] = useState(0);

  const toggleActive = (index) => {
    setActive(index);
  };

  {/* TODO: scrollRef.current?.scrollIntoView({ behavior: "smooth" }); */}

  return (
    <div className="discover">
      <SearchBar />
      <div className="main-row">
        <div className="category">
          {categories.map((cat, index) => (
            <div
              className={active === index ? "item active" : "item"}
              onClick={() => toggleActive(index)}
              key={cat.category}
            >
              <div className="icon">
                {cat.icon}
                <span>{cat.category}</span>
              </div>
              <div className="texts">
                <span>24313</span>
              </div>
            </div>
          ))}
        </div>
        <div className="searchResults">
          <Results />
        </div>
      </div>
      <div className="upSellLetters">
        <UpSellLetters />
      </div>
      <div className="wrap" key={infoSectionData[0].title}>
        <div className="items">
          <img src={infoSectionData[0].img} alt={infoSectionData[0].title} />
          <div className="content">
            <h1>당신이 찾는 모든 것</h1>
            <p>
              서버의 카테고리를 통해 공통된 관심사를 가진 사람들과 대화해보세요.
              <br />
              잠시 멈추고 싶을 땐 일상적인 대화도 가능합니다.
            </p>
            <div className="btnWrap">
              <Link to="/community" className="link">
                <button>JOIN DevBoard</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Discover
