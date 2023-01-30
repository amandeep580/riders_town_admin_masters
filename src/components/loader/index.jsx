import React from "react";
import styles from "./index.module.scss";
const index = () => {
  return (
    <section className={styles.loader}>
      <div className={styles.lds_ellipsis}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </section>
  );
};

export default index;
