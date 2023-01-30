import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import Events from "../../components/events";
import Rides from "../../components/rides";
import styles from "./index.module.scss";

const Index = () => {
  const [active, setActive] = useState("ride");

  return (
    <section className={styles.create}>
      <ToastContainer />
      <h1 className={styles.head}>Create</h1>
      <button onClick={() => setActive("ride")} className={active === "ride" ? styles.activeDetails : styles.details}>
        Ride
      </button>
      <button
        onClick={() => setActive("events")}
        className={active === "events" ? styles.activeDetails : styles.details}
      >
        Events
      </button>
      {active === "ride" && <Rides />}
      {active === "events" && <Events />}
    </section>
  );
};

export default Index;
