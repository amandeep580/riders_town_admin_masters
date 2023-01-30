import React from "react";

const profile = ({ className, onClick, height, width, fill }) => {
  return (
    <svg
      onClick={onClick}
      className={className}
      width={width ? width : "38px"}
      height={height ? height : "41px"}
      viewBox="0 0 38 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.1138 3.29813C23.1551 3.24395 23.2066 3.19909 23.265 3.16628C23.3235 3.13348 23.3877 3.11341 23.4539 3.1073C23.52 3.10119 23.5866 3.10916 23.6497 3.13074C23.7128 3.15231 23.771 3.18703 23.8208 3.23279L25.6244 4.89062L19.9472 12.2917H23.7092L27.8334 6.918L31.0686 9.89271C31.1642 9.98084 31.2231 10.1044 31.2326 10.2372C31.2421 10.3699 31.2015 10.5012 31.1195 10.6032L29.7682 12.2917H33.5752C34.0468 11.5719 34.2498 10.6973 34.1459 9.83244C34.042 8.96757 33.6385 8.17212 33.0112 7.59583L25.7654 0.933875C25.4159 0.612931 25.0072 0.369643 24.5645 0.218868C24.1217 0.0680933 23.6541 0.0129969 23.1902 0.0569441C22.7264 0.100891 22.276 0.242959 21.8665 0.474472C21.4571 0.705984 21.0972 1.02208 20.8089 1.40346L12.578 12.2917H16.3184L23.1138 3.29813V3.29813ZM26.8229 26.5833C26.4334 26.5833 26.0598 26.7447 25.7844 27.0318C25.5089 27.319 25.3542 27.7085 25.3542 28.1146C25.3542 28.5207 25.5089 28.9102 25.7844 29.1973C26.0598 29.4845 26.4334 29.6458 26.8229 29.6458H30.7396C31.1291 29.6458 31.5027 29.4845 31.7781 29.1973C32.0536 28.9102 32.2083 28.5207 32.2083 28.1146C32.2083 27.7085 32.0536 27.319 31.7781 27.0318C31.5027 26.7447 31.1291 26.5833 30.7396 26.5833H26.8229ZM3.8125 12.8021C3.8125 12.396 3.96724 12.0065 4.24269 11.7193C4.51813 11.4322 4.89171 11.2708 5.28125 11.2708H11.4069L13.7412 8.20833H5.28125C4.11264 8.20833 2.99189 8.69232 2.16556 9.55381C1.33923 10.4153 0.875 11.5837 0.875 12.8021V34.2396C0.875 35.9994 1.54555 37.6872 2.73914 38.9315C3.93273 40.1759 5.55159 40.875 7.23958 40.875H30.7396C32.4276 40.875 34.0464 40.1759 35.24 38.9315C36.4336 37.6872 37.1042 35.9994 37.1042 34.2396V20.9688C37.1042 19.2089 36.4336 17.5212 35.24 16.2768C34.0464 15.0324 32.4276 14.3333 30.7396 14.3333H5.28125C4.89171 14.3333 4.51813 14.172 4.24269 13.8848C3.96724 13.5977 3.8125 13.2082 3.8125 12.8021ZM3.8125 34.2396V17.1345C4.27271 17.304 4.76621 17.3958 5.28125 17.3958H30.7396C32.6313 17.3958 34.1667 18.9965 34.1667 20.9688V34.2396C34.1667 35.1872 33.8056 36.096 33.1629 36.766C32.5202 37.4361 31.6485 37.8125 30.7396 37.8125H7.23958C6.33066 37.8125 5.45897 37.4361 4.81627 36.766C4.17357 36.096 3.8125 35.1872 3.8125 34.2396Z"
        fill="white"
      />
    </svg>
  );
};

export default profile;