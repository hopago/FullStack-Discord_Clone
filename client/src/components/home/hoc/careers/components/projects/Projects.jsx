import { motion } from "framer-motion";
import github from './assets/github.png';
import { fadeIn, textVariant } from '../../../../utils/motion/motion';
import SectionWrapper from "../../../sectionWrapper/SectionWrapper";
import { projects } from './constants/constant';
import './projects.scss';

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => (
  <motion.div
    layoutId={`project-${name}${index}`}
    key={`project-${name}${index}`}
    variants={fadeIn("up", "spring", index * 0.5, 0.75)}
  >
    <div className="project-card-wrapper">
      <div className="project-image-wrapper">
        <img src={image} alt={name} className="project-card-image" />
        <div className="project-card-image2">
          <div
            onClick={() => window.open(source_code_link, "_blank")}
            style={{
              cursor: "pointer",
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient( to right, #434343, #000000 )"
            }}
          >
            <img
              src={github}
              alt="github"
              style={{ width: "50%", height: "50%", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
      <div className="texts">
        <h3 className="name">{name}</h3>
        <p className="desc">{description}</p>
      </div>
      <div className="tags">
        {tags.map((tag) => (
          <p key={tag.name} style={{ fontSize: "14px", color: "#888888" }}>
            #{tag.name}
          </p>
        ))}
      </div>
    </div>
  </motion.div>
);

const Projects = () => {
  return (
    <div className="projects">
      <div className="projects-texts">
        <motion.div layoutId="projects" key="projects" variants={textVariant()}>
          <p className="project-sub">Our Work</p>
          <h2 className="project-title">Projects</h2>
        </motion.div>
          <motion.p
            variants={fadeIn("", "", 0.1, 1)}
            className="project-desc"
            key="project-desc"
          >
            만약 당신이 열정적인 팀원과 함께하고 싶다면 저희 프로젝트와
            소스코드를 확인해보세요. 여러 부분에서, 우리는 현재 다양한 사람들과
            함께하고 있습니다.
          </motion.p>
      </div>
      <div className="project-card-container">
        {projects.map((project, index) => (
          <ProjectCard
            key={`project-${project.name}`}
            index={index}
            {...project}
          />
        ))}
      </div>
    </div>
  );
}

export default SectionWrapper(Projects, "Projects");
