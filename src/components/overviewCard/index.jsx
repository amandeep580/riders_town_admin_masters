import React from "react";
import { useHistory } from "react-router-dom";
import scrollToTop from "../../utility/helper/scrollToTop";
import Icons from "../../utility/icons/icons";
import styles from "./index.module.scss";
const Index = ({ name, icon, href, id, active, ...props }) => {
  const history = useHistory();
  return (
    <article
      onClick={() => {
        history.push(href.toLowerCase());
        scrollToTop();
      }}
      className={styles.card}
    >
      <Icons className={styles.icon} name={icon.toLowerCase()} height="35" width="35" />
      <h2 className={styles.heading}>{name}</h2>
      <p className={styles.active}>
        {/* TODO:: fix the with the actual data */}
        {active} <span>{props.length[name.toLowerCase()]}</span>
      </p>
    </article>
  );
};

export default Index;
