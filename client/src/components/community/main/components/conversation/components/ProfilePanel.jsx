import { useEffect, useState } from "react";
import capitalizeFirstLetter from "../../../../../../hooks/CapitalizeFirstLetter";
import { useLazyGetPostsByAuthorIdQuery } from "../../../../../../features/post/slice/postsApiSlice";
import { Link } from "react-router-dom";

const ProfilePanel = ({ friend, defaultPP }) => {
  const [getLatestPosts] = useLazyGetPostsByAuthorIdQuery();
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    if (!friend) {
      return;
    }

    const fetchLatestPosts = async () => {
      const { data } = await getLatestPosts(friend?._id);
      if (Array.isArray(data) && data.length) {
        setLatestPosts(data);
      }
    }

    fetchLatestPosts();
  }, [friend]);

  return (
    <div className="profilePanel">
      <div className="profilePanel-ImgContainer">
        <div className="wrapper">
          {friend?.banner ? (
            <img src={friend?.banner} alt="" className="background" />
          ) : (
            <div className="background-fill" />
          )}
          <div className="profilePictureWrapper">
            {friend?.avatar ? (
              <img src={friend?.avatar} className="profileImg" />
            ) : (
              <img src={defaultPP} />
            )}
            <div className="roleImgWrapper">
              <img
                src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png"
                className="roleImg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="profilePanel-userInfo">
        <div className="profilePanel-userInfo-wrapper">
          <div className="top">
            <div className="userText">
              <h4>{friend?.userName}</h4>
              <p>Stack&nbsp;{capitalizeFirstLetter(friend?.language)}</p>
            </div>
          </div>
          <hr className="userInfo-divider" />
          <div className="center">
            <span>내 소개</span>
            <p>{friend?.description ?? "아직 소개글을 작성하지 않았어요."}</p>
          </div>
          <hr className="userInfo-divider" />
          <div className="bottom">
            <span>최근 게시글</span>
            {latestPosts?.map((post) => (
              <Link
                className="link postLink"
                key={post._id}
                to={`/community/forum/${post._id}`}
              >
                <p>{post.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
