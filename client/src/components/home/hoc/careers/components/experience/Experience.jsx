import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { motion } from 'framer-motion';
import { experiences } from './constants';
import { textVariant } from '../../../../utils/motion/motion';
import './experience.scss';

const ExperienceCard = ({ experience }) => {
    return (
        <VerticalTimelineElement
          contentStyle={{
            background: "white",
            color: "#444444"
          }}
          contentArrowStyle={{ borderRight: "8px solid #666666" }}
          date={experience.date}
          iconStyle={{ background: experience.iconBg }}
          icon={
            <div className='experience-img-wrapper'>
                <img src={experience.icon} alt={experience.tech_name} />
            </div>
          }
        >
            <div>
                <h3 className='experience-title'>{experience.title}</h3>
                <p className='experience-tech_name'>{experience.tech_name}</p>
            </div>
            <ul>
                {experience.points.map((point, index) => (
                    <li
                      key={`experience-point-${index}`}
                    >
                        {point}
                    </li>
                ))}
            </ul>
        </VerticalTimelineElement>
    )
};

const Experience = () => {
  return (
    <div className='experience-container'>
      <motion.div className="experience-bradCrumbs" variants={textVariant()}>
        <h2>핵심 기술</h2>
        <p>
            DevBoard는 동료들과 함꼐 전문적으로 그리고 개인적으로 모두 발전할 수 있습니다. 저희의 모든 관리자는 리더십 프로그램 과정을 받게 되며 모두에게 다양한 교육을 제공합니다. 어떤 것에 관심이 있든, 어떤 능력을 가지고 있든, 저희 플랫폼에서 소속감을 찾고 만들어 나갈 수 있도록 함께할 것 입니다.
            <br />
            저희 플랫폼의 핵심 기술을 확인 해보세요.
        </p>
      </motion.div>
      <div className="timelineContainer">
        <VerticalTimeline>
            {experiences.map((experience, index) => (
                <ExperienceCard key={`${index + experience.tech_name}`} experience={experience} />
            ))}
        </VerticalTimeline>
      </div>
    </div>
  );
}

export default Experience
