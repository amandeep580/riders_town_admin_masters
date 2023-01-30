import React from "react";

const profile = ({ className, onClick, height, width, fill }) => {
  return (
    <svg
      onClick={onClick}
      className={className}
      width={width ? width : "31px"}
      height={height ? height : "31px"}
      viewBox="0 0 30 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 1.625H12V15.5H1.5V1.625ZM18 1.625H28.5V9.33333H18V1.625ZM18 15.5H28.5V29.375H18V15.5ZM1.5 21.6667H12V29.375H1.5V21.6667Z"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default profile;
