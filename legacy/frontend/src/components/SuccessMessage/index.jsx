import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

import { Breadcrumbs } from "../Breadcrumbs";

import imgUrl from "../../assets/success.gif";

import "./styles.scss";

function SuccessMessage({
  title,
  message,
  redirectingMessage,
  duration,
  breadcrumbsLocation,
  navigateTo,
}) {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate(navigateTo);
    }, duration);
  }, [duration, navigate, navigateTo]);

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={breadcrumbsLocation} />
      </motion.div>
      <section className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          viewport={{ once: true }}
        >
          <article className="row success-message">
            <div className="col-lg-3 d-flex justify-content-center align-items-center">
              <img src={imgUrl} alt="" />
            </div>
            <div className="col-lg-9">
              <h2>{title}</h2>
              {message && <p>{message}</p>}
              {redirectingMessage && <p>{redirectingMessage}</p>}
              <div className="loader-line"></div>
            </div>
          </article>
        </motion.div>
      </section>
    </React.Fragment>
  );
}

export default SuccessMessage;
