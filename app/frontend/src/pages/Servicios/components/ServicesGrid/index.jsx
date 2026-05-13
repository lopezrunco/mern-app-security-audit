import { motion } from "framer-motion";
import { servicesData, videosData } from "../../../../data/services";

import streamImg from "../../../../assets/stream.svg";
import megaphoneImg from "../../../../assets/megaphone.svg";
import monitorImg from "../../../../assets/monitor.svg";
import hammerImg from "../../../../assets/hammer.svg";
import videoImg from "../../../../assets/camera.svg";

import "./styles.scss";

export const ServicesGrid = () => {
  return (
    <>
      <section className="services-grid">
        <article className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3 }}
            viewport={{ once: true }}
          >
            <div className="row">
              {servicesData.map((servicesEl) => (
                <div className="col-md-3 mb-4 mb-md-0" key={servicesEl.id}>
                  <div className="item">
                    {servicesEl.icon === "stream.svg" && (
                      <img src={streamImg} alt={servicesEl.title} />
                    )}
                    {servicesEl.icon === "megaphone.svg" && (
                      <img src={megaphoneImg} alt={servicesEl.title} />
                    )}
                    {servicesEl.icon === "monitor.svg" && (
                      <img src={monitorImg} alt={servicesEl.title} />
                    )}
                    {servicesEl.icon === "hammer.svg" && (
                      <img src={hammerImg} alt={servicesEl.title} />
                    )}
                    <h3>{servicesEl.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </article>
      </section>
      <section className="video-service">
        <article className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4 }}
            viewport={{ once: true }}
          >
            <div className="row">
              <div className="col title mb-4">
                <img src={videoImg} alt={videosData.title} />
                <h3>{videosData.title}</h3>
                <div className="separator"></div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6 }}
            viewport={{ once: true }}
          >
            <div className="row">
              {videosData.videos.map((videoEl, videoIdx) => (
                <div className="col-sm-6 col-lg-4" key={videoIdx}>
                  <div className="item">
                    <h5>{videoEl.title}</h5>
                    <div className="iframe-wrapper">
                      <small className="loading-msj">Cargando...</small>
                      <iframe
                        src={`https://www.youtube.com/embed/${videoEl.src}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </article>
      </section>
    </>
  );
};
