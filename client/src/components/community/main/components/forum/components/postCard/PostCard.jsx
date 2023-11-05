import './postCard.scss';
import ReactionButtons from '../reactionButtons/ReactionButtons';
import { Link } from 'react-router-dom';
import { useAddViewOnPostMutation } from '../../../../../../../features/post/slice/postsApiSlice';

const PostCard = ({ post }) => {
  const postId = post._id;

  const [addView] = useAddViewOnPostMutation();

  return (
    <Link
      to={`/community/forum/${post?._id}`}
      className="link"
      onClick={() => addView(postId)}
    >
      <div className="forum-postCard-wrapper">
        <div className="img">
          <img src={post?.imgUrl} alt="" />
        </div>
        <div className="texts">
          <h1>{post?.title}</h1>
          <p>{post?.description.substring(0, 50)}...</p>
        </div>
      </div>
    </Link>
  );
}

export default PostCard
