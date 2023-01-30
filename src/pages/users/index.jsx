import React, { useEffect, useState } from "react";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import Loader from "../../components/loader";
import Db from "../../firebaseConfig";
import Pagination from "../../components/pagination";
import User from "../../components/user";
import styles from "./index.module.scss";

const Index = () => {
  const history = useHistory();
  const [loader, setLoader] = useState(true);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);

  const getData = async () => {
    const q = query(collection(Db, "users"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => doc.id);
    setUsers([]);
    data.forEach(async id => {
      const docRef = doc(Db, `/UserData/ProfileDatabase/${id}/ProfileData`);
      const tempUser = await getDoc(docRef);
      setUsers(prevState => {
        if (tempUser.exists()) {
          return [...prevState, tempUser.data()];
          // return [...new Set([...prevState, { ...user.data(), id }])];
        } else {
          return prevState;
        }
      });
    });
    setLoader(false);
  };
  useEffect(() => {
    const getUser = async () => {
      if (history.location.search) {
        const query = history.location.search.slice(1);
        const docRef = doc(Db, `/UserData/ProfileDatabase/${query}/ProfileData`);
        const user = await getDoc(docRef);
        if (user.exists()) {
          setUser(user.data());
        } else {
          setUser({
            data: "User not found",
          });
        }
      }
    };
    getUser();
  }, [history.location.search]);
  const handleUser = user => {
    setUser(user);
  };
  const handleBack = () => setUser(null);
  const handleNext = () => {
    if (pageNumber < Math.ceil(users?.length / 10)) {
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
  useEffect(() => getData(), []);
  return (
    <>
      {loader && <Loader />}
      {!loader && !user && (
        <section className={styles.users}>
          <article className={styles.find}>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search...."
              />
              <button className={styles.submit}>Search</button>
            </div>
          </article>
          <h2 className={styles.head}>List of Users</h2>
          <table className={styles.table}>
            <thead className={styles.tableHeading}>
              <tr>
                <th className={styles.tableHead}>Name</th>
                <th colSpan={2} className={styles.tableHead}>
                  Email ID
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {users
                .filter(val => {
                  if (search === "") {
                    return val;
                  } else if (val?.destinationName?.toLowerCase()?.includes(search?.toLowerCase())) {
                    return val;
                  } else if (val?.city?.toLowerCase()?.includes(search?.toLowerCase())) {
                    return val;
                  } else if (val?.gender?.toLowerCase()?.includes(search?.toLowerCase())) {
                    return val;
                  } else if (val?.name?.toLowerCase()?.includes(search?.toLowerCase())) {
                    return val;
                  } else if (val?.id.includes(search)) {
                    return val;
                  } else if (val?.email?.toLowerCase()?.includes(search?.toLowerCase())) {
                    return val;
                  }
                  return null;
                })
                .map(
                  (user, index) =>
                    index < endIndex &&
                    index >= startIndex && (
                      <tr key={user?.id} className={styles.row}>
                        <td className={styles.name}>
                          <img src={user.profileImageURL || "./profile.svg"} alt="" height="28" width="28" />
                          <span>{user.name || "-NA-"}</span>
                        </td>
                        <td>{user?.email || "-NA-"}</td>
                        <td className={styles.open} onClick={() => handleUser(user)}>
                          {">"}
                        </td>
                      </tr>
                    )
                )}
            </tbody>
          </table>

          <Pagination
            pageNumber={pageNumber}
            onNext={handleNext}
            onPrev={handlePrev}
            itemsCount={users?.length}
            pageSize={1}
            search={search}
          />
        </section>
      )}
      {user && <User onBack={handleBack} {...user} />}
    </>
  );
};

export default Index;
