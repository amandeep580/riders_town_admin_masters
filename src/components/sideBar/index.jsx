import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import Navigation from "../../data/navigation";
import Icons from "../../utility/icons/icons";
import scrollToTop from "../../utility/helper/scrollToTop";
import styles from "./index.module.scss";
import { auth } from "../../firebaseConfig";
import Cookies from "universal-cookie";

const Index = props => {
  const history = useHistory();
  const location = useLocation();
  const cookies = new Cookies();
  const [active, setActive] = useState(location.pathname.substring(1));
  useEffect(() => {
    scrollToTop();
    setActive(location.pathname.substring(1));
  }, [location.pathname]);
  const logout = async () => {
    cookies.remove("created");
    await signOut(auth);
    props.onHeader(true);
    props.auth(false);
    window.location.reload();
    history.replace("/login");
  };
  const handleNav = name => {
    if (name !== "logout") {
      scrollToTop();
      setActive(name);
      history.push(name);
    }
    name === "logout" && logout();
  };
  const navList = Navigation.map(({ name, id, route }) => (
    <li onClick={() => handleNav(route)} className={active === route ? styles.active : styles.item} key={id}>
      <Icons className={styles.icon} height="25" width="25" name={route.toLowerCase()} /> {name}
    </li>
  ));
  return (
    <header className={styles.sidebar}>
      <div className={styles.head}>
        {/* <img src=".//Place Marker.png" alt="" h÷eight="50" /> */}
        <Icons name="logo" fill="#FCB205" />
        <h2 onClick={() => {}} className={styles.heading}>
          Riders <span>Town</span>
        </h2>
      </div>
      <nav className={styles.navigationList}>{navList}</nav>
    </header>
  );
};

export default Index;
