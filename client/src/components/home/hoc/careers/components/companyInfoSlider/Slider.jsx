import CurrentSlide from './components/CurrentSlide';
import './scss/Slider.scss';
import { slideData } from './constants';

const Slider = () => {
  return (
    <div className="slider">
      <div className="slider-wrapper">
        <CurrentSlide slideData={slideData} />
      </div>
    </div>
  );
}

export default Slider
