import { motion } from "framer-motion";
import React from "react";

import { Breadcrumbs } from "../../../components/Breadcrumbs";

import "./styles.scss";

export const BackOfficeHome = () => {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Administración"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        viewport={{ once: true }}
      >
        <section className="backoffice-home-page">
          <article className="container">
            <div className="row">
              <div className="col-12 col-lg-3 mb-5 mb-lg-0 admin-home-card">
                <h3>Remates</h3>
                <div className="separator"></div>
                <a href="/consignatarios/crear-remate" title="Crea un nuevo remate al que se le podrán agregar lotes y preofertas.">
                  <i className="fas fa-gavel me-2"></i> Crear remate
                </a>
                <a href="/admin/remates" title="Muestra todos los remates creados por los diferentes usuarios.">
                  <i className="fas fa-list me-2"></i>Listar remates
                </a>
              </div>
              <div className="col-12 col-lg-3 mb-5 mb-lg-0 admin-home-card">
                <h3>Artículos</h3>
                <div className="separator"></div>
                <a href="/autor/articulos/crear">
                  <i className="fas fa-file me-2"></i> Crear artículo
                </a>
                <a href="/autor/articulos/mis-articulos" title="Muestra solo los artículos creados por mí.">
                  <i className="fas fa-list me-2"></i>Listar mis artículos
                </a>
                <a href="/admin/articulos" title="Muestra todos los artículos creados por los diferentes usuarios.">
                  <i className="fas fa-list me-2"></i>Listar todos los artículos
                </a>
                {/* <a href="/autor/articulos/categorias/listar" title="Muestra todas las categorías de artículos creadas.">
                  <i className="fas fa-list me-2"></i>Listar categorías
                </a> */}
                {/* <a href="/autor/articulos/etiquetas/listar" title="Muestra todos las etiquetas creadas en los artículos por los diferentes usuarios.">
                  <i className="fas fa-tags me-2"></i>Listar etiquetas
                </a> */}
              </div>
              <div className="col-12 col-lg-3 mb-5 mb-lg-0 admin-home-card">
                <h3>Anuncios</h3>
                <div className="separator"></div>
                <a href="/autor/anuncios/crear-anuncio" title="Crea una nuevo anuncio para la sección de blog.">
                  <i className="fas fa-bullhorn me-2"></i> Crear anuncio
                </a>
                <a href="/autor/anuncios/mis-anuncios" title="Muestra solo los anuncios creados por mí.">
                  <i className="fas fa-list me-2"></i>Listar mis anuncios
                </a>
                <a href="/admin/anuncios/listar" title="Muestra todos los anuncios creados por los diferentes usuarios.">
                  <i className="fas fa-list me-2"></i>Listar todos los anuncios
                </a>
                {/* <a href="/admin/anuncios/ayuda">
                  <i className="fas fa-info-circle me-2"></i>Ayuda
                </a> */}
              </div>
              <div className="col-12 col-lg-3 mb-5 mb-lg-0 admin-home-card">
                <h3>Usuarios</h3>
                <div className="separator"></div>
                <a href="/admin/usuarios" title="Muestra todos los usuarios registrados en el sistema.">
                  <i className="fas fa-users me-2"></i>Listar usuarios
                </a>
              </div>
            </div>
          </article>
        </section>
      </motion.div>
    </React.Fragment>
  );
};
