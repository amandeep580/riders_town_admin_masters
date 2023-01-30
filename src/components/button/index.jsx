import React from "react";
import styles from "./index.module.scss";
const index = props => {
  switch (props.buttonType) {
    case "primary":
      return (
        <button onClick={props.onClick} disabled={props.disabled} className={`${props.className} ${styles.primary}`}>
          {props.children}
        </button>
      );

    default:
      return (
        <button onClick={props.onClick} className={props.className}>
          {props.children}
        </button>
      );
  }
};

export default index;
