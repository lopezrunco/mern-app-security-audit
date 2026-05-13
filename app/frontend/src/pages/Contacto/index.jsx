import { motion } from "framer-motion";
import React from "react";

import { Breadcrumbs } from "../../components/Breadcrumbs";
import { aboutData } from "../../data/about";

export const Contacto = () => {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Contacto"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <section className="contact-info-cards bg-md-light">
          <article className="container">
            <div className="row">
              <div className="col-12">
                <h3>Información de contacto</h3>
                <div className="separator"></div>
              </div>
            </div>
            <div className="row">
              {aboutData.contactInfo.map((infoEl, i) => {
                return (
                  <div className="col-lg-4 mb-3 mb-lg-0" key={i}>
                    <a
                      href={infoEl.link}
                      target="_blank"
                      rel="noreferrer"
                      className="info-card green"
                    >
                      <div className="wrapper">
                        <i className={infoEl.iconClassname}></i>
                        <h4>{infoEl.title}</h4>
                        <a href={infoEl.link}>{infoEl.info}</a>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </article>
        </section>
        <section className="social-media-cards">
          <article className="container">
            <div className="col-12">
              <h3>Redes sociales</h3>
              <div className="separator"></div>
            </div>
            <div className="row">
              {aboutData.social.map((socialEl, i) => {
                return (
                  <div className="col-lg-3 mb-3 mb-lg-0" key={i}>
                    <a
                      href={socialEl.link}
                      target="_blank"
                      rel="noreferrer"
                      className="info-card"
                    >
                      <div className="wrapper">
                        <i className={socialEl.iconClassname}></i>
                        <h4>{socialEl.title}</h4>
                        <a href={socialEl.link}>{socialEl.info}</a>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </article>
        </section>
      </motion.div>
    </React.Fragment>
  );
};
