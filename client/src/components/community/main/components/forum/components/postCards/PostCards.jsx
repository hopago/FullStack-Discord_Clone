import './postCards.scss';
import PostCard from '../postCard/PostCard';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import {
  selectAllPosts,
  getPostsStatus,
  getPostsError,
  fetchPosts,
} from "../../../../../../../features/post/slice/postsSlice";
import Spinner from '../../../../../../../lib/react-loader-spinner/Spinner';

const PostCards = ({ type }) => {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const postsError = useSelector(getPostsError);

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [postsStatus, dispatch]);

  let content;
  if (postsStatus === 'loading') {
    content = <Spinner message="컨텐츠를 기다리는 중 이에요..." />
  } else if (postsStatus === 'succeeded') {
    content = posts.map((post) => <PostCard post={post} />);
  } else if (postsStatus === 'failed') {
    content = <p>{postsError}</p>
  }

  return (
    <div className="forum-postCard-container">
        {content}
    </div>
  )
}

export default PostCards
