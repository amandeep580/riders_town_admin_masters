import React from "react";
import Icons from "../../utility/icons/icons";
import styles from "./index.module.scss";
import rideRequest from "../../data/rideRequest.js";
import Slider from "react-slick";
import { useHistory } from "react-router-dom";
const Index = ({ onBack, images, handleUpdate, id, ...props }) => {
  const history = useHistory();

  const openImage = url => {
    if (url) {
      window.open(url, "_blank");
    }
  };
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <Icons name="backIcon" fill="#fcb205" />,
    prevArrow: <Icons rotate name="backIcon" fill="#fcb205" />,
  };
  return (
    <article className={styles.suggest}>
      <h2 className={styles.heading}>
        <Icons onClick={() => onBack()} className={styles.back} name="backIcon" fill="#fcb205" />
        Rides Request Details
      </h2>
      <div className={styles.container}>
        <div className={styles.images}>
          {images?.length > 2 && (
            <Slider {...settings}>
              {images?.map(image => (
                <div>
                  <img
                    key={image}
                    className={styles.image}
                    src={image || ""}
                    onClick={() => openImage(image || "")}
                    alt=""
                  />
                </div>
              ))}
            </Slider>
          )}
          {images?.length <= 2 && (
            <div className={styles.flex}>
              {images?.map(image => (
                <div>
                  <img
                    key={image}
                    className={styles.image}
                    src={image || ""}
                    onClick={() => openImage(image || "")}
                    alt=""
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.grid}>
          {rideRequest.map(({ name, value }) => (
            <div>
              <h2 className={styles.name}>{name}</h2>
              <div
                className={value === "postedByName" && styles.click}
                onClick={() => value === "postedByName" && history.push(`/users?${props?.postedBy}`)}
              >
                {(value === "postedOn" && new Date(props[value])?.toLocaleDateString("en-US")) ||
                  (value === "distance" && props[value] + " KM") ||
                  (value === "rideFor" && props[value] + " ") ||
                  props[value] ||
                  "-NA-"}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.buttons}>
        <button onClick={() => handleUpdate(id, "VERIFIED")} className={styles.accept}>
          Accept
        </button>
        <button onClick={() => handleUpdate(id, "REJECTED")} className={styles.reject}>
          Reject
        </button>
      </div>
    </article>
  );
};

export default Index;
