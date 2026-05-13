import React, { useContext } from "react";

import { LOGOUT, LOGGING_OUT } from "../../utils/action-types";
import { getTodayES } from "../../utils/get-today-es";
import { AuthContext } from "../../App";

import "./styles.scss";

export const Top = () => {
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  const handleLogout = () => {
    authDispatch({ type: LOGGING_OUT });
    authDispatch({ type: LOGOUT });
  };

  return (
    <div className="top" id="top">
      <div className="container">
        <div className="row">
          <div className="content-wrapper">
            <div className="user-info">
              {authState.user ? (
                <small>
                  <i className="fas fa-user"></i> {authState.user.nickname}
                </small>
              ) : null}
            </div>
            <div className="user-links">
              {authState.user ? (
                <small>
                  <a href="/login" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Cerrar sesión
                  </a>
                </small>
              ) : (
                <React.Fragment>
                  <small className="top-date">
                    <i className="far fa-calendar-alt me-2"></i> {getTodayES()}
                  </small>
                  {/* <small>
                    <a href="/login">
                      <i className="fas fa-user"></i> Iniciar sesión
                    </a>
                  </small>
                  <small>
                    <a href="/register">
                      <i className="fa fa-sign-in-alt"></i>Registro
                    </a>
                  </small> */}
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
