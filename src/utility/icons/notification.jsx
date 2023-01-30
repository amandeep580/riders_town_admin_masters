import React from "react";

const profile = ({ className, onClick, height, width, fill }) => {
  return (
    <svg
      onClick={onClick}
      className={className}
      width={width ? width : "36px"}
      height={height ? height : "41px"}
      viewBox="0 0 36 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.292 3.49597C14.5908 2.75739 15.1034 2.12488 15.764 1.67952C16.4247 1.23415 17.2033 0.996216 18 0.996216C18.7967 0.996216 19.5753 1.23415 20.236 1.67952C20.8966 2.12488 21.4092 2.75739 21.708 3.49597C24.6655 4.30934 27.2742 6.07108 29.1335 8.51064C30.9928 10.9502 31.9999 13.9327 32 17V26.394L35.664 31.89C35.865 32.1912 35.9804 32.5413 35.9979 32.9029C36.0155 33.2646 35.9346 33.6242 35.7637 33.9435C35.5929 34.2628 35.3386 34.5297 35.028 34.7157C34.7174 34.9018 34.3621 35 34 35H24.93C24.6892 36.6662 23.8561 38.1898 22.5834 39.2918C21.3107 40.3939 19.6835 41.0004 18 41.0004C16.3165 41.0004 14.6893 40.3939 13.4166 39.2918C12.1439 38.1898 11.3108 36.6662 11.07 35H1.99999C1.63791 35 1.2826 34.9018 0.971976 34.7157C0.661352 34.5297 0.407066 34.2628 0.236246 33.9435C0.0654268 33.6242 -0.0155167 33.2646 0.00205052 32.9029C0.0196177 32.5413 0.135037 32.1912 0.335994 31.89L3.99999 26.394V17C3.99999 10.552 8.35999 5.11997 14.292 3.49597ZM15.172 35C15.3786 35.5853 15.7616 36.0921 16.2682 36.4506C16.7749 36.8091 17.3803 37.0016 18.001 37.0016C18.6217 37.0016 19.2271 36.8091 19.7337 36.4506C20.2404 36.0921 20.6234 35.5853 20.83 35H15.17H15.172ZM18 6.99997C15.3478 6.99997 12.8043 8.05354 10.9289 9.9289C9.05356 11.8043 7.99999 14.3478 7.99999 17V27C8.00008 27.395 7.88317 27.7813 7.66399 28.11L5.73799 31H30.26L28.334 28.11C28.1155 27.781 27.9993 27.3948 28 27V17C28 14.3478 26.9464 11.8043 25.0711 9.9289C23.1957 8.05354 20.6522 6.99997 18 6.99997Z"
        fill="white"
      />
    </svg>
  );
};

export default profile;
