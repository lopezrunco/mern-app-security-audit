import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer, useState } from "react";

import { refreshToken } from "../../../../../../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../../../../../../utils/api-url";
import { AuthContext } from "../../../../../../../../../../App";
import {
  EDIT_PREOFFER_FAILURE,
  EDIT_PREOFFER_REQUEST,
  EDIT_PREOFFER_SUCCESS,
} from "../../../../../../../../../../utils/action-types";

const initialState = {
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case EDIT_PREOFFER_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case EDIT_PREOFFER_SUCCESS:
      return {
        ...state,
        isSending: false,
      };
    case EDIT_PREOFFER_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function RefuseAcceptPreoffer({ preoffer }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setShowModal(!showModal);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const editPreoffer = () => {
    dispatch({
      type: EDIT_PREOFFER_REQUEST,
    });

    fetch(apiUrl(`preoffers/${preoffer.id}`), {
      method: "PUT",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accepted: !preoffer.accepted,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        dispatch({
          type: EDIT_PREOFFER_SUCCESS,
          payload: data,
        });
        navigate("/mensaje", {
          state: {
            title: "Preoferta editada",
            message: "Redirigiendo a Mis remates...",
            duration: "2000",
            navigateTo: "/consignatarios/mis-remates",
          },
        });
      })
      .catch((error) => {
        console.error("Error trying to edit the preoffer", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleClick()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: EDIT_PREOFFER_FAILURE,
          });
        }
      });
  };

  if (preoffer.accepted) {
    return (
      <React.Fragment>
        <span className="acepted" role="button" onClick={handleClick}>
          Aceptada
        </span>
        {showModal && (
          <div className="confirmation-modal">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="content-wrap">
                    <h3>¿Descartar esta preoferta?</h3>
                    <div>
                      <a
                        className="button button-dark me-3"
                        onClick={editPreoffer}
                      >
                        <i className="fas fa-check"></i> Aceptar
                      </a>
                      <a className="button button-dark" onClick={closeModal}>
                        <i className="fas fa-times"></i> Cancelar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <span className="refused" role="button" onClick={handleClick}>
          No aceptada
        </span>
        {showModal && (
          <div className="confirmation-modal">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="content-wrap">
                    <h3>¿Aceptar esta preoferta?</h3>
                    <div>
                      <a
                        className="button button-dark me-3"
                        onClick={editPreoffer}
                      >
                        <i className="fas fa-check"></i> Aceptar
                      </a>
                      <a className="button button-dark" onClick={closeModal}>
                        <i className="fas fa-times"></i> Cancelar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default RefuseAcceptPreoffer;
