import { useNavigate } from "react-router-dom";
import { useContext, useReducer } from "react";

import { refreshToken } from "../../../../../../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../../../../../../utils/api-url";
import { AuthContext } from "../../../../../../../../../../App";
import {
  DELETE_PREOFFER_FAILURE,
  DELETE_PREOFFER_REQUEST,
  DELETE_PREOFFER_SUCCESS,
} from "../../../../../../../../../../utils/action-types";

import "./styles.scss";

const initialState = {
  preoffer: undefined,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case DELETE_PREOFFER_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case DELETE_PREOFFER_SUCCESS:
      return {
        ...state,
        isSending: false,
        preoffer: action.payload.preoffer,
      };
    case DELETE_PREOFFER_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function DeleteLotModal({ preofferId, closeFunction }) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  const handleClick = () => {
    dispatch({
      type: DELETE_PREOFFER_REQUEST,
    });

    fetch(apiUrl(`/preoffers/${preofferId}`), {
      method: "DELETE",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
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
          type: DELETE_PREOFFER_SUCCESS,
          payload: data,
        });
        navigate("/mensaje", {
          state: {
            title: "Preoferta borrada",
            message: "La preoferta ha sido borrada con éxito.",
            duration: "3000",
            navigateTo: "/consignatarios/mis-remates",
          },
        });
      })
      .catch((error) => {
        console.error("Error trying to delete the preoffer", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: DELETE_PREOFFER_FAILURE,
          });
        }
      });
  };

  return (
    <div className="delete-preoffer-modal">
      <div className="content-wrap">
        <p>¿Está seguro que desea eliminar la preoferta?</p>
        <div>
          <a className="button button-dark me-3" onClick={handleClick}>
            <i className="fas fa-check"></i> Aceptar
          </a>
          <a className="button button-dark" onClick={closeFunction}>
            <i className="fas fa-times"></i> Cancelar
          </a>
        </div>
      </div>
    </div>
  );
}

export default DeleteLotModal;
