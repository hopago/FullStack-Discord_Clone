import { motion } from "framer-motion";
import { fadeIn } from "../../../../utils/motion/motion";

const CareersCard = ({ index, title, img, desc }) => (
  <>
    <motion.div
      variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
      className="card-container"
      key={`careers-${desc}`}
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="card-wrapper"
      >
        <img src={img} alt={title} />
        <div className="card-container__texts">
          <h3 className="card-title">{title}</h3>
          <p>{desc}</p>
        </div>
      </div>
    </motion.div>
  </>
);

export default CareersCard;
