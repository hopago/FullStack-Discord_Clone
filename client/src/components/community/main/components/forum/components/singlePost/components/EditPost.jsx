import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./editPost.scss";
import { Done, Image } from "@mui/icons-material";

import { setCurrentUser } from "../../../../../../../../features/users/slice/userSlice";
import { postCardCategories } from "../../constants";
import { useNavigate } from "react-router-dom";

const CreatePost = ({
  modalRef,
  modalOutsideClick,
  setShowModal,
  currPost,
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => setCurrentUser(state));
  
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    description: "",
  });
  const [file, setFile] = useState("");
  const [category, setCategory] = useState("");

  const handleInput = (e) =>
    setPost((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const _id = currentUser._id;
    const title = post.title;
    const description = post.description;

    if (post.title && post.description && file) {

    }

    setPost("");
    setFile("");
    setShowModal(false);
    navigate(`/community/forum/${currPost._id}`);
  };

  const canSave =
    Boolean(post.title) &&
    Boolean(post.desc) &&
    Boolean(file) &&
    Boolean(category);

  const categoryOption = postCardCategories.map((category) => (
    <option key={`postCardCategories${category}`} value={category}>
      {category}
    </option>
  ));

  const modalContents = (
    <section className="createPost">
      <div className="createPost-flexVertical">
        <h2>게시글 수정</h2>
        <p>모든 영역을 다 채워야 업로드가 가능해요!</p>
      </div>
      <div className="createPost-content">
        <form onSubmit={handleSubmit}>
          <label htmlFor="createPost-img">
            <Image style={{ marginRight: "4px" }} />
            <span>이미지 업로드</span>
            {file && <Done style={{ marginLeft: "4px", color: "green" }} />}
          </label>
          <input
            id="createPost-img"
            className="createPost-img"
            type="file"
            onChange={handleFile}
          />
          <input
            type="text"
            name="title"
            value={post.title ? post.title : currPost.title}
            onChange={handleInput}
            placeholder={`${currPost.title}`}
          />
          <textarea
            rows={10}
            cols={30}
            type="text"
            name="description"
            value={`${currPost.description}`}
            onChange={handleInput}
            placeholder="게시글 내용을 남겨주세요."
          />
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category ? category : currPost.category}
          >
            <option value="">카테고리</option>
            {categoryOption}
          </select>
          <div className="buttons">
            <button onClick={() => setShowModal(false)}>취소</button>
            <button disabled={!canSave}>수정</button>
          </div>
        </form>
      </div>
    </section>
  );

  return (
    <div className="postModal">
      <div className="postModal-backgroundDrop" />
      <div
        className="postModal-layer"
        ref={modalRef}
        onClick={(e) => modalOutsideClick(e)}
      >
        <div className="postModal-modal">
          <div className="postModal-modal-container">
            <div className="postModal-modal-wrapper">
              <div className="postModal-contents">{modalContents}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
