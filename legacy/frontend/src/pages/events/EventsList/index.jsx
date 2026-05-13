import { motion } from "framer-motion";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { refreshToken } from "../../../utils/refresh-token.js";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  FETCH_EVENTS_FAILURE,
  FETCH_EVENTS_REQUEST,
  FETCH_EVENTS_SUCCESS,
} from "../../../utils/action-types";

import LoadingMessage from "../../../components/LoadingMessage/index.jsx";
import { Title } from "../../../components/Title";
import { Breadcrumbs } from "../../../components/Breadcrumbs/index.jsx";
import Pagination from "../../../components/Pagination";
import Card from "./components/Card/index.jsx";
import { Live } from "../../../components/Live/index.jsx";

import "./styles.scss";

// Create context to manage events
export const EventsContext = createContext();

const initialState = {
  eventsList: [],
  isFetching: false,
  eventsFetched: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_EVENTS_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasError: false,
      };
    case FETCH_EVENTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        eventsList: action.payload.events,
        eventsFetched: true,
      };
    case FETCH_EVENTS_FAILURE:
      return {
        ...state,
        hasError: true,
        isFetching: false,
        eventsFetched: true,
      };
    default:
      return state;
  }
};

function EventsList() {
  const navigate = useNavigate();
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  // Handle pagination
  const [currentPage, setCurentPage] = useState(1);
  const itemsPerPage = 15;
  function prevPage() {
    setCurentPage(currentPage - 1);
  }
  function nextPage() {
    setCurentPage(currentPage + 1);
  }

  useEffect(() => {
    fetch(apiUrl(`events?page=${currentPage}&itemsPerPage=${itemsPerPage}`), {
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
          type: FETCH_EVENTS_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to fetch the events", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: FETCH_EVENTS_FAILURE,
          });
        }
      });
  }, [
    authDispatch,
    authState.token,
    authState.refreshToken,
    navigate,
    currentPage,
  ]);

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Cartelera"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        viewport={{ once: true }}
      >
        <Live events={state.eventsList} />
      </motion.div>

      <section className="events">
        <article className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3 }}
            viewport={{ once: true }}
          >
            <Title
              title="Cartelera de remates"
              subtitle="Estos son los próximos remates que estaremos transmitiendo en vivo."
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4 }}
            viewport={{ once: true }}
          >
            <div className="row">
              <div className="col-12">
                <div className="row">
                  {state.isFetching ? (
                    <LoadingMessage
                      title="Cargando eventos..."
                      message="Esto puede tardar un poco dependiendo de la cantidad de eventos en nuestro sistema."
                    />
                  ) : state.hasError ? (
                    <p>Error al obtener los datos</p>
                  ) : (
                    <>
                      {state.eventsList.length > 0
                        ? state.eventsList.map((event) => (
                            <Card key={event.id} event={event} />
                          ))
                        : state.eventsFetched && (
                            <p>No hay remates para mostrar...</p>
                          )}
                    </>
                  )}
                </div>
              </div>
              <Pagination
                elementList={state.eventsList}
                currentPage={currentPage}
                prevPageFunction={prevPage}
                nextPageFunction={nextPage}
              />
            </div>
          </motion.div>
        </article>
      </section>
    </React.Fragment>
  );
}

export default EventsList;
