import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import Pagination from "../../components/pagination";
import Db from "../../firebaseConfig";
import Payment from "../../components/payment";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import moment from "moment";

const Index = () => {
  const [payments, setPayments] = useState([]);
  const [payment, setPayment] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  useEffect(() => getPayments(), []);
  const getPayments = async () => {
    setPayments([]);
    onSnapshot(collection(Db, "Payments"), snapshot => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPayments(data);
    });
  };
  const handlePayment = id => {
    const payment = payments.find(payment => payment.id === id);
    setPayment(payment);
  };
  const handleBack = () => {
    setPayment(null);
  };
  const handleNext = () => {
    if (pageNumber < Math.ceil(payments?.length / 10)) {
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
  return (
    <>
      {!payment && (
        <section className={styles.payment}>
          <h1 className={styles.head}>Payment</h1>
          <table className={styles.table}>
            <thead className={styles.tableHeading}>
              <tr>
                <th className={styles.tableHead}>Payment For</th>
                <th className={styles.tableHead}>Date</th>
                <th className={styles.tableHead}>Transaction ID</th>
                <th colSpan={2} className={styles.tableHead}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {payments?.map(
                (pay, index) =>
                  index < endIndex &&
                  index >= startIndex && (
                    <tr key={pay?.id} className={styles.row}>
                      <td className={styles.name}>{capitalizeFirstLetter(pay?.paymentFor) || "-NA-"}</td>
                      <td className={styles.name}>
                        {moment(pay?.created_at * 1000)
                          .format("LLL")
                          .slice(0, -8)}
                      </td>
                      <td className={styles.name}>{pay?.targetDocId}</td>
                      <td className={styles.name}>{pay?.amount}</td>
                      <td className={styles.open} onClick={() => handlePayment(pay?.id)}>
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
            itemsCount={payments?.length}
            pageSize={1}
            search={search}
          />
        </section>
      )}
      {payment && <Payment {...payment} onBack={handleBack} />}
    </>
  );
};

export default Index;
