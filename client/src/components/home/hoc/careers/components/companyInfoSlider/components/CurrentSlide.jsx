import '../scss/CurrentSlide.scss';
import {
    ArrowLeftOutlined,
    ArrowRightOutlined
} from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
    
const CurrentSlide = ({ slideData }) => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [newSlideArray, setNewSlideArray] = useState([]);
    const [carouselTransition, setCarouselTransition] = useState('transform 500ms ease-in-out');

    const slideNext = () => {
        const sliderLength = slideData.length;
        const newCurr = currentIndex + 1;
        setCurrentIndex(newCurr);
        if (newCurr === sliderLength + 1) {
            moveToNthSlide(1);
        }
        setCarouselTransition('transform 500ms ease-in-out');
    };

    const slidePrev = () => {
        const sliderLength = slideData.length;
        const newCurr = currentIndex - 1;
        if (newCurr === 0) {
            moveToNthSlide(sliderLength);
        }
        setCarouselTransition('transform 500ms ease-in-out');
    };

    const moveToNthSlide = number => {
        setTimeout(() => {
            setCarouselTransition('');
            setCurrentIndex(number);
        }, 500);
    }

    useEffect(() => {
        const startData = slideData[0];
        const endData = slideData[slideData.length - 1];
        const newSlideDataArray = [endData, ...slideData, startData];
        setNewSlideArray(newSlideDataArray);
    }, [currentIndex]);

  return (
    <>
      <ArrowLeftOutlined onClick={slidePrev} className='left' />
      <div className="currentSlide">
        {newSlideArray &&
          newSlideArray.map((data, index) => (
            <div
              key={data.title + index}
              className="slide-contents"
              style={{
                transform: `translateX(-${currentIndex * 820}px)`,
                transition: `${carouselTransition}`
              }}
            >
              <img src={data.img} alt="" />
              <div className="texts">
                <h4>{data.title}</h4>
                <p>{data.desc}</p>
              </div>
            </div>
          ))}
      </div>
      <ArrowRightOutlined onClick={slideNext} className="right" />
    </>
  );
}

export default CurrentSlide
