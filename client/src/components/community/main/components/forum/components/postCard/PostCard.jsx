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
          <img src={post?.imgUrl || post?.representativeImgUrl} alt="" />
        </div>
        <div className="texts">
          <h1>{post?.title}</h1>
        </div>
      </div>
    </Link>
  );
}

export default PostCard
