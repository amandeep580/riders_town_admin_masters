import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, getDocs, doc, getDoc } from "firebase/firestore";
import Db from "../../firebaseConfig";
import Icons from "../../utility/icons/icons";
import styles from "./index.module.scss";
import moment from "moment";

const Index = ({ onBack, amount, user, paymentFor, ...props }) => {
  const [payUser, setPayUser] = useState({});
  useEffect(() => {
    const getData = async () => {
      const userData = await getDoc(user);
      if (userData.exists()) {
        setPayUser(userData.data());
      }
    };
    getData();
  }, []);
  return (
    <section className={styles.payment}>
      <h1 className={styles.head}>
        <Icons onClick={onBack} className={styles.back} name="backIcon" fill="#fcb205" /> Payment
      </h1>
      <article className={styles.paymentUser}>
        <div className={styles.userImage}>
          <img src={payUser?.profileImageURL || "./profile.svg"} alt="user" />
          <h3 className={styles.userName}>{payUser.name || "-NA-"}</h3>
        </div>
        <div className={styles.userDetails}>
          <div className={styles.info}>
            <h3>name</h3>
            <p>{payUser.name || "-NA-"}</p>
          </div>
          <div className={styles.info}>
            <h3>email</h3>
            <p>{payUser.email || "-NA-"}</p>
          </div>
          <div className={styles.info}>
            <h3>phone</h3>
            <p>{payUser.number || "-NA-"}</p>
          </div>
          <div className={styles.info}>
            <h3>Address</h3>
            <p>{payUser.address || "-NA-"}</p>
          </div>
          <div className={styles.info}>
            <h3>Gender</h3>
            <p>{payUser.gender || "-NA-"}</p>
          </div>
          <div className={styles.info}>
            <h3>Date of Birth</h3>
            <p>{(payUser.Dob && moment(payUser.dob).format("LLL").slice(0, -8)) || "-NA-"}</p>
          </div>
          <div className={styles.info}>
            <h3>Payment For</h3>
            <p>{paymentFor || "-NA-"}</p>
          </div>
        </div>
        <div />
        <div className={styles.amount}>
          <h3>Amount</h3>
          <p>₹{amount || "-NA-"}</p>
        </div>
      </article>
    </section>
  );
};

export default Index;
