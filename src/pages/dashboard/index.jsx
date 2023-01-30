import React, { useState, useEffect } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { collection, onSnapshot, query, getDocs } from "firebase/firestore";
import Loader from "../../components/loader";
import OverviewCard from "../../components/overviewCard";
import Icons from "../../utility/icons/icons";
import Data from "../../data/overview";
import styles from "./index.module.scss";
import db, { auth } from "../../firebaseConfig";

const Index = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState({});
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  useEffect(() => {
    setLoading(true);
    auth.onAuthStateChanged(user => {
      if (user) {
        setUserName(user.displayName);
        setProfilePicture(user.photoURL);
      }
    });
    const getUser = async () => {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.id);
      let count = 0;
      if (data && data.length > 0) {
        count = data.length;
      }
      setLength(prevState => ({ ...prevState, users: count }));
    };
    getUser();
    onSnapshot(collection(db, "RidesDatabase"), snapshot => {
      let count = 0;
      setUpcomingRides([]);
      snapshot.docs.map(doc => moment(doc.data().dateTime).diff(moment()) > 0 && ++count);
      snapshot.docs.map(doc => {
        if (moment(doc.data().dateTime).diff(moment()) > 0) {
          setUpcomingRides(prevState => [...prevState, doc.data()]);
        }
        return null;
      });
      setLength(prevState => ({ ...prevState, rides: count }));
    });
    onSnapshot(collection(db, "KycRequestDatabase"), snapshot => {
      let count = 0;
      snapshot.docs.map(() => ++count);
      setLength(prevState => ({ ...prevState, "kyc requests": count }));
    });
    onSnapshot(collection(db, "SuggestionReview"), snapshot => {
      let count = 0;
      snapshot.docs.map(() => ++count);
      setLength(prevState => ({ ...prevState, "suggestion requests": count }));
    });
    onSnapshot(collection(db, "RidesRequest"), snapshot => {
      let count = 0;
      snapshot.docs.map(() => ++count);
      setLength(prevState => ({ ...prevState, "ride requests": count }));
    });
    onSnapshot(collection(db, "Suggestion"), snapshot => {
      let count = 0;
      snapshot.docs.map(doc => doc.data() && ++count);
      setLength(prevState => ({ ...prevState, suggestions: count }));
    });
    onSnapshot(collection(db, "EventsDatabase"), snapshot => {
      let count = 0;
      setUpcomingEvents([]);
      snapshot.docs.map(doc => doc.data().status === "active" && ++count);
      snapshot.docs.map(doc => {
        if (moment(doc.data().dateTime).diff(moment()) > 0 && doc.data().status === "active") {
          setUpcomingEvents(prevState => [...prevState, doc.data()]);
        }
        return null;
      });
      setLength(prevState => ({ ...prevState, events: count }));
    });
    setLoading(false);
  }, []);
  const overview = Data.map(card => <OverviewCard key={card.id} length={length} {...card} />);
  return (
    <div className={styles.dashboard}>
      {loading && <Loader />}
      {!loading && (
        <>
          <header className={styles.header}>
            <div className={styles.form} />
            <div className={styles.profile}>
              {profilePicture ? (
                <img
                  height="40"
                  width="40"
                  onClick={() => history.push("profile")}
                  className={styles.dummy}
                  src={profilePicture}
                  alt=""
                />
              ) : (
                <Icons
                  className={styles.dummy}
                  onClick={() => history.push("profile")}
                  name="user"
                  height="40"
                  width="40"
                />
              )}
              <h3 className={styles.name}>{userName}</h3>
              <span onClick={() => history.push("requests")} className={styles.notification}>
                <Icons className={styles.active} name="notifications" height="17" width="17" />
              </span>
            </div>
          </header>
          <article className={styles.welcome}>
            <h2 className={styles.heading}>
              Hello, <span>{userName}</span>
            </h2>
            <p className={styles.activities}>Check your activities in the dashboard</p>
          </article>
          <section className={styles.overview}>
            <h1 className={styles.heading}>Dashboard Overview</h1>
            <article className={styles.dashboardContent}>
              <div className={styles.overviewCards}>{overview}</div>
              <div className={styles.upcoming}>
                <div className={styles.events}>
                  <div className={styles.head}>
                    <span>Upcoming Events</span>
                  </div>
                  <div className={styles.list}>
                    {upcomingEvents.length > 0 &&
                      upcomingEvents.map((event, index) => (
                        <div key={event.id} className={styles.event}>
                          {index + 1 + ": " + event.title}
                        </div>
                      ))}
                    {upcomingEvents.length === 0 && <div className={styles.event}>No upcoming events</div>}
                  </div>
                </div>
                <div className={styles.events}>
                  <div className={styles.head}>
                    <span>Upcoming Rides</span>
                  </div>
                  <div className={styles.list}>
                    {upcomingRides.length > 0 &&
                      upcomingRides.map((ride, index) => (
                        <div key={ride.id} className={styles.ride}>
                          {index + 1 + ": " + ride.startPoint}
                        </div>
                      ))}
                    {upcomingRides.length === 0 && <div className={styles.ride}>No upcoming rides</div>}
                  </div>
                </div>
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
};

export default Index;
