import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { doc, getDoc, getDocs, updateDoc, collection, onSnapshot, collectionGroup, setDoc } from "firebase/firestore";
import Db from "../../firebaseConfig";
import Icons from "../../utility/icons/icons";
import Slider from "react-slick";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import wordLimiter from "../../utility/helper/wordLimiter";
import Modal from "react-modal";
import capitalize from "../../utility/helper/capitalize";

const Index = ({ onBack, id }) => {
  const priorityArray = new Array(15).fill(0);
  const [priority, setPriority] = useState(0);
  const history = useHistory();
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <Icons name="backIcon" fill="#fcb205" />,
    prevArrow: <Icons rotate name="backIcon" fill="#fcb205" />,
  };

  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState([]);
  const [reports, setReports] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

  useEffect(() => {
    const getReports = async () => {
      const docRef = doc(Db, `/RidesDatabase/${id}/metadata/AllReports`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        data.reports.map(async report => {
          const docRef = doc(Db, `/UserData/ProfileDatabase/${report.uid}/ProfileData`);
          const user = await getDoc(docRef);
          if (user.exists()) {
            setReports(prevState => [...prevState, { ...user.data(), ...report }]);
          }
        });
      } else {
        console.log("no data");
      }
    };
    getReports();
  }, [id]);
  const updatePriority = async () => {
    const docRef = doc(Db, `/RidesDatabase/${id}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      data.priority = parseInt(priority);
      await updateDoc(docRef, data);
      toast.success("Priority Updated");
      data.priority = data.priority.toString();
      setData(data);
    } else {
      console.log("no data");
    }
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  const handleCancel = async () => {
    const docRef = doc(Db, `/RidesDatabase/${id}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = { ...docSnap.data(), status: "Cancelled" };
      updateDoc(docRef, data).then(toast.success("Rids Cancelled"));
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    setTimeout(() => onBack(), 1000);
  };
  useEffect(() => {
    const getData = async () => {
      const docRef = doc(Db, `/RidesDatabase/${id}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
        setPriority(docSnap.data()?.priority);
      } else {
        console.log("No such document!");
      }
    };
    getData();

    const getUsersId = async () => {
      const querySnapshot = await getDocs(collection(Db, `/RidesDatabase/${id}/metadata`));
      var data = [];
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        data = doc.data().users;
      });
      await setUsers(data?.map(item => item.uid));
    };
    getUsersId();
  }, [id]);
  useEffect(() => {
    const getUsers = async () => {
      users?.map(async user => {
        const docRef = doc(Db, `/UserData/ProfileDatabase/${user}/ProfileData`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(prevState => [...prevState, docSnap.data()]);
        } else {
          console.log("no data");
        }
      });
    };
    getUsers();
  }, [users]);
  const openImage = url => window.open(url);
  return (
    <>
      {!open && (
        <>
          <ToastContainer />
          <article className={styles.suggest}>
            <h2 className={styles.heading}>
              <Icons onClick={onBack} className={styles.back} name="backIcon" fill="#fcb205" />
              Ride Details
            </h2>
            {data.postedByName && (
              <h2>
                POSTED BY
                <span onClick={() => history.push(`/users?${data?.postedBy}`)} className={styles.user}>
                  {data.postedByName}
                </span>
              </h2>
            )}
            <div className={styles.grid}>
              <div className={styles.left}>
                <div className={styles.container}>
                  <div className={styles.images}>
                    {data?.images?.length > 2 && (
                      <Slider {...settings}>
                        {data?.images?.map(image => (
                          <div>
                            <img className={styles.image} src={image || "/"} alt="" onClick={() => openImage(image)} />
                          </div>
                        ))}
                      </Slider>
                    )}
                    {data?.images?.length <= 2 && (
                      <div className={styles.flex}>
                        {data?.images?.map(image => (
                          <div>
                            <img className={styles.image} src={image || "/"} alt="" onClick={() => openImage(image)} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={styles.values}>
                    <div>
                      <h2 className={styles.name}>Date</h2>
                      <div>{new Date(data?.dateTime)?.toLocaleDateString("en-US") || "-NA-"}</div>
                    </div>
                    <div>
                      <h2 className={styles.name}>Time</h2>
                      <div>{moment(parseInt(data?.dateTime)).format("HH:mm:A") || "-NA-"}</div>
                    </div>
                    <div>
                      <h2 className={styles.name}>Source</h2>
                      <div>{data.source || "-NA-"}</div>
                    </div>
                    <div>
                      <h2 className={styles.name}>Destination</h2>
                      <div>{data.destinationPoint || "-NA-"}</div>
                    </div>
                    <div>
                      <h2 className={styles.name}>Distance</h2>
                      <div>{data.distance + " KM" || "-NA-"}</div>
                    </div>
                    <div>
                      <h2 className={styles.name}>Ride type</h2>
                      <div>{data.type || "-NA-"}</div>
                    </div>
                    <div>
                      <h2 className={styles.name}>Ride for</h2>
                      <div>
                        {data?.rideFor?.map(ride => ride)}
                        {data?.rideFor?.length === 0 && "-NA-"}
                      </div>
                    </div>
                    <div>
                      <h2 className={styles.name}>Ride Status</h2>
                      <div>{capitalize(data?.status || "")}</div>
                    </div>
                    <div>
                      <h2 className={styles.name}>Ticket Cost</h2>
                      <div>{"₹ " + data.cost || "FREE"}</div>
                    </div>
                    <div>
                      <h2 className={styles.name}>Priority</h2>
                      <select value={priority} onChange={e => setPriority(e.target.value)} className={styles.select}>
                        {priorityArray.map((priority, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                      {priority !== data.priority && (
                        <button onClick={() => updatePriority()} className={styles.updateButton}>
                          Update
                        </button>
                      )}
                    </div>
                    <div>
                      <h2 className={styles.name}>Requirements</h2>
                      <div>{data.requirements || "-NA-"}</div>
                    </div>
                  </div>
                  <div>
                    <h2 className={styles.name}>Description</h2>
                    <div>{data.description || "-NA-"}</div>
                  </div>
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.users}>
                  <h4 className={styles.number}>{`${users?.length < 10 ? "0" + users?.length : users?.length}`}</h4>
                  <h2>Registered Users</h2>
                </div>
                <div className={styles.usersDetails}>
                  <h3>Registered Users</h3>
                  {profile?.map(({ name, profileImageURL }) => (
                    <div className={styles.profile}>
                      <img className={styles.image} src={profileImageURL || "./profile.svg"} alt="" />
                      <span>{name}</span>
                    </div>
                  ))}
                  {profile?.length === 0 && <h3 className={styles.profile}>NO REGISTERED USERS</h3>}
                </div>
              </div>
            </div>
          </article>
          <button onClick={() => handleCancel()} className={styles.cancel}>
            Cancel Ride
          </button>
          {reports.length > 0 && (
            <button onClick={() => setOpen(true)} className={styles.button}>
              View Reports
            </button>
          )}
        </>
      )}
      {open && (
        <>
          <article className={styles.suggest}>
            <h2 className={styles.heading}>
              <Icons onClick={() => setOpen(false)} className={styles.back} name="backIcon" fill="#fcb205" />
              Ride Report Details
            </h2>
            <div className={styles.display}>
              <div className={styles.report}>
                <table>
                  <thead>
                    <tr>
                      <th>USER</th>
                      <th>Event Hosted</th>
                      <th>Reason for Report</th>
                    </tr>
                  </thead>
                  {reports.map(({ hosted, profileImageURL, name, message, uid }) => (
                    <tr>
                      <td className={styles.userProfile}>
                        <img className={styles.profilePicture} src={profileImageURL} alt="" height="28" width="28" />
                        <span onClick={() => history.push(`/users?${uid}`)}>{name}</span>
                      </td>
                      <td>{hosted.toString()}</td>
                      <td>
                        {wordLimiter(message, 20)}
                        {message.length > 20 && (
                          <span
                            className={styles.read}
                            onClick={() => {
                              setReportMessage(message);
                              openModal();
                            }}
                          >
                            Read More
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          </article>
          <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Example Modal">
            <div>
              <div className={styles.modal}>
                <h2>Report Message</h2>
                <img src="./close.png" onClick={closeModal} alt="" height="20" width="20" />
              </div>
              <p>{reportMessage}</p>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};
export default Index;
