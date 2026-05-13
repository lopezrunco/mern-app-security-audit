import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { AuthContext } from "../../../App";
import { apiUrl } from "../../../utils/api-url";
import { refreshToken } from "../../../utils/refresh-token";
import {
  FETCH_EVENTS_FAILURE,
  FETCH_EVENTS_REQUEST,
  FETCH_EVENTS_SUCCESS,
  HIDE_LOADER,
  SHOW_LOADER,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Loader } from "../../../components/Loader";
import Pagination from "../../../components/Pagination";
import EventByUserCard from "../../cons-backoffice/MyEvents/EventByUserCard";
import { Title } from "../../../components/Title";

const initialState = {
  eventsList: [],
  isFetching: false,
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
      };
    case FETCH_EVENTS_FAILURE:
      return {
        ...state,
        hasError: true,
        isFetching: false,
      };
    default:
      return state;
  }
};

function AllEvents() {
  const navigate = useNavigate();
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  // Handle pagination
  const [currentPage, setCurentPage] = useState(1);
  const itemsPerPage = 12;
  function prevPage() {
    setCurentPage(currentPage - 1);
  }
  function nextPage() {
    setCurentPage(currentPage + 1);
  }

  useEffect(() => {
    if (authState.token) {
      authDispatch({
        type: SHOW_LOADER,
      });
      dispatch({
        type: FETCH_EVENTS_REQUEST,
      });

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
        })
        .finally(() => {
          authDispatch({
            type: HIDE_LOADER,
          });
        });
    }
  }, [
    authDispatch,
    authState.refreshToken,
    authState.token,
    currentPage,
    navigate,
  ]);

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Lista de remates"} />
      </motion.div>

      <section className="backoffice-events-page">
        <article className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3 }}
            viewport={{ once: true }}
          >
            <Title
              title="Lista de remates"
              subtitle="Todos los remates subidos por los consignatarios."
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
                    <Loader />
                  ) : state.hasError ? (
                    <p>Error al obtener los datos</p>
                  ) : (
                    <React.Fragment>
                      {state.eventsList.length > 0 ? (
                        state.eventsList.map((event) => (
                          <EventByUserCard key={event.id} event={event} />
                        ))
                      ) : (
                        <p>En este momento, no hay remates.</p>
                      )}
                    </React.Fragment>
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

export default AllEvents;
