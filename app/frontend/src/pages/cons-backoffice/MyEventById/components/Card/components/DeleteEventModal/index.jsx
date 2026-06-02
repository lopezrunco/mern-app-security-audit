import { useNavigate } from "react-router-dom";
import { useContext, useReducer } from "react";

import { refreshToken } from "../../../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../../../utils/api-url";
import { AuthContext } from "../../../../../../../App";
import {
  DELETE_EVENT_FAILURE,
  DELETE_EVENT_REQUEST,
  DELETE_EVENT_SUCCESS,
} from "../../../../../../../utils/action-types";

const initialState = {
  event: undefined,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case DELETE_EVENT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case DELETE_EVENT_SUCCESS:
      return {
        ...state,
        isSending: false,
        event: action.payload.event,
      };
    case DELETE_EVENT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function DeleteEventModal({ eventId, closeFunction }) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  const handleClick = () => {
    dispatch({
      type: DELETE_EVENT_REQUEST,
    });

    fetch(apiUrl(`/events/${eventId}`), {
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
          type: DELETE_EVENT_SUCCESS,
          payload: data,
        });
        navigate("/mensaje", {
          state: {
            title: "Remate borrado",
            message: "El remate ha sido borrado con éxito.",
            duration: "3000",
            navigateTo: "/consignatarios/mis-remates",
          },
        });
      })
      .catch((error) => {
        console.error("Error trying to delete the event", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: DELETE_EVENT_FAILURE,
          });
        }
      });
  };

  return (
    <div className="delete-modal">
      <div className="content-wrap">
        <p>¿Está seguro que desea eliminar el remate?</p>
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

export default DeleteEventModal;
