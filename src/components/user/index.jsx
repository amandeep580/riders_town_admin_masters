import React, { useState } from "react";
import Icons from "../../utility/icons/icons";
import Data from "../../data/user";
import styles from "./index.module.scss";
import getAge from "../../utility/helper/getAge";
import Slider from "react-slick";

const Index = ({ onBack, profileImageURL, vehilces, data, ...props }) => {
  const personal = "personal";
  const vehicle = "vehicle";
  const [active, setActive] = useState(personal);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <Icons name="backIcon" fill="#fcb205" />,
    prevArrow: <Icons rotate name="backIcon" fill="#fcb205" />,
  };
  return (
    <article className={styles.user}>
      <h2 className={styles.heading}>
        <Icons onClick={() => onBack()} className={styles.back} name="backIcon" fill="#fcb205" />
        User Profile
      </h2>
      {!data ? (
        <div className={styles.userDetails}>
          <div className={styles.userImage}>
            <img src={profileImageURL || "./profile.svg"} alt="user" />
            <h3 className={styles.userName}>{props.name}</h3>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.buttons}>
              <button onClick={() => setActive(personal)} className={active === personal && styles.active}>
                Personal Information
              </button>
              <button onClick={() => setActive(vehicle)} className={active === vehicle && styles.active}>
                Vehicle Information
              </button>
            </div>
            {active === personal && (
              <div className={styles.personal}>
                {Data?.map(({ name, value }) => (
                  <React.Fragment key={name}>
                    <h2>{name}</h2>
                    <p>
                      {(value === "dob" && new Date(props[value])?.toLocaleDateString("en-US")) ||
                        (value === "age" && getAge(props?.dob)) ||
                        props[value] ||
                        "-NA-"}
                    </p>
                  </React.Fragment>
                ))}
              </div>
            )}
            {active === vehicle &&
              vehilces.map(({ images, name, number, model }) => (
                <div className={styles.vehicle}>
                  {images?.length > 2 && (
                    <Slider {...settings}>
                      {images.map(image => (
                        <div key={image}>
                          <img
                            src={image}
                            style={{ cursor: "pointer" }}
                            onClick={() => window.open(image)}
                            height="200"
                            width="200"
                            alt="vehicle"
                          />
                        </div>
                      ))}
                    </Slider>
                  )}
                  {images?.length <= 2 && (
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                      {images.map(image => (
                        <div key={image}>
                          <img
                            style={{ cursor: "pointer" }}
                            onClick={() => window.open(image)}
                            src={image}
                            height="200"
                            width="300"
                            alt="vehicle"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <div>
                    <h2>Vehicle name</h2>
                    <p>{name}</p>
                  </div>
                  <div>
                    <h2>Vehicle number</h2>
                    <p>{number}</p>
                  </div>
                  <div>
                    <h2>Vehicle model</h2>
                    <p>{model}</p>
                  </div>
                </div>
              ))}
            {active === vehicle && vehilces?.length === 0 && (
              <div className={styles.vehicle}>
                <h2>No vehicle added</h2>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.body}>
          <Icons className={styles.icon} name="profile" height="50" width="50" fill="#FCB205" />
          <h2 className={styles.heading}>{data}</h2>
        </div>
      )}
    </article>
  );
};

export default Index;
