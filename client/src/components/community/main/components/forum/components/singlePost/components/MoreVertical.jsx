import { useNavigate } from 'react-router-dom';
import { useDeletePostMutation } from '../../../../../../../../features/post/slice/postsApiSlice';
import './moreVertical.scss';
import { deleteImage } from './hooks/deleteImage';

const MoreVertical = ({ currentUser, author, setShowModal, setShowMoreVert, post, setEditState }) => {
  const [deletePost] = useDeletePostMutation();

  const navigate = useNavigate();

  const url = post.imgUrl;

  const handleDelete = async () => {
    deleteImage(url);

    deletePost(post)
      .unwrap()
      .then(() => setShowMoreVert(false))
      .then(() => navigate("/community/forum", { replace: true }))
      .catch(err => console.error(err));
  };

  return (
    <div className="singlePost-moreVertical">
      <div className="wrapper">
        <div className="item" onClick={() => setShowModal(true)}>
          <span>
            {author._id === currentUser._id ? "수정" : "공유하기"}
          </span>
        </div>
        {author._id === currentUser._id && (
          <div
            className="item"
            onClick={() => {
              setEditState(true);
              setShowMoreVert(false);
            }}
          >
            <span onClick={handleDelete}>삭제</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoreVertical
