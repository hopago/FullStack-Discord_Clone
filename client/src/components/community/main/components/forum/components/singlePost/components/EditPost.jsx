import { useState } from "react";
import { useSelector } from "react-redux";

import "./editPost.scss";
import { Done, Image } from "@mui/icons-material";

import { setCurrentUser } from "../../../../../../../../features/users/slice/userSlice";
import { postCardCategories } from "../../constants";
import { useUpdatePostMutation } from "../../../../../../../../features/post/slice/postsApiSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import storage from "redux-persist/lib/storage";

const EditPost = ({
  modalRef,
  modalOutsideClick,
  setShowModal,
  currPost,
}) => {
  const [updatePost, { isLoading }] = useUpdatePostMutation();

  const [post, setPost] = useState({
    title: `${currPost.title}`,
    description: `${currPost.description}`,
    category: `${currPost.category}`
  });
  const [file, setFile] = useState("");

  const handleInput = (e) =>
    setPost((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const title = post.title;
    const description = post.description;
    const category = post.category;

    if (!file) {
      const imgUrl = currPost.imgUrl;
      const post = {
        title,
        description,
        category,
        imgUrl
      };

      updatePost(post).unwrap();

      setPost({
        title: "",
        description: "",
        category: ""
      });
      setFile("");
      setShowModal(false);
    } else {
      const imageRef = ref(
        storage,
        `images/${file.name + new Date().getSeconds() + new Date().getTime()}`
      );

      await uploadBytes(imageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            if (canSave && url) {
              const post = {
                title,
                description,
                category,
                imgUrl: url,
              };
              updatePost(post).unwrap();

              setPost({
                title: "",
                description: "",
                category: "",
              });
              setFile("");
              setShowModal(false);
            }
          })
          .catch((err) => console.error(err));
      });
    }
  };



  const canSave =
    Object.keys(post)
      .map((key) => post[key])
      .every(Boolean) &&
    Boolean(file ? file : currPost.imgUrl) &&
    !isLoading;

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
        <form onSubmit={handleUpdate}>
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
            placeholder={`${currPost?.title}`}
          />
          <textarea
            rows={10}
            cols={30}
            type="text"
            name="description"
            value={post.description}
            onChange={handleInput}
            placeholder={`${currPost?.description}`}
          />
          <select
            onChange={(e) => handleInput(e)}
            name="category"
            value={post.category}
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

export default EditPost;
