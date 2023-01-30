import React, { useEffect, useState } from "react";
import { updatePassword, updateEmail, updateProfile } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Db from "../../firebaseConfig";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import countryList from "../../data/country";
import Button from "../../components/button";
import styles from "./index.module.scss";

const Index = () => {
  const storage = getStorage();
  const [uid, setUid] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [details, setDetails] = useState("account");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState(null);
  const [imageLoader, setImageLoader] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(null);
  const [country, setCountry] = useState("");
  const [regions, setRegions] = useState([]);
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setUid(user.uid);
        setEmail(user.email);
        setProfilePhoto(user.photoURL);
      }
    });
    const docRef = doc(Db, `AdminData/${uid}`);
    getDoc(docRef).then(doc => {
      if (doc.exists) {
        setFirstName(doc.data().firstName);
        setLastName(doc.data().lastName);
        setPhone(doc.data().phone);
        setDob(doc.data().dob);
        setAge(doc.data().age);
        setGender(doc.data().gender);
        setCountry(doc.data().country);
        setCity(doc.data().city);
        handleCountry(doc.data().country);
      }
    });
  }, [uid]);
  const user = auth.currentUser;
  const checkDisabled = () => {
    if (password)
      if (password === verifyPassword) {
        return false;
      }
    return true;
  };
  const handleCountry = name => {
    const cities = countryList.filter(item => item.countryName === name);
    setRegions(cities[0].regions);
    setCountry(name);
  };
  const apiCall = () => {
    updatePassword(user, password)
      .then(() => {
        toast.success("Password updated successfully");
        setPassword("");
        setVerifyPassword("");
      })
      .catch(error => {
        toast.error(error.message);
        setPassword("");
        setVerifyPassword("");
      });
  };

  const handleImageUpload = e => {
    setImageLoader(true);
    const file = e.target.files[0];
    const storageRef = ref(storage, `/admin/${uid}/profile`);
    const desertRef = ref(storage, `/admin/${uid}/profile`);
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        console.log("deleted");
      })
      .catch(error => {
        // Uh-oh, an error occurred!
        console.log(error);
      });
    uploadBytes(storageRef, file).then(snapshot => {
      getDownloadURL(snapshot.ref).then(photoURL => {
        updateProfile(auth.currentUser, {
          photoURL,
        })
          .then(() => {
            // Profile updated!
            toast.success("Profile updated successfully");
            setProfilePhoto(photoURL);
            setImageLoader(false);
          })
          .catch(error => {
            // An error occurred
            toast.error(error.message);
            setImageLoader(false);
            // ...
          });
      });
    });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (user.email !== email) {
      updateEmail(auth.currentUser, email)
        .then(() => {
          toast.success("Email updated successfully");
          // Email updated!
          // ...
        })
        .catch(error => {
          toast.error(error.message);
          setEmail(user.email);
          // An error occurred
          // ...
        });
    }
    const dataRef = doc(Db, "AdminData", uid);
    const data = {
      firstName,
      lastName,
      dob,
      age: +age,
      phone: +phone,
      country,
      city,
      gender,
    };
    try {
      await setDoc(dataRef, data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
    updateProfile(auth.currentUser, {
      displayName: `${firstName} ${lastName}`,
    });
  };

  return (
    <>
      <ToastContainer />
      <section className={styles.profile}>
        <h1 className={styles.head}>My Profile</h1>
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.image}>
              {imageLoader && (
                <div className="lds-roller">
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
              <img src={profilePhoto || "./profile.svg"} height={150} width={150} alt="" />
            </div>
            <label htmlFor="profile" className={styles.button}>
              Upload Photo
              <input accept="image/*" onChange={handleImageUpload} type="file" name="profile" id="profile" hidden />
            </label>
          </div>
          <div className={styles.right}>
            <button
              onClick={() => setDetails("account")}
              className={details === "account" ? styles.activeDetails : styles.details}
            >
              Account Details
            </button>
            <button
              onClick={() => setDetails("password")}
              className={details === "password" ? styles.activeDetails : styles.details}
            >
              Change Password
            </button>
            {details === "account" && (
              <form onSubmit={handleSubmit}>
                <div className={styles.account}>
                  <article className={styles.values}>
                    <div className={styles.inputField}>
                      <label className={styles.labels} htmlFor="firstName">
                        First Name
                      </label>
                      <input
                        className={styles.input}
                        value={firstName}
                        onChange={e => setFirstName(e.currentTarget.value)}
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                      />
                    </div>
                    <div className={styles.inputField}>
                      <label className={styles.labels} htmlFor="lastName">
                        Last Name
                      </label>
                      <input
                        className={styles.input}
                        value={lastName}
                        onChange={e => setLastName(e.currentTarget.value)}
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                      />
                    </div>
                    <div className={styles.inputField}>
                      <label className={styles.labels} htmlFor="date">
                        Date of Birth
                      </label>
                      <input
                        className={styles.input}
                        value={dob}
                        onChange={e => setDob(e.currentTarget.value)}
                        id="date"
                        name="date"
                        type="date"
                        required
                      />
                    </div>
                    <div className={styles.inputField}>
                      <label className={styles.labels} htmlFor="age">
                        Age
                      </label>
                      <input
                        className={styles.input}
                        value={age}
                        onChange={e => setAge(e.currentTarget.value)}
                        id="age"
                        name="age"
                        type="number"
                        required
                      />
                    </div>
                  </article>
                  <div className={styles.inputField}>
                    <label className={styles.labels} htmlFor="email">
                      Email ID
                    </label>
                    <input
                      className={styles.input}
                      value={email}
                      onChange={e => setEmail(e.currentTarget.value)}
                      id="email"
                      name="email"
                      type="text"
                      required
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label className={styles.labels} htmlFor="email">
                      Phone number
                    </label>
                    <input
                      className={styles.input}
                      value={phone}
                      onChange={e => setPhone(e.currentTarget.value)}
                      id="email"
                      name="email"
                      type="text"
                      required
                    />
                  </div>
                  <div className={styles.values}>
                    <div className={styles.inputField}>
                      <select
                        name="country"
                        id="country"
                        defaultValue={country}
                        value={country}
                        onChange={e => handleCountry(e.target.value)}
                      >
                        <option value="">Country</option>
                        {countryList.map(({ countryName }) => (
                          <option value={countryName}>{countryName}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.inputField}>
                      <select
                        name="city"
                        id="city"
                        defaultValue={city}
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        disabled={!country}
                      >
                        <option value="">City</option>
                        {regions.map(({ name }) => (
                          <option value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                    <label htmlFor="">Gender</label>
                  </div>
                  <div className={styles.values}>
                    <label htmlFor="male">
                      Male
                      <input
                        name="gender"
                        id="male"
                        type="radio"
                        checked={gender === "male"}
                        onChange={e => e.target.value === "on" && setGender("male")}
                      />
                    </label>
                    <label htmlFor="female">
                      Female
                      <input
                        name="gender"
                        id="female"
                        type="radio"
                        checked={gender === "female"}
                        onChange={e => e.target.value === "on" && setGender("female")}
                      />
                    </label>
                  </div>
                </div>
                <Button className={styles.button} buttonType="primary">
                  SAVE CHANGES
                </Button>
              </form>
            )}

            {details === "password" && (
              <>
                <div className={styles.password}>
                  <article className={styles.values}>
                    <div className={styles.inputField}>
                      <label className={styles.labels} htmlFor="email">
                        New Password
                      </label>
                      <input
                        className={styles.input}
                        value={password}
                        onChange={e => setPassword(e.currentTarget.value)}
                        id="email"
                        name="email"
                        type="password"
                        required
                      />
                    </div>
                    <div className={styles.inputField}>
                      <label className={styles.labels} htmlFor="email">
                        Repeat New Password
                      </label>
                      <input
                        className={styles.input}
                        value={verifyPassword}
                        onChange={e => setVerifyPassword(e.currentTarget.value)}
                        id="email"
                        name="email"
                        type="password"
                        required
                      />
                    </div>
                  </article>
                </div>
                <Button
                  className={checkDisabled() ? styles.buttonDisabled : styles.button}
                  disabled={checkDisabled()}
                  buttonType="primary"
                  onClick={apiCall}
                >
                  CHANGE PASSWORD
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
export default Index;
