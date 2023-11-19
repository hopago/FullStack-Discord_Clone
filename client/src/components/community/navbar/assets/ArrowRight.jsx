import React from 'react'

const ArrowRight = ({ showSelectForm, setShowSelectForm }) => {
  return (
    <svg
      class="caret_ce50ce"
      aria-hidden="true"
      role="img"
      width="11"
      height="11"
      viewBox="0 0 24 24"
      onClick={() => setShowSelectForm(false)}
      style={
        showSelectForm
          ? { color: "#b5bac1", cursor: "pointer", transform: "rotate(180deg)" }
          : { color: "#b5bac1", cursor: "pointer" }
      }
    >
      <g fill="none" fill-rule="evenodd">
        <polygon
          fill="currentColor"
          fill-rule="nonzero"
          points="8.47 2 6.12 4.35 13.753 12 6.12 19.65 8.47 22 18.47 12"
        ></polygon>
        <polygon points="0 0 24 0 24 24 0 24"></polygon>
      </g>
    </svg>
  );
};

export default ArrowRight;
