import { motion } from "framer-motion";
import React from "react";

import { Breadcrumbs } from "../../../components/Breadcrumbs";

export const Forbidden = () => {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Acceso no permitido"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        viewport={{ once: true }}
      >
        <section>
          <article className="container">
            <div className="row not-found">
              <div className="col-xl-5">
                <h1>403!</h1>
              </div>
              <div className="col-xl-7">
                <h2>Acceso no permitido</h2>
                <p>
                  Usted no tiene permiso para acceder a esta página. <br />
                  Por favor, regrese a la página principal e intente de nuevo.
                </p>
                <a className="button button-dark" href="/">
                  <i className="fas fa-home"></i> Inicio
                </a>
              </div>
            </div>
          </article>
        </section>
      </motion.div>
    </React.Fragment>
  );
};
