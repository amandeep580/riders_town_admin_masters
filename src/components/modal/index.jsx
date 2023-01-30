import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import Button from "../button";
import styles from "./index.module.scss";

const Index = props => {
  const success = "success";
  const fail = "fail";
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const handlePassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setModal(success);
        // Password reset email sent!
        // ..
      })
      .catch(error => {
        setModal(fail);
        setErrors({
          email: error.message,
        });
        // ..
      });
  };
  return (
    <>
      {!modal && (
        <section className={styles.modal}>
          <header className={styles.header}>
            <h2 className={styles.heading}>Forgot Password ?</h2>
          </header>
          <article className={styles.modalBody}>
            <p className={styles.content}>Enter your registered Email ID and a link will be sent to your account.</p>
            <input className={styles.input} onChange={e => setEmail(e.target.value)} type="text" />
            <Button onClick={() => handlePassword()} className={styles.button} buttonType="primary">
              Send
            </Button>
          </article>
        </section>
      )}
      {modal === success && (
        <section className={styles.modal}>
          <header className={styles.header}>
            <h2 className={styles.heading}>Forgot Password ?</h2>
          </header>
          <article className={styles.modalBody}>
            <p className={styles.content}>
              A forgot password link has been sent to your registered Email ID.
              <br /> Please check your Email ID to confirm.
            </p>
            <Button onClick={() => props?.setForgotPassword(false)} className={styles.button} buttonType="primary">
              Login
            </Button>
          </article>
        </section>
      )}
      {modal === fail && (
        <section className={styles.modal}>
          <header className={styles.header}>
            <h2 className={styles.heading}>Forgot Password ?</h2>
          </header>
          <article className={styles.modalBody}>
            <h4 className={styles.error}>Invalid Email ID</h4>
            <p className={styles.content}>{errors?.email}</p>
            <Button onClick={() => setModal(false)} className={styles.button} buttonType="primary">
              Try Again
            </Button>
          </article>
        </section>
      )}
    </>
  );
};

export default Index;
