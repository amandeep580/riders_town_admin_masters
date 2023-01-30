import React from "react";

const profile = ({ className, onClick, height, width, fill }) => {
  return (
    <svg
      onClick={onClick}
      className={className}
      width={width ? width : "44px"}
      height={height ? height : "44px"}
      viewBox="0 0 44 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M33.9167 36.6667C35.9417 36.6667 37.5833 35.1743 37.5833 33.3333C37.5833 31.4924 35.9417 30 33.9167 30C31.8916 30 30.25 31.4924 30.25 33.3333C30.25 35.1743 31.8916 36.6667 33.9167 36.6667Z"
        stroke="white"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
      <path
        d="M10.0833 10C12.1083 10 13.75 8.50762 13.75 6.66667C13.75 4.82572 12.1083 3.33333 10.0833 3.33333C8.05825 3.33333 6.41663 4.82572 6.41663 6.66667C6.41663 8.50762 8.05825 10 10.0833 10Z"
        stroke="white"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
      <path
        d="M10.0833 36.6667C12.1083 36.6667 13.75 35.1743 13.75 33.3333C13.75 31.4924 12.1083 30 10.0833 30C8.05825 30 6.41663 31.4924 6.41663 33.3333C6.41663 35.1743 8.05825 36.6667 10.0833 36.6667Z"
        stroke="white"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
      <path
        d="M21.9999 8.33333H30.2499C31.2224 8.33333 32.155 8.68452 32.8426 9.30964C33.5303 9.93476 33.9166 10.7826 33.9166 11.6667V30M10.0833 10V30V10Z"
        stroke="white"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M27.5 13.3333L22 8.33333L27.5 3.33333"
        stroke="white"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default profile;
