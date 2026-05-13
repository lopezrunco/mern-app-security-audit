import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useReducer } from "react";

import { refreshToken } from "../../../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../../../utils/api-url";
import { AuthContext } from "../../../../../../../App";
import {
  FETCH_EVENT_FAILURE,
  FETCH_EVENT_REQUEST,
  FETCH_EVENT_SUCCESS,
} from "../../../../../../../utils/action-types";

const initialState = {
  event: undefined,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_EVENT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case FETCH_EVENT_SUCCESS:
      return {
        ...state,
        isSending: false,
        event: action.payload.event,
      };
    case FETCH_EVENT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

export const PreofferDetails = ({
  lotId,
  lotTitle,
  YTVideoSrc,
  lotEventId,
}) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  useEffect(() => {
    dispatch({
      type: FETCH_EVENT_REQUEST,
    });

    fetch(apiUrl(`/events/${lotEventId}`), {
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
          type: FETCH_EVENT_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to fetch the event", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: FETCH_EVENT_FAILURE,
          });
        }
      });
  }, [
    authDispatch,
    authState.refreshToken,
    authState.token,
    lotEventId,
    navigate,
  ]);

  return (
    <div className="preoffer-details">
      {state.event && (
        <p className="mb-0">
          <b>Remate: </b>
          {state.event.title}
        </p>
      )}
      <p>
        <b>Lote: </b>
        {lotTitle}︱
        <i>
          <a href={`/lotes/${lotId}`}>Ver detalles</a>
        </i>
      </p>
      {YTVideoSrc ? (
        <iframe
          src={`https://www.youtube.com/embed/${YTVideoSrc}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ) : (
        <p>Este lote no tiene video</p>
      )}
    </div>
  );
};

export default PreofferDetails;
