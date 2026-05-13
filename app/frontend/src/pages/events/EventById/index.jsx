import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useReducer } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  FETCH_EVENT_FAILURE,
  FETCH_EVENT_REQUEST,
  FETCH_EVENT_SUCCESS,
  HIDE_LOADER,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import EventCard from "./components/EventCard";

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

function EventById() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  useEffect(() => {
    dispatch({
      type: FETCH_EVENT_REQUEST,
    });

    fetch(apiUrl(`/events/${id}`), {
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
      })
      .finally(() => {
        authDispatch({
          type: HIDE_LOADER,
        });
      });
  }, [authDispatch, authState.refreshToken, authState.token, id, navigate]);

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Detalles del remate"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <section className="event-id">
          <article className="container">
            {state.event ? (
              <EventCard event={state.event} />
            ) : state.hasError ? (
              <p>Error al obtener el remate</p>
            ) : (
              <p>Cargando detalles del remate...</p>
            )}
          </article>
        </section>
      </motion.div>
    </React.Fragment>
  );
}

export default EventById;
