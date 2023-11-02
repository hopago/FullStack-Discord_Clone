import './postCard.scss';
import ReactionButtons from '../reactionButtons/ReactionButtons';

const PostCard = ({ post }) => {
  return (
    <div className="forum-postCard-wrapper">
      <div className="img">
        <img src={post.imgUrl} alt="" />
      </div>
      <div className="texts">
        <h1>{post.title}</h1>
        <p>{post.desc.substring(0, 50)}...</p>
        <ReactionButtons post={post} />
      </div>
    </div>
  );
}

export default PostCard
