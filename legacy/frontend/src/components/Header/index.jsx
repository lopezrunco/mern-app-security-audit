import React, { useState, useContext } from "react";

import { AuthContext } from "../../App";

import "./styles.scss";

export const Header = () => {
  const { state: authState } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const handleMenuClick = (e) => {
    setIsOpen(!isOpen);
    setActiveLink(e.target.hash);
  };

  return (
    <header className="header" id="inicio">
      <h1 className="main-logo">Campo Eventos</h1>
      <i
        className="fas fa-bars header-toggle"
        id="nav-toggle"
        onClick={handleMenuClick}
      ></i>

      <nav className={`navigation-bar ${isOpen ? "show" : ""}`} id="nav-menu">
        <div className="nav-content bd-grid">
          <i
            className="fas fa-times nav-close"
            id="nav-close"
            onClick={handleMenuClick}
          ></i>
          <div className="nav-menu">
            <ul className="nav-list">

              {/* Public menu */}
              <li className={`navigation-bar-item ${activeLink === '/' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                <a href="/" className="nav-link-item" title="Inicio">Inicio</a>
              </li>

              <li className={`navigation-bar-item ${activeLink === '/cartelera' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                <a href="/cartelera" className="nav-link-item" title="Cartelera">Cartelera</a>
              </li>

              <li className={`navigation-bar-item ${activeLink === '/servicios' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                <a href='/servicios' className="nav-link-item" title='Servicios'>Servicios</a>
              </li>

              <li className={`navigation-bar-item`} id="navigation-bar-item" onClick={handleMenuClick} >
                <a href='https://campoeventos.preofertas.uy/remates/rematespublicados' target="_blank" rel="noreferrer" className="nav-link-item" title='Ir a preofertas'>Ir a preofertas</a>
              </li>

              <li className={`navigation-bar-item ${activeLink === '/contacto' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                <a href='/contacto' className="nav-link-item" title='Contacto'>Contacto</a>
              </li>

              {/* Basic users */}
              {
                ['BASIC'].find(role => role === authState.role) &&
                <React.Fragment>
                  <li className={`navigation-bar-item ${activeLink === '/mis-preofertas' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                    <a href="/mis-preofertas" className="nav-link-item" title="Mis preofertas">Mis preofertas</a>
                  </li>
                </React.Fragment>
              }

              {/* Consignatarios users */}
              {
                ['CONS', 'ADMIN'].find(role => role === authState.role) &&
                <React.Fragment>
                  <li className={`navigation-bar-item ${activeLink === '/consignatarios/mis-remates' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                    <a href="/consignatarios/mis-remates" className="nav-link-item" title="Mis remates">Mis remates</a>
                  </li>
                </React.Fragment>
              }

              {/* Autores users */}
              {
                ['AUTHOR'].find(role => role === authState.role) &&
                <React.Fragment>
                  <li className={`navigation-bar-item ${activeLink === '/autor/articulos/mis-articulos' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                    <a href="/autor/articulos/mis-articulos" className="nav-link-item" title="Mis artículos">Mis artículos</a>
                  </li>
                  <li className={`navigation-bar-item ${activeLink === '/autor/anuncios/mis-anuncios' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                    <a href="/autor/anuncios/mis-anuncios" className="nav-link-item" title="Mis anuncios">Mis anuncios</a>
                  </li>
                </React.Fragment>
              }

              {/* Administrator users */}
              {
                ['ADMIN'].find(role => role === authState.role) &&
                <React.Fragment>
                  <li className={`navigation-bar-item admin ${activeLink === '/admin' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                    <a href="/admin" className="nav-link-item" title="Administracion">Administradores</a>
                  </li>
                </React.Fragment>
              }

            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
