import React, { useEffect, useState } from "react";
import suggestions from "../../data/suggestions.js";
import styles from "./index.module.scss";
import Icons from "../../utility/icons/icons";
import Slider from "react-slick";
import { doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import Db from "../../firebaseConfig";
import Button from "../../components/button";

const Index = ({ data, onBack }) => {
  const priorityArray = new Array(15).fill(0);
  const [priority, setPriority] = useState(data[0]?.priority);
  const [values, setValues] = useState(data[0]);
  const [user, setUser] = useState(null);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <Icons name="backIcon" fill="#fcb205" />,
    prevArrow: <Icons rotate name="backIcon" fill="#fcb205" />,
  };
  // const values = data[0];
  const images = data[0]?.images;
  const openImage = url => window.open(url);
  const handleDelete = () => {
    deleteDoc(doc(Db, "Suggestion", data[0]?.id)).then(() => {
      toast.success("Deleted Successfully");
      setTimeout(() => {
        onBack();
      }, 1000);
    });
  };
  const updatePriority = async () => {
    const docRef = doc(Db, `/Suggestion/${values.id}`);
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
  useEffect(() => {
    const getUser = async () => {
      const dataRef = doc(Db, `/UserData/ProfileDatabase/${data[0]?.postedBy}/ProfileData`);
      const user = await getDoc(dataRef);
      if (user.exists()) {
        setUser(user.data());
      } else {
        setUser(null);
      }
    };
    getUser();
  }, [data]);

  return (
    <article className={styles.suggest}>
      <ToastContainer />
      <h2 className={styles.heading}>
        <Icons onClick={() => onBack()} className={styles.back} name="backIcon" fill="#fcb205" />
        Suggestion Details
      </h2>
      {user && <h1>posted by</h1>}{" "}
      {user && (
        <div className={styles.grid}>
          <img src={user?.profileImageURL || "./profile.svg"} alt="" />
          <div className={styles.info}>
            <div>
              <h3>name</h3>
              <p>{user?.name}</p>
            </div>
            <div>
              <h3>email</h3>
              <p>{user?.email}</p>
            </div>
            <div>
              <h3>number</h3>
              <p>{user?.number}</p>
            </div>
            <div>
              <h3>gender</h3>
              <p>{user?.gender}</p>
            </div>
            <div>
              <h3>address</h3>
              <p>{user?.address}</p>
            </div>
          </div>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.images}>
          {images?.length > 2 && (
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
          )}
          {images?.length <= 2 && (
            <div className={styles.flex}>
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
        </div>
        <div className={styles.grid}>
          {suggestions.map(({ name, value }) => (
            <div>
              <h2 className={styles.name}>{name}</h2>
              <div>
                {(value === "postedOn" && new Date(values[value])?.toLocaleDateString("en-US")) ||
                  (value === "offered" && values[value] + " ") ||
                  values[value] ||
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
      <Button onClick={() => handleDelete()} buttonType="primary">
        Delete Suggestion
      </Button>
    </article>
  );
};

export default Index;
