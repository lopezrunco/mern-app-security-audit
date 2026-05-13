import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer } from "react";

import { refreshToken } from "../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../utils/api-url";
import { AuthContext } from "../../../../../App";
import {
  EDIT_LOT_FAILURE,
  EDIT_LOT_REQUEST,
  EDIT_LOT_SUCCESS,
} from "../../../action-types";

const initialState = {
  videoSrc: "",
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case EDIT_LOT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case EDIT_LOT_SUCCESS:
      return {
        ...state,
        isSending: false,
        videoSrc: action.payload.videoSrc,
      };
    case EDIT_LOT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function AppendVideo({ lotId, videoName }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = () => {
    dispatch({
      type: EDIT_LOT_REQUEST,
    });

    fetch(apiUrl(`/lots/${lotId}`), {
      method: "PUT",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoSrc: videoName,
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
          type: EDIT_LOT_SUCCESS,
          payload: data,
        });
        navigate(`/consignatarios/mis-remates`);
      })
      .catch((error) => {
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: EDIT_LOT_FAILURE,
          });
        }
      });
  };

  return (
    <React.Fragment>
      <p>
        El archivo <i>{videoName}</i> se usará como video del lote
      </p>
      <a className="button button-dark" onClick={handleSubmit}>
        <i className="fas fa-check"></i> Aceptar
      </a>
    </React.Fragment>
  );
}

export default AppendVideo;
