import { useSelector } from 'react-redux';
import { selectPostById } from '../../../../../../../features/post/slice/postsSlice';
import './singlePost.scss';
import ReactionButtons from '../reactionButtons/ReactionButtons';
import Spinner from '../../../../../../../lib/react-loader-spinner/Spinner';

const SinglePost = () => {
  // retrieve postId
  const postId = '';
  const post = useSelector(state => selectPostById(state, postId));
  if (!post) {
    return (
        <section>
            <Spinner message="컨텐츠를 찾지 못했어요." />
        </section>
    );
  }

  return (
    <article className="singlePost">
        <h2>{post.title}</h2>
        <p>{post.description}</p>
        <p className='postCredit'>
            {post.createdAt}
        </p>
        <ReactionButtons post={post} />
    </article>
  )
}

export default SinglePost
