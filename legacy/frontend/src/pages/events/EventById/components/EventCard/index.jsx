import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useReducer } from "react";

import imgUrl from "../../../../../assets/no-media.jpg";

import { refreshToken } from "../../../../../utils/refresh-token";
import { getDate } from "../../../../../utils/get-date";
import { apiUrl } from "../../../../../utils/api-url";
import { AuthContext } from "../../../../../App";
import {
  GET_LOTS_FAILURE,
  GET_LOTS_REQUEST,
  GET_LOTS_SUCCESS,
} from "../../../../../utils/action-types";

import LotPreview from "./components/LotPreview";

import "./styles.scss";

const initialState = {
  data: undefined,
  isSending: false,
  hasError: false,
  showLots: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case GET_LOTS_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case GET_LOTS_SUCCESS:
      return {
        ...state,
        isSending: false,
        data: action.payload.lots,
        showLots: true,
      };
    case GET_LOTS_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function EventCard({ event }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: GET_LOTS_REQUEST,
    });

    fetch(apiUrl("/lots"), {
      method: "POST",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: event.id,
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
          type: GET_LOTS_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to get the lots", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: GET_LOTS_FAILURE,
          });
        }
      });
  }, [
    authDispatch,
    authState.refreshToken,
    authState.token,
    event.id,
    navigate,
  ]);

  return (
    <React.Fragment>
      <div className="col-12 event-card">
        <div className="item">
          <div className="row">
            <div className="col-lg-9">
              <div className="p-4">
                <h2>{event.title}</h2>
                <p className="date">{getDate(event.startBroadcastTimestamp)}</p>
                {event.description && <p><b>Descripción:</b> {event.description}</p>}
                {event.category && <p><b>Categoría:</b> {event.category}</p>}
                {event.company && <p><b>Remata:</b> {event.company}</p>}
                {event.organizer && <p><b>Organiza:</b> {event.organizer}</p>}
                {event.breeder && <p><b>Cabaña:</b> {event.breeder}</p>}
                {event.funder && <p><b>Financiación:</b> {event.funder}</p>}
                {event.location && <p><b>Lugar:</b> {event.location}</p>}
                {event.broadcastLinkId && (
                  <a
                    className="button view-more"
                    href={`https://www.youtube.com/watch/${event.broadcastLinkId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fas fa-play"></i> Transmisión
                  </a>
                )}
                {event.externalLink && (
                  <a
                    className="button view-more ms-3"
                    href={event.externalLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa fa-comment-dollar"></i> Preofertas
                  </a>
                )}
              </div>
            </div>
            <div className="col-lg-3">
              {event.eventType && (
                <span className="event-type-tag">{event.eventType}</span>
              )}
              {event.coverImgName ? (
                <img src={event.coverImgName} width="100%" />
              ) : (
                <img src={imgUrl} width="100%" />
              )}
            </div>
          </div>

          {state.showLots ? (
            <div className="lot-list-container">
              <div className="container">
                <div className="row">
                  {state.data.length === 0 ? (
                    <div className="col-12 mt-3">
                      {/* <p>No hay lotes en este remate.</p> */}
                    </div>
                  ) :(
                    <h3 className="mb-4">
                      <i className="fas fa-layer-group me-2"></i> Lotes de{" "}
                      {event.title}:
                  </h3>
                  )}
                  {state.data.map((lot) => {
                    return (
                      <LotPreview
                        key={lot.id}
                        lotId={lot.id}
                        lotTitle={lot.title}
                        lotvideoId={lot.YTVideoSrc}
                        lotCategory={lot.category}
                        animals={lot.animals}
                        name={lot.name}
                        location={lot.location}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="col-12 m-5">
              {/* <p>Cargando lotes...</p> */}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default EventCard;
