import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from "react-toastify";
import Button from "../../components/button";
import Loader from "../../components/loader";
import styles from "./index.module.scss";
import authCheck from "../../utility/helper/authCheck";
const moment = require("moment");

const Index = props => {
  const history = useHistory();
  const cookies = new Cookies();
  const [loader, setLoader] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const login = async () => {
    setLoader(true);
    try {
      const result = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      result._tokenResponse.registered && handleForm();
      cookies.set("created", moment(parseInt(result?.user?.metadata?.lastLoginAt)).add("1", "hour").unix(), {
        path: "/",
      });
    } catch (error) {
      toast.error(error.message.substring(10));
    }
    setLoader(false);
  };

  useEffect(() => {
    auth.onAuthStateChanged(async user => {
      if (user) (await authCheck()) && handleForm();
    });
  }, [auth]);

  const handleForm = () => {
    props.onHeader(false);
    props.login(true);
    props.auth(true);
    history.replace("/dashboard");
  };
  return (
    <>
      <ToastContainer />
      {loader && <Loader />}
      {!loader && (
        <section className={styles.login}>
          <div className={styles.head}>
            <img src="./Place Marker.png" alt="logo" />
            <h3 className={styles.heading}>
              Riders <span>Town</span>
            </h3>
          </div>
          <div className={styles.inputField}>
            <label className={styles.labels} htmlFor="email">
              Email ID
            </label>
            <input
              className={styles.input}
              value={loginEmail}
              onChange={e => setLoginEmail(e.currentTarget.value)}
              id="email"
              name="email"
              type="text"
              required
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.labels} htmlFor="password">
              Password
            </label>
            <input
              className={styles.input}
              onChange={e => setLoginPassword(e.currentTarget.value)}
              id="password"
              name="password"
              type="password"
              required
            />
          </div>
          <Button buttonType="primary" onClick={login}>
            Login
          </Button>
          <span onClick={() => props.onForgotPassword(true)} className={styles.forgot}>
            Forgot Password ?
          </span>
        </section>
      )}
    </>
  );
};

export default Index;
