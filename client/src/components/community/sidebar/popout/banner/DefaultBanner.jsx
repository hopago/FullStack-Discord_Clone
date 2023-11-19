import { Close } from "@mui/icons-material";
import { useState } from "react";
import "./defaultBanner.scss";

const DefaultBanner = ({
  setShowProfileEditLabel,
  setEditUserProfile,
  editUserProfile,
  handleBannerChanged,
}) => {
  const [showBannerEditLabel, setShowBannerEditLabel] = useState(false);

  const editButtons = (
    <div className="absoluteContainer">
      <div className="wrapper">
        <button className="update">수정하기</button>
        <button
          className="cancel"
          onClick={() => setTimeout(function () {
            setEditUserProfile(false);
          }, 150)}
        >
          <Close style={{ fontSize: "14px" }} />
        </button>
      </div>
    </div>
  );

  const bannerEditLabel = (
    <div className="bannerEditText">
      <span>
        배너
        <br />
        이미지 수정
      </span>
    </div>
  );

  return (
    <svg className="bannerSVGWrapper__3e7b0" viewBox="0 0 340 60">
      <mask id="uid_136">
        <rect fill="white" x="0" y="0" width="100%" height="100%"></rect>
        <circle fill="black" cx="62" cy="56" r="46"></circle>
      </mask>
      <foreignObject
        x="0"
        y="0"
        className="container"
        overflow="visible"
        mask="url(#uid_136)"
        onMouseEnter={() => {
          setShowBannerEditLabel(true);
        }}
        onMouseLeave={() => {
          setShowBannerEditLabel(false);
        }}
      >
        <label
          htmlFor="updateBanner"
          className="banner__6d414 popoutBanner__9f5b9"
        >
          <input
            id="updateBanner"
            type="file"
            onChange={handleBannerChanged}
            disabled={editUserProfile}
          />
          {!editUserProfile ? (
            <div className="pencilContainer_d4ce8d" role="button" tabindex="0">
              <svg
                id="editIcon__48e69"
                aria-hidden="false"
                role="img"
                onMouseEnter={() => {
                  setShowBannerEditLabel(false);
                  setShowProfileEditLabel(true);
                }}
                onMouseLeave={() => {
                  setShowBannerEditLabel(true);
                  setShowProfileEditLabel(false);
                }}
                onClick={() => {
                  setShowProfileEditLabel(false);
                  setEditUserProfile(true);
                }}
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M19.2929 9.8299L19.9409 9.18278C21.353 7.77064 21.353 5.47197 19.9409 4.05892C18.5287 2.64678 16.2292 2.64678 14.817 4.05892L14.1699 4.70694L19.2929 9.8299ZM12.8962 5.97688L5.18469 13.6906L10.3085 18.813L18.0201 11.0992L12.8962 5.97688ZM4.11851 20.9704L8.75906 19.8112L4.18692 15.239L3.02678 19.8796C2.95028 20.1856 3.04028 20.5105 3.26349 20.7337C3.48669 20.9569 3.8116 21.046 4.11851 20.9704Z"
                  fill="#f8f8f8"
                ></path>
              </svg>
            </div>
          ) : (
            editButtons
          )}
          {showBannerEditLabel && bannerEditLabel}
        </label>
      </foreignObject>
    </svg>
  );
};

export default DefaultBanner;
