import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "@firebase/firestore";
import Db from "../../firebaseConfig";
import Loader from "../../components/loader";
import Pagination from "../../components/pagination";
import Suggest from "../suggest";
import styles from "./index.module.scss";

const Index = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [suggest, setSuggest] = useState("");
  const [search, setSearch] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [loader, setLoader] = useState(true);
  const [drop, setDrop] = useState("all");
  const [uiSuggestions, setUiSuggestions] = useState([]);

  useEffect(() => {
    const getSuggestion = async () => {
      onSnapshot(collection(Db, "Suggestion"), snapshot => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, path: doc.ref.path }));
        setSuggestions(data);
        setUiSuggestions(data);
      });
    };
    getSuggestion();
    setLoader(false);
  }, []);
  const handleNext = () => {
    if (pageNumber < Math.ceil(suggestions?.length / 10)) {
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

  const handleSuggestions = id => {
    const result = suggestions.filter(suggestion => suggestion.id === id);
    setSuggest(result);
  };
  const handleBack = () => {
    setSuggest("");
  };
  const handleSearch = search => {
    if (search === "") {
      setUiSuggestions(suggestions);
    } else {
      setStartIndex(0);
      setEndIndex(100);
    }
    const filterData = suggestions.filter(val => {
      if (search === "") {
        return val;
      } else if (val?.destinationName?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      } else if (val?.city?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      } else if (val?.destinationAddress?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      } else if (val?.description?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      } else if (val?.postedBy?.toLowerCase()?.includes(search?.toLowerCase())) {
        return val;
      }
    });

    setUiSuggestions(filterData);
  };
  const handleDropdown = e => {
    const { value } = e.target;
    setStartIndex(0);
    setEndIndex(9999999999999999999999999999999898989889898989898989889898989999999999999999);
    setDrop(value);
    if (value === "all") {
      setUiSuggestions(suggestions);
    } else {
      const filterData = suggestions.filter(e => e.status?.toLowerCase().includes(value?.toLowerCase()));
      setUiSuggestions(filterData);
    }
  };
  return (
    <>
      {loader && <Loader />}
      {!suggest && (
        <section className={styles.suggestions}>
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
          </article>
          <h2 className={styles.head}>List of Suggestions</h2>
          <table className={styles.table}>
            <thead className={styles.tableHeading}>
              <tr>
                <th className={styles.tableHead}>Destination Name</th>
                <th colSpan={2} className={styles.tableHead}>
                  City
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {uiSuggestions.map(
                (suggestion, index) =>
                  index < endIndex &&
                  index >= startIndex && (
                    <tr key={suggestion?.id} className={styles.row}>
                      <td>{suggestion?.destinationName || "-NA-"}</td>
                      <td>{suggestion?.city || "-NA-"}</td>
                      <td className={styles.open} onClick={() => handleSuggestions(suggestion?.id)}>
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
              itemsCount={suggestions?.length}
              pageSize={1}
              search={search}
            />
          )}{" "}
        </section>
      )}
      {suggest && <Suggest data={suggest} onBack={handleBack} />}
    </>
  );
};

export default Index;
// Suggestion
// onSubmit={e => handleSubmit(e)}
