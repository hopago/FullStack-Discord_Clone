import { useState } from "react";

import { postCardCategories } from "../constants";

import './createPost.scss';
import { Done, Image } from "@mui/icons-material";
import { useAddNewPostMutation } from "../../../../../../../features/post/slice/postsApiSlice";

import { useNavigate } from "react-router-dom";

const CreatePost = ({ modalRef, modalOutsideClick, setShowModal }) => {
    const [addNewPost, { isLoading }] = useAddNewPostMutation();

    const navigate = useNavigate();

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

    const handleSubmit = async (e) => {
      e.preventDefault();

      const title = post.title;
      const description = post.description;



      if (canSave) {
        const post = {
          title,
          description,
          category,
          imgUrl: file,
        };

        try {
          await addNewPost(post).unwrap();

          setPost({
            title: "",
            description: "",
          });
          setCategory("");
          setFile("");
        } catch (err) {
          console.error(err);
        }
      } else {
      }

      setPost({
        title: "",
        description: "",
      });
      setFile("");
      setCategory("");
    };

    const canSave = Object.values(post).every(Boolean) && Boolean(file) && !isLoading;

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
