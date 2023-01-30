import React from "react";
const icons = ({ height, width, fill, className, onClick }) => {
  return (
    <svg
      className={className}
      onClick={onClick}
      width={width ? width : "16"}
      height={height ? height : "14"}
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.255741 7.27702L6.0339 13.0553C6.19885 13.2203 6.41868 13.3108 6.65308 13.3108C6.88775 13.3108 7.10746 13.2201 7.2724 13.0553L7.79701 12.5306C7.96182 12.3659 8.05262 12.1459 8.05262 11.9114C8.05262 11.677 7.96182 11.4496 7.79701 11.2849L4.42611 7.90661L15.1356 7.90661C15.6185 7.90661 16 7.52859 16 7.04561L16 6.30376C16 5.82077 15.6185 5.40465 15.1356 5.40465L4.38787 5.40464L7.79688 2.00747C7.96169 1.84253 8.05249 1.62855 8.05249 1.39401C8.05249 1.15974 7.96169 0.942633 7.79688 0.777821L7.27227 0.254769C7.10733 0.0898268 6.88762 -5.80171e-05 6.65296 -5.80376e-05C6.41855 -5.80581e-05 6.19872 0.0909968 6.03378 0.255939L0.25561 6.0341C0.0902783 6.19956 -0.000647896 6.42044 3.44287e-06 6.65523C-0.00051633 6.89081 0.0902782 7.11182 0.255741 7.27702Z"
        fill={fill ? fill : "#2127C2"}
      />
    </svg>
  );
};

export default icons;
