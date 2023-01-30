import React from "react";
import styles from "./index.module.scss";
const index = ({ onNext, onPrev, itemsCount, pageNumber, pageSize, search }) => {
  return (
    <>
      {!search && (
        <footer className={styles.pagination}>
          <h3 className={styles.items}>Total {itemsCount} Entries </h3>
          <div className={styles.buttons}>
            <button onClick={() => onPrev()} className={styles.prev}>
              prev
            </button>
            <span className={styles.pageNumber}>{pageNumber}</span>
            <button onClick={() => onNext()} className={styles.next}>
              next
            </button>
          </div>
        </footer>
      )}
    </>
  );
};

export default index;
