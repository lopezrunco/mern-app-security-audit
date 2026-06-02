import { useNavigate } from "react-router-dom";
import { useContext, useReducer } from "react";

import { refreshToken } from "../../../../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../../../../utils/api-url";
import { AuthContext } from "../../../../../../../../App";
import {
  DELETE_LOT_FAILURE,
  DELETE_LOT_REQUEST,
  DELETE_LOT_SUCCESS,
} from "../../../../../../../../utils/action-types";

import "./styles.scss";

const initialState = {
  lot: undefined,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case DELETE_LOT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case DELETE_LOT_SUCCESS:
      return {
        ...state,
        isSending: false,
        lot: action.payload.lot,
      };
    case DELETE_LOT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function DeleteLotModal({ lotId, closeFunction }) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  const handleClick = () => {
    dispatch({
      type: DELETE_LOT_REQUEST,
    });

    fetch(apiUrl(`/lots/${lotId}`), {
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
          type: DELETE_LOT_SUCCESS,
          payload: data,
        });
        navigate("/mensaje", {
          state: {
            title: "Lote borrado",
            message: "El lote ha sido borrado con éxito.",
            duration: "2000",
            navigateTo: "/consignatarios/mis-remates",
          },
        });
      })
      .catch((error) => {
        console.error("Error trying to delete the lot", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: DELETE_LOT_FAILURE,
          });
        }
      });
  };

  return (
    <div className="delete-lot-modal">
      <div className="content-wrap">
        <p>¿Está seguro que desea eliminar el lote?</p>
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
