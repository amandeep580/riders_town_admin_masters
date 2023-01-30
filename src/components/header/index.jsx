import React from "react";
import styles from "./index.module.scss";

const Index = ({ onForgotPassword }) => (
  <header className={styles.header}>
    <h2 className={styles.heading} onClick={() => onForgotPassword()}>
      Admin Panel
    </h2>
  </header>
);

export default Index;
