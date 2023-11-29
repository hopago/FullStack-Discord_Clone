import { useState } from 'react';

{/* 리펙토링 테스트 함수 */}

export default function useComment() {
  const [description, setDescription] = useState("");
  const [editComment, setEditComment] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState("");

  const handleAddComment = (e) => {
    e.preventDefault();
    if (Boolean(description)) {
      addComment({
        description,
        postId,
      }).unwrap();
      setDescription("");
    }
  };

  const closeEditState = () => {
    setEditComment(false);
    setUpdatedDescription("");
  };

  return {
    description,
    setDescription,
    editComment,
    setEditComment,
    updatedDescription,
    setUpdatedDescription,
    handleAddComment,
    closeEditState,
  };
}
