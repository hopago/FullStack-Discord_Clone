import { timeAgoFromNow } from "../../../../lib/moment/timeAgo";
import ArrowRight from "../../navbar/assets/ArrowRight";
import DefaultBanner from "./banner/DefaultBanner";
import "./profile.scss";
import js from "../assets/language/js_lang.png";
import react from "../assets/language/react.png";
import next from "../assets/language/next.png";
import { useEffect, useRef, useState } from "react";
import { useUpdateUserMutation } from "../../../../features/users/slice/usersApiSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../lib/firebase/config/firebase";
import { useLogOutMutation } from "../../../../features/authentication/slice/authApiSlice";
import { useDispatch } from "react-redux";
import { logOut } from "../../../../features/authentication/slice/authSlice";
import { apiSlice } from "../../../../features/authentication/api/apiSlice";
import { useNavigate } from "react-router-dom";
import { persistor } from "../../../../lib/redux/store";
import { socket } from "../../../..";

const Profile = ({ currentUser, setShowProfile, showProfile }) => {
  const inputRef = useRef();

  const description =
    currentUser.description ?? "소개글을 아직 작성하지 않았어요.";

  const [showProfileEditLabel, setShowProfileEditLabel] = useState(false);
  const [editUserProfile, setEditUserProfile] = useState(false);
  const [showAvatarEditLabel, setShowAvatarEditLabel] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState({
    _id: currentUser._id,
    userName: currentUser.userName,
    description: currentUser.description ?? null,
    language: currentUser.language,
  });
  const [height, setHeight] = useState();
  const [updatedAvatar, setUpdatedAvatar] = useState({ avatar: null });
  const [updatedBanner, setUpdatedBanner] = useState({ banner: null });

  const [updateUserInfo] = useUpdateUserMutation();
  const [logout] = useLogOutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateUserAvatar = async () => {
    try {
      let { avatar: file } = updatedAvatar;
      console.log(file.name);

      const imageRef = ref(
        storage,
        `users/images/${
          file.name + new Date().getSeconds() + new Date().getTime()
        }`
      );

      const snapshot = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      await updateUserInfo({ ...updatedUserInfo, avatar: url }).unwrap();
      setUpdatedAvatar({ avatar: null });
    } catch (err) {
      console.error(err);
      setUpdatedAvatar({ avatar: null });
    }
  };
  const updateUserBanner = () => {
    let { banner: file } = updatedBanner;

    console.log(file.name);

    if (file === null) return console.error("Something went wrong in state...");

    const imageRef = ref(
      storage,
      `users/images/${
        file.name + new Date().getSeconds() + new Date().getTime()
      }`
    );

    uploadBytes(imageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            updateUserInfo({ ...updatedUserInfo, banner: url })
              .unwrap()
              .then(setUpdatedBanner({ banner: null }))
              .catch((err) => {
                console.error(err);
                setUpdatedBanner({ banner: null });
              });
          })
          .catch((err) => {
            console.error(err);
            setUpdatedBanner({ banner: null });
          });
      })
      .catch((err) => {
        console.error(err);
        setUpdatedBanner({ banner: null });
      });
  };
  const handleInputsUpdate = () => {
    const currentUserAvatarUrl = currentUser.avatar ?? null;
    const currentUserBanner = currentUser.banner ?? null;

    updateUserInfo({
      ...updatedUserInfo,
      avatar: currentUserAvatarUrl,
      banner: currentUserBanner,
    })
      .unwrap()
      .then(
        setUpdatedUserInfo({
          _id: currentUser._id,
          userName: currentUser.userName,
          description: currentUser.description ?? null,
          language: currentUser.language,
        })
      )
      .then(
        setEditUserProfile(false)
      )
      .catch((err) => {
        console.error(err);
        setUpdatedUserInfo({
          _id: currentUser._id,
          userName: currentUser.userName,
          description: currentUser.description ?? null,
          language: currentUser.language,
        });
      });
  };

  const handleLogout = () => {
    logout()
      .unwrap()
      .then(async (res) => {
        console.log(res);
        if (res.status === 204) {
          try {
            await persistor.purge();
            socket.emit("logout", currentUser._id);
            dispatch(logOut());
            dispatchEvent(apiSlice.util.resetApiState());
            localStorage.removeItem("persist");
          } catch (err) {
            console.error(err);
          }
        } else {
          console.error("Something went wrong in logout...");
        }
      })
      .catch((err) => console.error(err));

    navigate("/");
  };

  const handleBannerChanged = (e) => {
    setUpdatedBanner((prev) => ({ ...prev, banner: e.target.files[0] }));
  };
  const handleAvatarChanged = (e) => {
    setUpdatedAvatar((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const LanguageImg = () => {
    if (currentUser.language === "javascript")
      return <img src={js} alt="" className="language" />;
    if (currentUser.language === "react")
      return <img src={react} alt="" className="language" />;
    if (currentUser.language === "next")
      return <img src={next} alt="" className="language" />;
  };
  const ProfileEditLabel = (
    <div className="profileEditLabel">
      <div className="editLabelWrapper">
        <span>프로필 편집</span>
      </div>
    </div>
  );
  const EditUserLanguage = () => {
    const [showSelectForm, setShowSelectForm] = useState(false);

    const handleLanguageAttribute = (name) => {
      setUpdatedUserInfo((prev) => ({ ...prev, language: name }));
    };

    const handleChangeLanguage = (e) => {
      handleLanguageAttribute(e.target.innerHTML.toLowerCase());

      setShowSelectForm((prev) => !prev);
    };

    return (
      <div className="languageWrapper" onClick={() => setShowSelectForm(true)}>
        <div className="row">
          <p>
            {currentUser.language !== updatedUserInfo.language
              ? updatedUserInfo.language
              : currentUser.language}
          </p>
          <ArrowRight
            showSelectForm={showSelectForm}
            setShowSelectForm={setShowSelectForm}
          />
        </div>
        {showSelectForm && (
          <div className="selectForm">
            <div className="wrapper">
              <div className="itemsContainer">
                <div className="item">
                  <div
                    className="selectedLanguage_javascript"
                    name="javascript"
                    value="javascript"
                    onClick={handleChangeLanguage}
                  >
                    <span>Javascript</span>
                  </div>
                </div>
                <div className="item">
                  <div
                    className="selectedLanguage_react"
                    value="react"
                    name="react"
                    onClick={handleChangeLanguage}
                  >
                    <span>React</span>
                  </div>
                </div>
                <div
                  className="item"
                  value="next"
                  name="next"
                  onClick={handleChangeLanguage}
                >
                  <div className="selectedLanguage_next">
                    <span>Next</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  const avatarEditLabel = (
    <div className="avatarEditText">
      <span>
        프로필
        <br />
        이미지 수정
      </span>
    </div>
  );

  const handleProfilePopoutOutsideClicked = (e) => {
    if (e.target.closest(".currUserProfileWrapper")) {
      return;
    }
    
    const { screenX, screenY } = e;

    const isOutsideClick =
      screenX > 2325 ||
      screenX < 1985 ||
      screenY < (editUserProfile ? 630 : 630 + height);

    if (isOutsideClick) {
      const updatedUserInfo = {
        _id: currentUser._id,
        userName: currentUser.userName,
        description: currentUser.description ?? null,
        language: currentUser.language,
      };

      setUpdatedUserInfo(updatedUserInfo);
      setShowProfileEditLabel(false);
      setEditUserProfile(false);
      setShowAvatarEditLabel(false);
      setShowProfile(false);
    }
  };

  useEffect(() => {
    console.log(updatedAvatar.avatar);
    if (updatedAvatar.avatar) {
      updateUserAvatar();
    }
  }, [updatedAvatar.avatar]);

  useEffect(() => {
    if (updatedBanner.banner) {
      updateUserBanner();
    }
  }, [updatedBanner.banner])
 
  useEffect(() => {
    window.addEventListener("click", handleProfilePopoutOutsideClicked);

    return () => {
      window.removeEventListener("click", handleProfilePopoutOutsideClicked);
    };
  }, [showProfile]);

  useEffect(() => {
    if (description.length <= 24) {
      return setHeight(20);
    } else if (description.length <= 48) {
      return setHeight(40);
    } else {
      return setHeight(60);
    }
  }, [description]);

  return (
    <div
      className="accountProfile"
      style={
        editUserProfile
          ? { top: `-495px` }
          : { top: `-${(431 + height).toString()}px` }
      }
    >
      <div className="wrapper">
        <DefaultBanner
          setShowProfileEditLabel={setShowProfileEditLabel}
          setEditUserProfile={setEditUserProfile}
          editUserProfile={editUserProfile}
          handleBannerChanged={handleBannerChanged}
          handleInputsUpdate={handleInputsUpdate}
        />
        <label
          className="avatarImageWrapper"
          onMouseEnter={() => setShowAvatarEditLabel(true)}
          onMouseLeave={() => setShowAvatarEditLabel(false)}
          htmlFor="popoutImg"
        >
          <img className="popout_userAvatar" src={currentUser.avatar} alt="" />
          {showAvatarEditLabel && avatarEditLabel}
        </label>
        <input id="popoutImg" type="file" onChange={handleAvatarChanged} />
        {showProfileEditLabel && ProfileEditLabel}
        <div className="languageImgWrapper">
          <LanguageImg />
        </div>
        <div className="userInfo">
          <div className="userInfoWrapper">
            <section className="top">
              <div className="col">
                {editUserProfile ? (
                  <input
                    className="userNameInput"
                    autoFocus={editUserProfile}
                    ref={inputRef}
                    type="text"
                    onChange={(e) =>
                      setUpdatedUserInfo((prev) => ({
                        ...prev,
                        userName: e.target.value,
                      }))
                    }
                    style={{ maxWidth: "100%" }}
                    value={updatedUserInfo.userName}
                  />
                ) : (
                  <h2>{currentUser.userName}</h2>
                )}
                {editUserProfile ? (
                  <EditUserLanguage />
                ) : (
                  <p>{currentUser.language}</p>
                )}
              </div>
              <hr className="divider" />
            </section>
            <section className="center">
              <div className="description">
                <h2>내 소개</h2>
                <p>
                  {editUserProfile ? (
                    <textarea
                      cols={3}
                      type="text"
                      onChange={(e) =>
                        setUpdatedUserInfo((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      maxLength="72"
                      value={updatedUserInfo.description}
                    />
                  ) : (
                    currentUser.description ??
                    "소개글을 아직 작성하지 않았어요."
                  )}
                </p>
              </div>
              <div className="date">
                <h2>
                  <strong>DEVBOARD</strong> 가입 시기:
                </h2>
                <p>{timeAgoFromNow(currentUser.createdAt)}</p>
              </div>
              <hr className="divider" />
            </section>
            <section className="bottom">
              <div className="row">
                <div className="fill" />
                <div className="grow">온라인</div>
                <ArrowRight />
              </div>
              <div className="row">
                <div className="grow" onClick={handleLogout}>
                  로그아웃
                </div>
                <ArrowRight />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
