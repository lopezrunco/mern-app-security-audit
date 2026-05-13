import { motion } from "framer-motion";
import React from "react";

import { Breadcrumbs } from "../../components/Breadcrumbs";
import { ServicesGrid } from "./components/ServicesGrid";

export const Servicios = () => {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Servicios"} />
      </motion.div>
      <ServicesGrid />
    </React.Fragment>
  );
};
