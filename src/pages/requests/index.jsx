import React, { useEffect, useState } from "react";
import { doc, getDoc, getDocs, deleteDoc, collection, updateDoc, query, setDoc, onSnapshot } from "firebase/firestore";
import SuggestionRequest from "../../components/suggestionRequest";
import RideRequest from "../../components/rideRequests";
import Db from "../../firebaseConfig";
import Loader from "../../components/loader";
import KycRequest from "../../components/kycRequest";
import styles from "./index.module.scss";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import moment from "moment";

const Index = () => {
  const kyc = "kyc requests";
  const suggest = "suggestion requests";
  const ride = "ride requests";
  const history = useHistory();
  const [active, setActive] = useState(kyc);
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(true);
  const [request, setRequest] = useState(false);
  const [individual, setIndividual] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [rides, setRides] = useState([]);
  useEffect(() => {
    if (
      history.location.search.slice(1) === kyc ||
      history.location.search.slice(1) === suggest ||
      history.location.search.slice(1) === ride
    ) {
      setActive(history.location.search.slice(1));
    }
  }, [history.location.search]);

  const getKycData = async () => {
    setLoader(true);
    setUsers([]);
    const q = query(collection(Db, "KycRequestDatabase"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => doc.id);
    data.forEach(async id => {
      const docRef = doc(Db, `/UserData/ProfileDatabase/${id}/ProfileData`);
      const user = await getDoc(docRef);
      setUsers(prevState => [...new Set([...prevState, { ...user.data(), id }])]);
    });
    setLoader(false);
  };
  const getSuggestionData = async () => {
    setLoader(true);
    setSuggestions([]);
    onSnapshot(collection(Db, "SuggestionReview"), snapshot => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setSuggestions(data);
    });
    setLoader(false);
  };
  const getRideData = async () => {
    setLoader(true);
    setRides([]);
    onSnapshot(collection(Db, "RidesRequest"), snapshot => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const filter = data.filter(doc => doc?.verificationStatus === "IN PROGRESS");
      setRides(filter);
    });
    setLoader(false);
  };
  useEffect(() => {
    if (active === kyc) getKycData();
    if (active === suggest) getSuggestionData();
    if (active === ride) getRideData();
  }, [active]);
  const handleClick = async (id, name, req) => {
    setRequest(req);
    const docRef = doc(Db, `/UserData/ProfileDatabase/${id}/KYCData`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setIndividual({ ...docSnap.data(), id, name });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const handleUpdate = async (id, kycStatus) => {
    setLoader(true);
    const docRef = doc(Db, `/UserData/ProfileDatabase/${id}/KYCData`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = { ...docSnap.data(), kycStatus };
      updateDoc(docRef, data).then(
        setUsers(prevState => [...prevState, { ...data, id }]),
        toast.success("KYC Status Updated")
      );
      deleteDoc(doc(Db, "KycRequestDatabase", id)).then(() => {
        setRequest(false);
        setIndividual({});
        setUsers(prevState => [...new Set(prevState.filter(user => user.id !== id))]);
      });
    } else {
      // doc.data() will be undefined in this case
      toast.error("Error Updating KYC Status");
    }
    setLoader(false);
  };
  const handleRideUpdate = async (id, rideStatus) => {
    setLoader(true);
    const docRef = doc(Db, `/RidesRequest/${id}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = { ...docSnap.data(), verificationStatus: rideStatus };
      updateDoc(docRef, data).then(
        setUsers(prevState => [...prevState, { ...data, id }]),
        toast.success("Ride Status Updated")
      );
    } else {
      // doc.data() will be undefined in this case
      toast.error("Error Updating Ride Status");
    }
    setLoader(false);
    setRequest(false);
  };
  const handleBack = () => {
    setRequest(false);
  };
  const handelRide = async (id, ride) => {
    setRequest(ride);
    const data = rides.filter(ride => ride.id === id);
    setIndividual({ ...data[0] });
  };
  const handleSuggestion = async (id, name, req) => {
    setRequest(req);
    const data = suggestions?.filter(suggestion => suggestion.id === id);
    setIndividual({ ...data[0], id, name });
  };
  const handleSuggestionUpdate = async id => {
    const filteredData = suggestions?.filter(suggestion => suggestion.id === id);
    const dataRef = doc(Db, "Suggestion", id);
    const data = filteredData[0];
    try {
      await setDoc(dataRef, data);
      await deleteDoc(doc(Db, "SuggestionReview", id));
      setIndividual({});
      setRequest(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSuggestionDelete = async id => {
    try {
      await deleteDoc(doc(Db, "SuggestionReview", id));
      setIndividual({});
      setRequest(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <ToastContainer />
      {!request && (
        <section className={styles.create}>
          <h1 className={styles.head}>{active.toUpperCase()}</h1>
          <div className={styles.buttons}>
            <button onClick={() => setActive(kyc)} className={active === kyc ? styles.activeDetails : styles.details}>
              {kyc.toUpperCase()}
            </button>
            <button onClick={() => setActive(ride)} className={active === ride ? styles.activeDetails : styles.details}>
              {ride.toUpperCase()}
            </button>
            <button
              onClick={() => setActive(suggest)}
              className={active === suggest ? styles.activeDetails : styles.details}
            >
              {suggest.toUpperCase()}
            </button>
          </div>
          {loader && <Loader />}
          {active === kyc && users?.length === 0 && <h1>No KYC request found</h1>}
          {active === suggest && suggestions?.length === 0 && <h1>No Suggestions request found</h1>}
          {active === ride && rides?.length === 0 && <h1>No Ride request found</h1>}
          {!loader && active === kyc && users?.length !== 0 && (
            <table className={styles.table}>
              <thead className={styles.tableHeading}>
                <tr>
                  <th className={styles.tableHead}>Name</th>
                  <th colSpan={2} className={styles.tableHead}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {users.map(item => (
                  <tr key={item.id} className={styles.row}>
                    <td className={styles.name}>
                      <img src={item.profileImageURL || "./profile.svg"} alt="" height="28" width="28" />
                      <span>{item.name || "-NA-"}</span>
                    </td>
                    <td className={styles.buttons}>
                      <button onClick={() => handleUpdate(item.id, "verified")} className={styles.accept}>
                        Accept
                      </button>
                      <button onClick={() => handleUpdate(item.id, "rejected")} className={styles.reject}>
                        Reject
                      </button>
                    </td>
                    <td onClick={() => handleClick(item.id, item.name, kyc)} className={styles.open}>
                      {">"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loader && active === suggest && suggestions?.length !== 0 && (
            <table className={styles.table}>
              <thead className={styles.tableHeading}>
                <tr>
                  <th className={styles.tableHead}>Destination name</th>
                  <th className={styles.tableHead}>Destination type</th>
                  <th className={styles.tableHead}>City</th>
                  <th colSpan={2} className={styles.tableHead}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {suggestions.map(item => (
                  <tr key={item.id} className={styles.row}>
                    <td className={styles.name}>
                      <span>{item?.destinationName || "-NA-"}</span>
                    </td>
                    <td className={styles.name}>
                      <span>{item?.offered || "-NA-"}</span>
                    </td>
                    <td className={styles.name}>
                      <span>{item?.city || "-NA-"}</span>
                    </td>
                    <td className={styles.buttons}>
                      <button onClick={() => handleSuggestionUpdate(item.id)} className={styles.accept}>
                        Accept
                      </button>
                      <button onClick={() => handleSuggestionDelete(item.id)} className={styles.reject}>
                        Reject
                      </button>
                    </td>
                    <td onClick={() => handleSuggestion(item.id, item.name, suggest)} className={styles.open}>
                      {">"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loader && active === ride && rides?.length !== 0 && (
            <table className={styles.table}>
              <thead className={styles.tableHeading}>
                <tr>
                  <th className={styles.tableHead}>Date</th>
                  <th className={styles.tableHead}>Source</th>
                  <th className={styles.tableHead}>Destination</th>
                  <th colSpan={2} className={styles.tableHead}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {rides.map(item => (
                  <tr key={item.id} className={styles.row}>
                    <td className={styles.name}>
                      <span>{moment(item.dateTime).format("LLL").slice(0, -8) || "-NA-"}</span>
                    </td>
                    <td className={styles.name}>
                      <span>{item.startPoint || "-NA-"}</span>
                    </td>
                    <td className={styles.name}>
                      <span>{item.destinationPoint || "-NA-"}</span>
                    </td>
                    <td className={styles.buttons}>
                      <button onClick={() => handleRideUpdate(item.id, "VERIFIED")} className={styles.accept}>
                        Accept
                      </button>
                      <button onClick={() => handleRideUpdate(item.id, "REJECTED")} className={styles.reject}>
                        Reject
                      </button>
                    </td>
                    <td onClick={() => handelRide(item.id, ride)} className={styles.open}>
                      {">"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
      {request === kyc && <KycRequest onBack={handleBack} handleUpdate={handleUpdate} {...individual} />}
      {request === suggest && (
        <SuggestionRequest
          onBack={handleBack}
          handleSuggestionUpdate={handleSuggestionUpdate}
          handleSuggestionDelete={handleSuggestionDelete}
          {...individual}
        />
      )}
      {request === ride && <RideRequest onBack={handleBack} handleUpdate={handleRideUpdate} {...individual} />}
    </>
  );
};

export default Index;
