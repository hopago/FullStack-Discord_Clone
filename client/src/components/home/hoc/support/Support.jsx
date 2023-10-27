import './scss/support.scss';
import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';
import { moreInfo, services } from './constants';
import SectionWrapper from '../sectionWrapper/SectionWrapper';
import { fadeIn, textVariant } from '../../utils/motion/motion';

const FaqCard = ({ index, title, icon}) => (
  <>
    <Tilt className="faq-tilt">
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className='card-container'
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450
          }}
          className='card-wrapper'
        >
          <img src={icon} alt={title} />
          <h3 className='card-title'>
            {title}
          </h3>
        </div>
      </motion.div>
    </Tilt>
  </>
);

const Support = () => {
  return (
    <>
      <motion.div className="support-title" variants={textVariant()}>
        Welcome to DevBoard Headquarters!
      </motion.div>
      <motion.p className="support-desc">
        Find articles to help you make apps, learn everything in between.
      </motion.p>
      <div className="serviceCard-container">
        {services.map((service, index) => (
          <FaqCard key={service.title} index={index} {...service} />
        ))}
      </div>
      <motion.div className="support-title" variants={textVariant()}>
        Don't find what you are looking for?
      </motion.div>
      <div className="serviceCard-container" style={{ marginBottom: "5rem" }}>
        {moreInfo.map((service, index) => (
          <FaqCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
}

export default SectionWrapper(Support, "support");
