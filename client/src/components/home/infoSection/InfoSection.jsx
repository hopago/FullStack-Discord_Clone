import { infoSectionData } from "./utils/data"
import './scss/InfoSection.scss';
import Tech from "./components/Tech";
import SmallLetter from "./components/SmallLetter";

const InfoSection = () => {
  return (
    <>
      <div className="infoSection">
        {infoSectionData.map((data) => (
          <div className="wrap" key={data.title}>
            <div className="items">
              <img src={data.img} alt={data.title} />
              <div className="texts">
                <h1>{data.title}</h1>
                <p>{data.desc}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="features">
          <div className="texts">
            <h1>강력한 커뮤니티</h1>
            <p>다양한 언어의 사용자들, 다른 직렬의 개발자들과 교류해보세요.<br/>당신의 언어도 보이나요?</p>
          </div>
          <Tech />
        </div>
        <div className="smallLetterContainer">
          <SmallLetter />
        </div>
      </div>
    </>
  );
}

export default InfoSection
