import React, { useEffect, useState } from "react";
import moment from "moment";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Db from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import keyGenerator from "../../utility/helper/keyGenerator";
import { toast } from "react-toastify";
import styles from "./index.module.scss";
import capitalize from "../../utility/helper/capitalize";

const Index = () => {
  const storage = getStorage();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [uid, setUid] = useState("");
  const [organizedBy, setOrganizedBy] = useState("");
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState({});
  const [girlsOnly, setGirlsOnly] = useState(false);
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [destinationPoint, setDestinationPoint] = useState("");
  const [filesLength, setFilesLength] = useState(null);
  const [distance, setDistance] = useState("");
  const [source, setSource] = useState("");
  const [requirements, setRequirements] = useState("");
  const [rideType, setRideType] = useState("");
  const [rideFor, setRideFor] = useState([]);
  const [dateTime, setDateTime] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => setUid(keyGenerator(20)), []);
  useEffect(() => {
    let newDateTime = moment(date + " " + time).unix();
    setDateTime(newDateTime);
  }, [date, time]);
  const [price, setPrice] = useState(false);
  const handleImageUpload = e => {
    setFiles(e.target.files);
    setFilesLength(e.target.files.length);
  };
  const sendData = async () => {
    const dataRef = doc(Db, "RidesDatabase", uid);
    try {
      setDoc(dataRef, {
        images,
        girlsOnly,
        cost: +cost,
        distance: +distance,
        startPoint: source,
        requirements: capitalize(requirements),
        description: capitalize(description),
        destinationPoint: capitalize(destinationPoint),
        dateTime: dateTime * 1000,
        type: rideType,
        rideFor,
        organizedBy,
        priority: 15,
        status: "active",
        source: capitalize(source),
      }).then(() => {
        toast.success("Ride Created Successfully");
        handleReset();
      });
    } catch (error) {
      toast.error("Error Occurred");
      handleReset();
    }
  };
  const handleSubmit = async e => {
    setLoading(true);
    e.preventDefault();
    for (let index = 0; index < files?.length; index++) {
      const file = files[index];
      const storageRef = ref(storage, `/rides/${uid}/${index}`);
      uploadBytes(storageRef, file).then(snapshot => {
        getDownloadURL(snapshot.ref).then(async photoURL => {
          await setImages(prev => [...prev, photoURL]);
        });
      });
    }
    if (!filesLength) sendData();
  };
  useEffect(() => {
    const setData = async () => {
      if (filesLength === images.length && filesLength !== 0) sendData();
    };

    setData();
  }, [images]);
  const handleReset = () => {
    setDistance("");
    setImages([]);
    setFiles([]);
    setFilesLength(0);
    setGirlsOnly(false);
    setCost("");
    setDescription("");
    setDestinationPoint("");
    setPrice(false);
    setRideType("");
    setDestinationPoint("");
    setUid(keyGenerator(20));
    setSource("");
    setRequirements("");
    setRideFor([]);
    setRideType("");
    setTime("");
    setDate("");
    setLoading(false);
  };
  const handleRideFor = e => {
    const { checked, name } = e.target;
    let data = [];
    if (checked) {
      data = [...rideFor, name];
      setRideFor(data);
    } else {
      data = rideFor.filter(item => item !== name);
      setRideFor(data);
    }
  };

  return (
    <form onSubmit={e => handleSubmit(e)}>
      <section className={styles.ride}>
        <div className={styles.form}>
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
              Date of Ride
            </label>
            <input
              className={styles.input}
              value={date}
              onChange={e => setDate(e.currentTarget.value)}
              id="date"
              min={new Date().toISOString().split("T")[0]}
              name="date"
              required
              type="date"
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.labels} htmlFor="time">
              Ride Timings
            </label>
            <input
              className={styles.input}
              value={time}
              onChange={e => setTime(e.currentTarget.value)}
              id="time"
              name="time"
              required
              type="time"
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.labels} htmlFor="source">
              Source
            </label>
            <input
              className={styles.input}
              value={source}
              onChange={e => setSource(e.currentTarget.value)}
              id="source"
              required
              name="Source"
              type="text"
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.labels} htmlFor="destinationPoint">
              Destination
            </label>
            <input
              className={styles.input}
              value={destinationPoint}
              onChange={e => setDestinationPoint(e.currentTarget.value)}
              id="destinationPoint"
              name="destinationPoint"
              required
              type="text"
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.labels} htmlFor="distance">
              Distance
            </label>
            <input
              className={styles.input}
              value={distance}
              onChange={e => setDistance(e.currentTarget.value)}
              id="distance"
              name="distance"
              type="number"
              required
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.labels} htmlFor="description">
              Description
            </label>
            <input
              className={styles.input}
              value={description}
              onChange={e => setDescription(e.currentTarget.value)}
              id="description"
              required
              name="description"
              type="text"
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.labels} htmlFor="requirements">
              Requirements
            </label>
            <input
              className={styles.input}
              value={requirements}
              onChange={e => setRequirements(e.currentTarget.value)}
              required
              id="requirements"
              name="requirements"
              type="text"
            />
          </div>
          <div className={styles.inputField}>
            <label className={styles.labels} htmlFor="requirements">
              Organized By
            </label>
            <input
              className={styles.input}
              value={organizedBy}
              onChange={e => setOrganizedBy(e.currentTarget.value)}
              required
              id="organizedBy"
              name="organizedBy"
              type="text"
            />
          </div>
          <div className={styles.radioButton}>
            <label className={styles.labels} htmlFor="email">
              Ride Type
            </label>
            <div className={styles.radio}>
              <label className={styles.labels} htmlFor="Long">
                <input
                  name="rideType"
                  checked={rideType === "Long"}
                  onChange={e => setRideType(e.target.value && "Long")}
                  id="Long"
                  type="radio"
                />
                <span>Long Ride</span>
              </label>
              <label className={styles.labels} htmlFor="Short">
                <input
                  name="rideType"
                  checked={rideType === "Short"}
                  onChange={e => setRideType(e.target.value && "Short")}
                  id="Short"
                  type="radio"
                />
                <span>Short Ride</span>
              </label>
            </div>
          </div>
          <div className={styles.radioButton}>
            <label className={styles.labels} htmlFor="email">
              Ride for
            </label>
            <div className={styles.check}>
              <label className={styles.labels} htmlFor="Travel">
                <input
                  checked={rideFor.includes("Travel")}
                  onChange={e => handleRideFor(e)}
                  name="Travel"
                  id="Travel"
                  type="checkbox"
                />
                <span>Travel</span>
              </label>
              <label className={styles.labels} htmlFor="Adventures">
                <input
                  checked={rideFor.includes("Adventures")}
                  onChange={e => handleRideFor(e)}
                  name="Adventures"
                  id="Adventures"
                  type="checkbox"
                />
                <span>Adventures</span>
              </label>
              <label className={styles.labels} htmlFor="Food">
                <input
                  checked={rideFor.includes("Food")}
                  onChange={e => handleRideFor(e)}
                  name="Food"
                  id="Food"
                  type="checkbox"
                />
                <span>Food</span>
              </label>
            </div>
          </div>

          <div className={styles.girls}>
            <label className={styles.labels} htmlFor="price">
              Ride Pricing
            </label>
            <label className={`${styles.check} switch`}>
              <input
                id="price"
                onChange={e => {
                  if (e.target.checked) setPrice(true);
                  else {
                    setPrice(false);
                    setCost("");
                  }
                }}
                type="checkbox"
                checked={price}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className={styles.girls}>
            <label className={styles.labels} htmlFor="girl">
              Girl Ride Only
            </label>
            <label className={`${styles.check} switch`}>
              <input id="girl" type="checkbox" checked={girlsOnly} onChange={e => setGirlsOnly(e.target.checked)} />
              <span className="slider round"></span>
            </label>
          </div>
          {price && (
            <div className={styles.inputField}>
              <label className={styles.labels} htmlFor="cost">
                Set Price
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
        </div>
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
          Create Ride
        </button>
      </div>
    </form>
  );
};

export default Index;
