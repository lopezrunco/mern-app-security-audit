import { motion } from "framer-motion";
import React from "react";

import { NotFoundMessage } from "./components/NotFoundMessage";
import { Breadcrumbs } from "../../../components/Breadcrumbs";

export const NotFound = () => {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"No encontrado"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        viewport={{ once: true }}
      >
        <section>
          <NotFoundMessage />
        </section>
      </motion.div>
    </React.Fragment>
  );
};
