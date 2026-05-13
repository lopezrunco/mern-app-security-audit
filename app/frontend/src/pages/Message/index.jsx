import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

import imgUrl from "../../assets/success.gif";

import { Breadcrumbs } from "../../components/Breadcrumbs";

import "./styles.scss";

export const Message = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const title = location.state?.title
  const message = location.state?.message
  const duration = location.state?.duration
  const navigateTo = location.state?.navigateTo

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
        <Breadcrumbs location='Mensaje' />
      </motion.div>
      <section className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          viewport={{ once: true }}
        >
          <article className="row message-page">
            <div className="col-lg-3 d-flex justify-content-center align-items-center">
              <img src={imgUrl} alt="Message" />
            </div>
            <div className="col-lg-9">
              <h2>{title}</h2>
              {message && <p>{message}</p>}
              <div className="loader-line"></div>
            </div>
          </article>
        </motion.div>
      </section>
    </React.Fragment>
  );
};