import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { postAdded } from "../../../../../../../features/post/slice/postsSlice";
import { setCurrentUser } from "../../../../../../../features/users/slice/userSlice";
import { postCardCategories } from "../constants";

import './createPost.scss';
import { Done, Image } from "@mui/icons-material";

const CreatePost = ({ modalRef, modalOutsideClick, setShowModal }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => setCurrentUser(state));

    const [post, setPost] = useState({
        title: "",
        description: ""
    });
    const [file, setFile] = useState("");
    const [category, setCategory] = useState("");

    const handleInput = e => setPost(prev => ({
        ...prev,
        [e.target.name]: e.target.value
    }));

    const handleFile = e => setFile(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const _id = currentUser._id;
        const title = post.title;
        const description = post.description;

        if (post.title && post.desc && file) {
            dispatch(
                postAdded(_id, file, title, description, category)
            )
        }

        setPost('');
        setFile('');
    };

    const canSave = Boolean(post.title) && Boolean(post.desc) && Boolean(file) && Boolean(category);

    const categoryOption = postCardCategories.map(category => (
        <option key={`postCardCategories${category}`} value={category}>
            {category}
        </option>
    ));

    const modalContents = (
      <section className="createPost">
        <div className="createPost-flexVertical">
          <h2>게시글 작성</h2>
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
              value={post.title}
              onChange={handleInput}
              placeholder="제목에 핵심 내용을!"
            />
            <textarea
              rows={10}
              cols={30}
              type="text"
              name="desc"
              value={post.desc}
              onChange={handleInput}
              placeholder="게시글 내용을 남겨주세요."
            />
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="">카테고리</option>
              {categoryOption}
            </select>
            <div className="buttons">
              <button onClick={() => setShowModal(false)}>취소</button>
              <button disabled={!canSave}>등록</button>
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
              <div className="postModal-contents">
                {modalContents}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost