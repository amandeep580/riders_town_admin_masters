import React, { useEffect, useState } from "react";
import { collection, onSnapshot, collectionGroup } from "firebase/firestore";
import Db from "../../firebaseConfig";
import Loader from "../../components/loader";
import Pagination from "../../components/pagination";
import Event from "../event";
import styles from "./index.module.scss";

const Index = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [endIndex, setEndIndex] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState("");
  const [profileData, setProfileData] = useState([]);
  const [uiEvents, setUiEvents] = useState([]);
  const [drop, setDrop] = useState("all");
  const [loader, setLoader] = useState(true);
  const handleEvents = id => {
    onSnapshot(collectionGroup(Db, "metadata"), snapshot => {
      const data = snapshot.docs.map(doc => ({ [doc.id]: { ...doc.data(), path: doc.ref.path } }));
      const filter = data.filter(event => event["Registered Users"].path.includes(`EventsDatabase/${id}`));
      const usersId = filter[0]["Registered Users"]?.users;
      usersId.map(user =>
        onSnapshot(collectionGroup(Db, user), snapshot => {
          const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, path: doc.ref.path }));
          const newData = data.filter(e => e.id === "Profile Data");
          setProfileData(prev => [...prev, ...newData]);
        })
      );
    });
    const result = events.filter(suggestion => suggestion.id === id);
    setEvent(result);
  };
  const handleNext = () => {
    if (pageNumber < Math.ceil(events?.length / 10)) {
      setStartIndex(prev => prev + 10);
      setEndIndex(prev => prev + 10);
      setPageNumber(prev => prev + 1);
    }
  };
  const handlePrev = () => {
    if (pageNumber > 1) {
      setStartIndex(prev => prev - 10);
      setEndIndex(prev => prev - 10);
      setPageNumber(prev => prev - 1);
    }
  };

  const handleBack = () => {
    setEvent("");
    setProfileData([]);
  };
  useEffect(() => {
    const getEvents = async () => {
      onSnapshot(collection(Db, "EventsDatabase"), snapshot => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, path: doc.ref.path }));
        setEvents(data);
        setUiEvents(data);
      });
    };
    getEvents();
    setLoader(false);
  }, []);
  const handleDropdown = e => {
    const { value } = e.target;
    setStartIndex(0);
    setEndIndex(9999999999999999999999999999999898989889898989898989889898989999999999999999);
    setDrop(value);
    if (value === "all") {
      setUiEvents(events);
    } else {
      const filterData = events.filter(e => e.status.toLowerCase().includes(value.toLowerCase()));
      setUiEvents(filterData);
    }
  };
  const handleSearch = search => {
    if (search === "") {
      setUiEvents(events);
    } else {
      setStartIndex(0);
      setEndIndex(100);
    }
    const filterData = events.filter(val => {
      if (search === "") {
        return val;
      } else if (val?.destinationName?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      } else if (val?.venue?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      } else if (val?.organizer?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      } else if (val?.description?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      } else if (val?.title?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      }
    });

    setUiEvents(filterData);
  };
  return (
    <section className={styles.eventsContainer}>
      {loader && <Loader />}
      {!event && (
        <section className={styles.events}>
          <article className={styles.find}>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type="search"
                // value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  handleSearch(e.target.value);
                }}
                placeholder="Search...."
              />
              <button className={styles.submit}>Search</button>
            </div>
            <select className={styles.select} onChange={handleDropdown} name="" id="">
              <option selected value="all">
                All
              </option>
              <option value="cancelled">cancelled</option>
              <option value="active">active</option>
              <option value="completed">completed</option>
            </select>
          </article>
          <h2 className={styles.head}>List of Events</h2>
          <table className={styles.table}>
            <thead className={styles.tableHeading}>
              <tr>
                <th className={styles.tableHead}>Date </th>
                <th className={styles.tableHead}>Time </th>
                <th className={styles.tableHead}>Event Name </th>
                <th colSpan={2} className={styles.tableHead}>
                  Venue
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {uiEvents.map(
                (event, index) =>
                  index < endIndex &&
                  index >= startIndex && (
                    <tr key={event?.id} className={styles.row}>
                      <td>
                        {event?.dateTime?.toString()?.length === 10
                          ? new Date(event?.dateTime * 1000).toISOString().split("T")[0]
                          : new Date(event?.dateTime).toISOString().split("T")[0] || "-NA-"}
                      </td>
                      <td>{new Date(event?.dateTime).toLocaleTimeString() || "-NA-"}</td>
                      <td>{event?.title || "-NA-"}</td>
                      <td>{event?.venue || "-NA-"}</td>
                      <td className={styles.open} onClick={() => handleEvents(event?.id)}>
                        {">"}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
          {drop === "all" && (
            <Pagination
              pageNumber={pageNumber}
              onNext={handleNext}
              onPrev={handlePrev}
              itemsCount={events?.length}
              pageSize={1}
              search={search}
            />
          )}
        </section>
      )}
      {event && <Event events={event} profileData={profileData} onBack={handleBack} />}
    </section>
  );
};

export default Index;
