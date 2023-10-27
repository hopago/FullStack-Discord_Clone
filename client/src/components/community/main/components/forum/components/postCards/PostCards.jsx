import './postCards.scss';
import PostCard from '../postCard/PostCard';

const dummyPostData = [
    {
        img: "https://images.pexels.com/photos/3861959/pexels-photo-3861959.jpeg?auto=compress&cs=tinysrgb&w=1600",
        title: "항상, 매일",
        desc: "개발 해봅시다.",
        likes: "6300",
    },
    {
        img: "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=1600",
        title: "재밌게 하는 방법",
        desc: "웃으며 하세요.",
        likes: "6300",
    },
    {
        img: "https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg?auto=compress&cs=tinysrgb&w=1600",
        title: "개발자들",
        desc: "이보다 더 완벽한 2인조가 있을까요?",
        likes: "6300",
    }
];

const PostCards = ({ type }) => {
  return (
    <div className="forum-postCard-container">
        {dummyPostData.map((post) => <PostCard post={post} />)}
    </div>
  )
}

export default PostCards
