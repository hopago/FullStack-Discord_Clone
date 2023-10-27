import { useEffect } from 'react';
import { staggerContainer, textVariant } from '../../utils/motion/motion';
import SectionWrapper from '../sectionWrapper/SectionWrapper';
import CareersCard from './components/card/Card';
import Experience from './components/experience/Experience';
import CareersLetters from './components/letters/CareersLetters';
import Projects from './components/projects/Projects';
import { careersInfo } from './constant';
import './scss/career.scss';
import { motion } from 'framer-motion';
import Slider from './components/companyInfoSlider/Slider';

const BradCrumbs = () => (
  <motion.div
    className="career-bradCrumbs"
    key='career-bardCrumbs'
    layoutId='career-bradCrumbs'
    variants={textVariant()}
  >
    <h2>저희와 함께 만들어 나가요</h2>
    <p>
      DevBoard는 다양한 언어의 사용자들, 다양한 국가의 사람들이 소통할 수 있는
      공간입니다. 저희는 언제나 새로운 기술을 만들고 도전하고 시도하는 것을
      즐기고 있습니다. 세상의 문제를 해결하는 것은 저희의 과업이고 저희 기업은
      다양한 문제 상황을 긍정적으로 해결합니다.
      <br />
      만약 당신이 이와 비슷한 사람이라면 저희와 함께 하길 고대합니다.
    </p>
  </motion.div>
);

const Careers = () => {
  return (
    <div className="careers">
      <div className="careers-wrap">
        <motion.section
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <BradCrumbs />
        </motion.section>
        <motion.section
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {careersInfo.map((careerInfo, index) => (
            <CareersCard key={careerInfo.title} index={index} {...careerInfo} />
          ))}
        </motion.section>
        <CareersLetters />
        <Experience />
        <Projects />
        <Slider />
      </div>
    </div>
  );
}

export default Careers;
