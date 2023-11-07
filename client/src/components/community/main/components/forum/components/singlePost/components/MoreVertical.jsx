import { useNavigate } from 'react-router-dom';
import { useDeletePostMutation } from '../../../../../../../../features/post/slice/postsApiSlice';
import './moreVertical.scss';

const MoreVertical = ({ currentUser, author, setShowModal, setShowMoreVert }) => {
  const [deletePost] = useDeletePostMutation();

  const navigate = useNavigate();

  const handleDelete = () => {
    deletePost()
      .unwrap()
      .then(() => navigate("/community/forum", { replace: true }))
      .catch((err) => console.error(err));
  };
  
  return (
    <div
      className="singlePost-moreVertical"
    >
      <div className="wrapper">
        <div className="item" onClick={() => setShowModal(true)}>
          <span>{author._id === currentUser._id ? "수정" : "공유하기"}</span>
        </div>
        {author._id === currentUser._id && (
          <div className="item" onClick={handleDelete}>
            <span>삭제</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoreVertical
