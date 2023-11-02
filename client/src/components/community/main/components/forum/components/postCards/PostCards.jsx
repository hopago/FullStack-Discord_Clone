import './postCards.scss';
import PostCard from '../postCard/PostCard';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import {
  selectAllPosts,
  getPostsStatus,
  getPostsError,
} from "../../../../../../../features/post/slice/postsSlice";
import Spinner from '../../../../../../../lib/react-loader-spinner/Spinner';

const PostCards = ({ type }) => {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const postsError = useSelector(getPostsError);

  useEffect(() => {
    if (postsStatus === 'idle') {
      switch (type) {
        case "all":
          break;
        case "recommend":
          break;
        case "hot":
          break;
        default:
          break;
      }
    }
  }, [postsStatus, dispatch, type]);

  let content;
  if (postsStatus === "loading") {
    content = <Spinner message="컨텐츠를 기다리는 중 이에요..." />;
  } else if (
    postsStatus === "succeeded" &&
    Array.isArray(posts) &&
    !posts.length
  ) {
    content = <Spinner message="컨텐츠가 아직 준비되지 않았어요." />;
  } else if (
    postsStatus === "succeeded" &&
    Array.isArray(posts) &&
    posts.length
  ) {
    content = posts.map((post) => <PostCard key={post?._id} post={post} />);
  } else if (postsStatus === "failed") {
    content = <p>{postsError}</p>;
  }

  return (
    <div className="forum-postCard-container">
        {content}
    </div>
  )
}

export default PostCards
