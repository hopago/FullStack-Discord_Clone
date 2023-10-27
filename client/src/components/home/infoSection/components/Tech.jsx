import { technologies } from "../utils/data";
import BallCanvas from "./canvas/Ball";
import './scss/tech.scss';

const Tech = () => {
  return (
    <div className="tech">
      {technologies.map((technology) => (
        <div className="ball" key={technology.name}>
          <BallCanvas icon={technology.icon} />
        </div>
      ))}
    </div>
  );
}

export default Tech
