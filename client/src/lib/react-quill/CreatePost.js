import { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatedEditor = () => {
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
            }
        }
    }, []);

    return (
        <div style={{ margin: "50px" }}>
        <button onClick={() => console.log(content)}>Value</button>
            <ReactQuill
            style={{ width: "600px", height: "600px" }}
            placeholder="Quill Content"
            theme="snow"
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={modules}
            />
        </div>
    )
}

export default CreatedEditor
