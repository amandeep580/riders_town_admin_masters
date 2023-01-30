import React, { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import Db from "../../firebaseConfig";
import moment from "moment";
import keyGenerator from "../../utility/helper/keyGenerator";
import { toast } from "react-toastify";
import capitalize from "../../utility/helper/capitalize";
import styles from "./index.module.scss";

const Index = () => {
  const storage = getStorage();
  const [cost, setCost] = useState("0");
  const [files, setFiles] = useState({});
  const [date, setDate] = useState("");
  const [dateTime, setDateTime] = useState(null);
  const [time, setTime] = useState("");
  const [filesLength, setFilesLength] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uid, setUid] = useState("");
  const [venue, setVenue] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [images, setImages] = useState([]);
  const [payment, setPayment] = useState(false);
  const [include, setInclude] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setFiles({});
    setDate("");
    setDateTime(null);
    setTime("");
    setFilesLength(false);
    setName("");
    setDescription("");
    setUid("");
    setImages([]);
    setVenue("");
    setOrganizer("");
    setPayment(false);
    setInclude([]);
    setCost("0");
    setLoading(false);
    setUid(keyGenerator(20));
  };

  useEffect(() => setUid(keyGenerator(20)), []);
  useEffect(() => {
    const setData = () => {
      if (filesLength === images.length && filesLength !== 0) {
        sendData();
      }
    };
    setData();
  }, [images]);
  useEffect(() => {
    let newDateTime = moment(date + " " + time).unix();
    setDateTime(newDateTime);
  }, [date, time]);

  const handleInclude = e => {
    const { checked, name } = e.target;
    let data = [];
    if (checked) {
      data = [...include, name];
      setInclude(data);
    } else {
      data = include.filter(item => item !== name);
      setInclude(data);
    }
  };
  const sendData = async () => {
    const dataRef = doc(Db, "EventsDatabase", uid);
    try {
      setDoc(dataRef, {
        images,
        title: capitalize(name),
        description: capitalize(description),
        dateTime: dateTime * 1000,
        venue: capitalize(venue),
        organizer: capitalize(organizer),
        payment: null,
        includes: include,
        cost: +cost,
        status: "active",
        priority: 15,
      }).then(() => {
        toast.success("Event Created Successfully");
        handleReset();
      });
    } catch (error) {
      toast.error("Something went wrong");
      handleReset();
    }
  };
  const handleImageUpload = e => {
    setFiles(e.target.files);
    setFilesLength(e.target.files.length);
  };
  const handleSubmit = async e => {
    setLoading(true);
    e.preventDefault();
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const storageRef = ref(storage, `/events/${uid}/${index}`);
      uploadBytes(storageRef, file).then(snapshot => {
        getDownloadURL(snapshot.ref).then(async photoURL => {
          await setImages(prev => [...prev, photoURL]);
        });
      });
    }
    if (!filesLength) {
      sendData();
    }
  };
  return (
    <form onSubmit={e => handleSubmit(e)} className={styles.events}>
      <section className={styles.form}>
        <div>
          <label className={styles.fileLabel} htmlFor="file">
            upload images
          </label>
          <span className={styles.span}>{filesLength ? filesLength + "  files Added" : "No file selected"}</span>
          <input
            className={styles.input}
            accept="image/*"
            multiple
            type="file"
            name="file"
            id="file"
            hidden
            onChange={handleImageUpload}
          />
        </div>
        <div></div>
        <div className={styles.inputField}>
          <label className={styles.labels} htmlFor="date">
            Date of Event
          </label>
          <input
            className={styles.input}
            type="date"
            name="date"
            id="date"
            min={new Date().toISOString().split("T")[0]}
            value={date}
            required
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div className={styles.inputField}>
          <label className={styles.labels} htmlFor="time">
            Event Timings
          </label>
          <input
            className={styles.input}
            name="time"
            id="time"
            type="time"
            required
            value={time}
            onChange={e => setTime(e.target.value)}
          />
        </div>
        <div className={styles.inputField}>
          <label className={styles.labels} htmlFor="name">
            Event Name
          </label>
          <input
            className={styles.input}
            name="name"
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className={styles.inputField}>
          <label className={styles.labels} htmlFor="Venue">
            Venue
          </label>
          <input
            className={styles.input}
            name="Venue"
            id="Venue"
            type="text"
            value={venue}
            onChange={e => setVenue(e.target.value)}
          />
        </div>
        <div className={styles.inputField}>
          <label className={styles.labels} htmlFor="Description">
            Description
          </label>
          <input
            className={styles.input}
            name="Description"
            id="Description"
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.inputField}>
          <label className={styles.labels} htmlFor="Organized">
            Organized By
          </label>
          <input
            className={styles.input}
            name="Organized"
            id="Organized"
            value={organizer}
            type="text"
            onChange={e => setOrganizer(e.target.value)}
          />
        </div>
        <div className={styles.girls}>
          <label className={styles.labels} htmlFor="price">
            Price
          </label>
          <label className={`${styles.check} switch`}>
            <input id="price" type="checkbox" checked={payment} onChange={e => setPayment(e.target.checked)} />
            <span className="slider round"></span>
          </label>
        </div>
        <div className={styles.radioButton}>
          <label className={styles.labels} htmlFor="">
            Includes
          </label>
          <div className={styles.check}>
            <label className={styles.labels} htmlFor="Parking">
              <input
                checked={include.includes("Parking")}
                onChange={e => handleInclude(e)}
                name="Parking"
                id="Parking"
                type="checkbox"
              />
              <span>Parking</span>
            </label>
            <label className={styles.labels} htmlFor="Food">
              <input
                checked={include.includes("Food")}
                onChange={e => handleInclude(e)}
                name="Food"
                id="Food"
                type="checkbox"
              />
              <span>Food</span>
            </label>
          </div>
        </div>
        {payment && (
          <div className={styles.inputField}>
            <label className={styles.labels} htmlFor="cost">
              Cost
            </label>
            <input
              className={styles.input}
              value={cost}
              onChange={e => setCost(e.currentTarget.value)}
              id="cost"
              name="cost"
              type="number"
            />
          </div>
        )}
      </section>
      <div className={styles.buttons}>
        <button className={styles.cancel} type="reset" onClick={() => handleReset()}>
          cancel
        </button>
        {loading && (
          <div
            style={{
              transform: "translateX( -50%)",
              left: "55%",
            }}
            className="lds-roller"
          >
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
        <button className={styles.submit} type="submit">
          Create Event
        </button>
      </div>
    </form>
  );
};

export default Index;
