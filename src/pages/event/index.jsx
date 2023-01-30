import React, { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import Db from "../../firebaseConfig";
import Slider from "react-slick";
import suggestions from "../../data/events.js";
import Icons from "../../utility/icons/icons";
import styles from "./index.module.scss";

const Index = ({ events: data, onBack, profileData }) => {
  const [priority, setPriority] = useState(data[0]?.priority);
  const [values, setValues] = useState(data[0]);
  const priorityArray = new Array(15).fill(0);
  const images = data[0]?.images;
  const openImage = url => window.open(url);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <Icons name="backIcon" fill="#fcb205" />,
    prevArrow: <Icons rotate name="backIcon" fill="#fcb205" />,
  };
  const updatePriority = async () => {
    const docRef = doc(Db, `/EventsDatabase/${values.id}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      data.priority = parseInt(priority);
      await updateDoc(docRef, data);
      toast.success("Priority Updated");
      data.priority = data.priority.toString();
      setValues({ ...values, ...data });
    } else {
      console.log("no data");
    }
  };
  const handleCancel = async id => {
    const docRef = doc(Db, `/EventsDatabase/${id}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = { ...docSnap.data(), status: "Cancelled" };
      updateDoc(docRef, data).then(toast.success("Event Cancelled"));
    }
    setTimeout(() => onBack(), 1000);
  };
  return (
    <>
      <ToastContainer />
      <article className={styles.suggest}>
        <h2 className={styles.heading}>
          <Icons onClick={() => onBack()} className={styles.back} name="backIcon" fill="#fcb205" />
          Event Details
        </h2>
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.container}>
              {images?.length > 2 && (
                <div className={styles.images}>
                  <Slider {...settings}>
                    {images?.map(image => (
                      <div>
                        <img
                          key={image}
                          className={styles.image}
                          src={image || ""}
                          onClick={() => openImage(image || "")}
                          alt=""
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              )}
              {images?.length <= 2 && (
                <div className={styles.images}>
                  {images?.map(image => (
                    <div>
                      <img
                        key={image}
                        className={styles.image}
                        src={image || ""}
                        onClick={() => openImage(image || "")}
                        alt=""
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.values}>
                {suggestions.map(({ name, value }) => (
                  <div>
                    <h2 className={styles.name}>{name}</h2>
                    <div>
                      {(name === "Time" && new Date(values[value]).toLocaleTimeString()) ||
                        (value === "dateTime" && new Date(values[value]).toISOString().split("T")[0]) ||
                        values[value] + " " ||
                        "-NA-"}
                    </div>
                  </div>
                ))}

                <div>
                  <h2 className={styles.name}>Priority</h2>
                  <select value={priority} onChange={e => setPriority(e.target.value)} className={styles.select}>
                    {priorityArray.map((priority, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                  {priority !== values.priority && (
                    <button onClick={() => updatePriority()} className={styles.updateButton}>
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.users}>
              <h4 className={styles.number}>{`${
                profileData?.length < 10 ? "0" + profileData.length : profileData.length
              }`}</h4>
              <h2>Registered Users</h2>
            </div>
            <div className={styles.usersDetails}>
              <h3>Registered Users</h3>
              {profileData.map(({ name, profileImageURL }) => (
                <div className={styles.profile}>
                  <img className={styles.image} src={profileImageURL} alt="" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
      <button
        onClick={() => handleCancel(values?.id)}
        disabled={values?.status === "Cancelled"}
        className={`${styles.cancel} ${values?.status === "Cancelled" && styles.disabled}`}
      >
        Cancel Event
      </button>
    </>
  );
};

export default Index;
