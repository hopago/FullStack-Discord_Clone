import './postCards.scss';
import PostCard from '../postCard/PostCard';
import { useSelector } from 'react-redux';
import Spinner from '../../../../../../../lib/react-loader-spinner/Spinner';
import {
  selectPostsIds,
  useGetPostsBySortOptionsQuery,
} from "../../../../../../../features/post/slice/postsApiSlice";

const PostCards = ({ type }) => {
  const {
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostsBySortOptionsQuery(type);

  const orderedPostIds = useSelector(selectPostsIds);

  let content;
  if (isLoading) {
    content = <Spinner message="컨텐츠를 기다리는 중 이에요..." />;
  } else if (isSuccess && (Array.isArray(orderedPostIds) && !orderedPostIds.length)) {
    content = <Spinner message="컨텐츠가 아직 준비되지 않았어요." />;
  } else if (isSuccess) {
    content = orderedPostIds.map((postId) => <PostCard key={post?._id} postId={postId} />);
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return (
    <div className="forum-postCard-container">
        {content}
    </div>
  )
}

export default PostCards
