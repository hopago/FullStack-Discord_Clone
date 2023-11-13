import { useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { postCardCategories } from '../../components/community/main/components/forum/components/constants';
import { storage } from '../firebase/config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAddNewPostMutation } from '../../features/post/slice/postsApiSlice';

const CreatedEditor = ({ setShowModal }) => {
    const quillRef = useRef();
    const [content, setContent] = useState("");
    const [representativeImgUrl, setRepresentativeImgUrl] = useState([]);
    const [error, setError] = useState("");

    const [addNewPost, { isLoading }] = useAddNewPostMutation();

    const [currPost, setCurrPost] = useState({
        title: "",
        category: "",
    });

    const handleInput = (e) =>
        setCurrPost((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));


    const handleSubmit = async (e) => {
        e.preventDefault();

        const title = currPost.title;
        const category = currPost.category;
        const description = content;
        const imgUrl = representativeImgUrl[0];

        if (canSave) {
            const post = {
                title,
                category,
                description,
                representativeImgUrl: imgUrl
            };

            try {
                addNewPost(post).unwrap();
            } catch (err) {
                if (error) {
                    setError(error);
                    setCurrPost({
                        title: "",
                        category: ""
                    });
                    setRepresentativeImgUrl([]);
                    return;
                }
            }

            setCurrPost({
                title: "",
                category: ""
            });
            setRepresentativeImgUrl([]);
            setShowModal(false);
        }

        setCurrPost({
            title: "",
            category: "",
        });
        setRepresentativeImgUrl([]);
        setShowModal(false);
    };

    const categoryOption = postCardCategories.map((category) => (
        <option key={`postCardCategories${category}`} value={category}>
            {category}
        </option>
    ));

    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "align",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "background",
        "color",
        "link",
        "image",
        "width",
    ];

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.addEventListener("change", async () => {
            const editor = quillRef.current.getEditor();
            const file = input.files[0];
            const range = editor.getSelection(true);

            const imageRef = ref(
                storage,
                `images/${file.name + new Date().getSeconds() + new Date().getTime()}`
            );

            try {
                await uploadBytes(imageRef, file)
                    .then(snapshot => {
                        getDownloadURL(snapshot.ref)
                            .then(url => {
                                setRepresentativeImgUrl(prev => ([...prev, url]));
                                editor.insertEmbed(range.index, "image", url);
                                editor.setSelection(range.index + 1);
                            })
                            .catch(err => console.error(err));
                    })
                    .catch(err => console.error(err));
            } catch (err) {
                console.error(err);
            }
        })
    };

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    ["blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }, "link", "image"],
                ],
                handlers: {
                    image: imageHandler,
                }
            },
        }
    }, []);

    const canSave =
        Object.keys(currPost)
            .map((key) => currPost[key])
            .every(Boolean) &&
        !isLoading;

    return (
        <form onSubmit={handleSubmit}>
            <select
                onChange={(e) => handleInput(e)}
                name="category"
                value={currPost.category}
            >
                <option value="">카테고리</option>
                {categoryOption}
            </select>
            <input
                type="text"
                name="title"
                value={currPost.title}
                onChange={(e) => handleInput(e)}
                placeholder="제목에 핵심 내용을!"
            />
            <ReactQuill
                style={{ width: "100%", height: "500px", maxHeight: "500px" }}
                placeholder={!error ? "게시글 내용을 남겨주세요. 첫 번째 사진은 게시글을 대표해요." : JSON.stringify(error)}
                theme="snow"
                ref={quillRef}
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
            />
            <div className="buttons">
                <button onClick={() => {
                    setShowModal(false);
                    
                }}>취소</button>
                <button type='submit' disabled={!canSave}>등록</button>
            </div>
        </form>
    )
}

export default CreatedEditor


