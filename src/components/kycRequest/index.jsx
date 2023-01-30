import React from "react";
import Icons from "../../utility/icons/icons";
import styles from "./index.module.scss";

const index = ({
  onBack,
  aadharCardURL,
  aadharNumber,
  drivingLicenseNumber,
  selfieURL,
  licenseURL,
  vehicleNumberURL,
  vehicleNumber,
  handleUpdate,
  name,
  id,
  ...props
}) => {
  const handleImage = url => {
    if (url) {
      window.open(url, "_blank");
    }
  };
  return (
    <article className={styles.kyc}>
      <h2 className={styles.heading}>
        <Icons onClick={onBack} className={styles.back} name="backIcon" fill="#fcb205" />
        KYC Request Details
      </h2>
      <div className={styles.grid}>
        <div className={styles.left}>
          <img src={selfieURL || "./profile.svg"} height="150" width="150" alt="" />
          <h1 className={styles.name}>{name}</h1>
        </div>
        <div className={styles.right}>
          <h2>Aadhar number</h2>
          <p>{aadharNumber || "-NA-"}</p>
          <h2>Driving License number</h2>
          <p>{drivingLicenseNumber || "-NA-"}</p>
          <h2>Vehicle number</h2>
          <p>{vehicleNumber || "-NA-"}</p>
        </div>
      </div>
      <div className={styles.actions}>
        <div className={styles.left}>
          <button
            onClick={() => handleImage(aadharCardURL)}
            className={aadharCardURL ? styles.open : styles.dontOpen}
            title={!aadharCardURL && "No Aadhar card available"}
            disabled={!aadharCardURL}
          >
            View Aadhar Card
          </button>
          <button
            onClick={() => handleImage(licenseURL)}
            className={licenseURL ? styles.open : styles.dontOpen}
            title={!licenseURL && "No Driving license available"}
            disabled={!licenseURL}
          >
            View License
          </button>
        </div>
        <div className={styles.right}>
          <button onClick={() => handleUpdate(id, "verified")} className={styles.acceptedButton}>
            Accept
          </button>
          <button onClick={() => handleUpdate(id, "rejected")} className={styles.rejectedButton}>
            Reject
          </button>
        </div>
      </div>
    </article>
  );
};

export default index;
