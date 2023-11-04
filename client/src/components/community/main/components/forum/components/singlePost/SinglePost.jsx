import { useSelector } from 'react-redux';
import './singlePost.scss';
import ReactionButtons from '../reactionButtons/ReactionButtons';
import Spinner from '../../../../../../../lib/react-loader-spinner/Spinner';
import { useParams } from 'react-router-dom';
import { selectCurrentUser } from '../../../../../../../features/users/slice/userSlice';
import { useRef, useState } from 'react';
import EditPost from './components/EditPost';
import { useGetPostQuery } from '../../../../../../../features/post/slice/postsApiSlice';
import moment from 'moment';
import 'moment/locale/ko';

const SinglePost = () => {
  const { postId } = useParams();
  const { _id } = useSelector(state => selectCurrentUser(state));

  const {
    data: post,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostQuery(postId);

  const modalRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const modalOutsideClick = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  if (!post) {
    return (
        <section className='singlePost-Spinner'>
            <Spinner message="컨텐츠를 찾지 못했어요." />
        </section>
    );
  }

  const setTime = (createdAt, updatedAt) => {
    if (createdAt !== updatedAt) {
      return moment.utc(updatedAt).lang("ko").format('YYYY년 MMMM Do dddd') + "(수정됨)";
    } else {
      return moment.utc(createdAt).lang("ko").format('YYYY년 MMMM Do dddd');
    }
  };

  return (
    <article className="singlePost">
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <p className="postCredit">{setTime(post.createdAt, post.updatedAt)}</p>
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
