import { useSelector } from 'react-redux';
import { selectPostById } from '../../../../../../../features/post/slice/postsSlice';
import './singlePost.scss';
import ReactionButtons from '../reactionButtons/ReactionButtons';
import Spinner from '../../../../../../../lib/react-loader-spinner/Spinner';
import { useParams } from 'react-router-dom';
import { selectCurrentUser } from '../../../../../../../features/users/slice/userSlice';
import { useRef, useState } from 'react';
import EditPost from './components/EditPost';

const SinglePost = () => {
  const { postId } = useParams();

  const post = useSelector(state => selectPostById(state, postId));
  const { _id } = useSelector(state => selectCurrentUser(state));

  const modalRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const modalOutsideClick = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

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
      <p className="postCredit">{post.createdAt}</p>
      <ReactionButtons post={post} />
      {post.author.authorId === _id && <button>수정</button>}
      {showModal && (
        <EditPost
          setShowModal={setShowModal}
          modalRef={modalRef}
          modalOutsideClick={modalOutsideClick}
          currPost={post}
        />
      )}
    </article>
  );
}

export default SinglePost
