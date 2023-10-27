import './postCard.scss';
import {
    ThumbUp
} from '@mui/icons-material';

const PostCard = ({ post }) => {
  return (
    <div className="forum-postCard-wrapper">
      <div className="img">
        <img src={post.img} alt="" />
      </div>
      <div className="texts">
        <h1>{post.title}</h1>
        <p>{post.desc}</p>
        <p className="likes">
          {<ThumbUp style={{ fontSize: "12px" }} />}
          &nbsp;{post.likes}
        </p>
      </div>
    </div>
  );
}

export default PostCard
