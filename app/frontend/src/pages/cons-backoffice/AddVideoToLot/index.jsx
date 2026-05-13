import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import React from "react";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import YouTubeVideo from "./components/YouTubeVideo";
import { Title } from "../../../components/Title";

const AddVideoToLot = () => {
  const { id } = useParams();

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Agregar video"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        viewport={{ once: true }}
      >
        <section className="upload-video-page">
          <article className="container">
            <Title
              title="Agregar video al lote"
              subtitle="Use un enlace de YouTube o suba un video desde su dispositivo"
            />
            <div className="row">
              <YouTubeVideo lotId={id} />
            </div>
          </article>
        </section>
      </motion.div>
    </React.Fragment>
  );
};

export default AddVideoToLot;
