import { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { postCardCategories } from '../../components/community/main/components/forum/components/constants';
import { storage } from '../firebase/config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAddNewPostMutation } from '../../features/post/slice/postsApiSlice';
import { deleteImage } from '../../components/community/main/components/forum/components/singlePost/components/hooks/deleteImage';

const CreatedEditor = ({ setShowModal }) => {
    const quillRef = useRef();

    const [content, setContent] = useState("");
    const [representativeImgUrl, setRepresentativeImgUrl] = useState([]);
    const [imgUrlArr, setImgUrlArr] = useState([]);
    const [error, setError] = useState("");
    const [currPost, setCurrPost] = useState({
        title: "",
        category: "",
    });

    useEffect(() => {
        const images = document.querySelectorAll("img");

        images.forEach((image) =>
            image.parentElement.classList.add("editorImageWrap")
        );

        images.forEach((image) => {
            image.src === representativeImgUrl?.[0]
                ? image.classList.add("representativeImg")
                : image.classList.add("uploadedImg");
        });

        if (images.length === 1) {
            images.forEach(image => {
                image.classList.add("representativeImg");
                setRepresentativeImgUrl(image.src);
            });
            return;
        };

        images.forEach((image) =>
            image.addEventListener("click", () => {
                if (image.src === representativeImgUrl?.[0]) return;

                image.classList.remove("uploadedImg");
                image.classList.add("representativeImg");

                let currRepresentativeImgSrc;

                if (
                    Array.isArray(representativeImgUrl) &&
                    representativeImgUrl.length
                ) {
                    currRepresentativeImgSrc = representativeImgUrl?.[0];
                }

                const selectedImgSrc = image.src;

                setRepresentativeImgUrl((prev) => {
                    prev.push(selectedImgSrc);
                    prev.filter((url) => url !== currRepresentativeImgSrc);
                });
                setImgUrlArr((prev) => {
                    prev.push(currRepresentativeImgSrc);
                    prev.filter((url) => url !== selectedImgSrc);
                });

                images.forEach((image) => {
                    if (image.src === currRepresentativeImgSrc) {
                        image.classList.remove("representativeImg");
                    }
                });
            })
        );
    }, [representativeImgUrl, imgUrlArr]);

    const [addNewPost, { isLoading }] = useAddNewPostMutation();

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

        if (canSave) {
            let post;

            post = {
                title,
                category,
                description,
                representativeImgUrl: representativeImgUrl[0],
                imgUrlArr
            };

            if (Array.isArray(imgUrlArr) && !imgUrlArr.length) {
                post = {
                    title,
                    category,
                    description,
                    representativeImgUrl: representativeImgUrl[0],
                };
            }

            if (Array.isArray(representativeImgUrl) &&
                Array.isArray(imgUrlArr) &&
                !representativeImgUrl.length &&
                !imgUrlArr.length) {
                post = {
                    title,
                    category,
                    description,
                };
            };

            try {
                addNewPost(post).unwrap();
            } catch (err) {
                if (error) {
                    if (representativeImgUrl[0] && !imgUrlArr.length) {
                        deleteImage(representativeImgUrl[0]);
                    } else {
                        setImgUrlArr(prev => [representativeImgUrl, ...prev]);
                        deleteImage(imgUrlArr);
                    }
                    setError(error);
                    setCurrPost({
                        title: "",
                        category: ""
                    });
                    setRepresentativeImgUrl([]);
                    setImgUrlArr([]);
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
                if (representativeImgUrl[0]) {
                    await uploadBytes(imageRef, file)
                        .then(snapshot => {
                            getDownloadURL(snapshot.ref)
                                .then(url => {
                                    setImgUrlArr(prev => [...prev, url]);
                                    editor.insertEmbed(range.index, "image", url);
                                    editor.setSelection(range.index + 1);
                                })
                                .catch(err => console.error(err));
                        })
                        .catch(err => console.error(err));
                } else {
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
                }
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

    const handleCloseModal = () => {
        if (representativeImgUrl?.length >= 1) {
            if (window.confirm("변경 사항이 저장되지 않을 수 있어요. 나가시겠어요?")) {
                if (representativeImgUrl?.[0] && !imgUrlArr.length) {
                    deleteImage(representativeImgUrl[0]);
                } else {
                    setImgUrlArr(prev => [representativeImgUrl, ...prev]);
                    deleteImage(imgUrlArr);
                }

                setContent("");
                setCurrPost("");
                setError("");
                setRepresentativeImgUrl([]);
                setImgUrlArr([]);
                setShowModal(false);
            } else {
                setShowModal(true);
                return;
            }
        }
    };

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
                placeholder={!error ? "게시글 내용을 남겨주세요. 대표이미지를 클릭해서 선택해요!" : error}
                theme="snow"
                ref={quillRef}
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
            />
            <div className="buttons">
                <button onClick={handleCloseModal}>취소</button>
                <button type='submit' disabled={!canSave}>등록</button>
            </div>
        </form>
    )
}

export default CreatedEditor


