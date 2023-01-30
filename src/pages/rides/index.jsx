import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import Db from "../../firebaseConfig";
import styles from "./index.module.scss";
import Loader from "../../components/loader";
import Pagination from "../../components/pagination";
import Ride from "../../components/ride";
import moment from "moment";

const Index = () => {
  const [rides, setRides] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [uiRides, setUiRides] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [ride, setRide] = useState(false);
  const [search, setSearch] = useState("");
  const [rideId, setRideId] = useState("");
  const [drop, setDrop] = useState("all");
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    onSnapshot(collection(Db, "RidesDatabase"), snapshot => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setRides(data);
      setUiRides(data);
    });
    setLoader(false);
  }, []);
  const handleRide = id => {
    setRide(true);
    setRideId(id);
  };
  const onBack = () => {
    setRide(false);
  };
  const handleNext = () => {
    if (pageNumber < Math.ceil(rides?.length / 10)) {
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
  const handleDropdown = e => {
    const { value } = e.target;
    setStartIndex(0);
    setEndIndex(
      9999999999999999999999898989898989898998989898898989989889989898989898989898989898989898989899999999999
    );
    setDrop(value);
    if (value === "all") {
      setUiRides(rides);
      setStartIndex(0);
      setEndIndex(10);
      setPageNumber(1);
    } else {
      const filterData = rides.filter(event => event.status?.toLowerCase().includes(value?.toLowerCase()));
      setUiRides(filterData);
    }
  };
  const handleSearch = e => {
    if (search === "") {
      setUiRides(rides);
    } else {
      setStartIndex(0);
      setEndIndex(100);
    }
    const filterData = rides.filter(val => {
      if (search === "") {
        return val;
      } else if (val?.name?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      } else if (val?.startPoint?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      } else if (val?.destinationAddress?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      } else if (val?.description?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      } else if (val?.postedBy?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      }
    });
    setUiRides(filterData);
  };
  return (
    <section className={styles.eventsContainer}>
      {loader && <Loader />}
      {!ride && (
        <section className={styles.events}>
          <article className={styles.find}>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type="search"
                value={search}
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
          <h2 className={styles.head}>List of Rides</h2>
          <table className={styles.table}>
            <thead className={styles.tableHeading}>
              <tr>
                <th className={styles.tableHead}>Destination</th>
                <th className={styles.tableHead}>Date</th>
                <th className={styles.tableHead}>Time </th>
                <th colSpan={2} className={styles.tableHead}>
                  Source
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {uiRides.map(
                (ride, index) =>
                  index < endIndex &&
                  index >= startIndex && (
                    <tr key={ride?.id} className={styles.row}>
                      <td>{ride?.destinationPoint || "-NA-"}</td>
                      <td>{moment(parseInt(ride?.dateTime)).format("LLL")?.slice(0, -8)}</td>
                      <td>{moment(parseInt(ride?.dateTime)).format("HH:mm:A") || "-NA-"}</td>
                      <td>{ride?.startPoint || "-NA-"}</td>
                      <td className={styles.open} onClick={() => handleRide(ride?.id)}>
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
              itemsCount={rides?.length}
              pageSize={1}
              search={search}
            />
          )}
        </section>
      )}
      {ride && <Ride onBack={onBack} id={rideId} />}
    </section>
  );
};

export default Index;
