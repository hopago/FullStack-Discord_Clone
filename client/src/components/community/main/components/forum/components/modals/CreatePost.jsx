import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { postAdded } from "../../../../../../../features/post/slice/postsSlice";
import { setCurrentUser } from "../../../../../../../features/users/slice/userSlice";
import { postCardCategories } from "../constants";

const CreatePost = () => {
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

  return (
    <section>
      <h2>포스트 카드 만들기</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFile} />
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleInput}
        />
        <input
          type="text"
          name="desc"
          value={post.desc}
          onChange={handleInput}
        />
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option value="">카테고리</option>
          {categoryOption}
        </select>
        <button
          disabled={!canSave}
        >
            업로드
        </button>
      </form>
    </section>
  );
}

export default CreatePost
