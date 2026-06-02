import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  GET_MY_PREOFFERS_FAILURE,
  GET_MY_PREOFFERS_REQUEST,
  GET_MY_PREOFFERS_SUCCESS,
  HIDE_LOADER,
  SHOW_LOADER,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import MyPreofferCard from "./components/MyPreofferCard";
import Pagination from "../../../components/Pagination";
import { Loader } from "../../../components/Loader";

const initialState = {
  preoffersList: [],
  isFetching: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case GET_MY_PREOFFERS_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasError: false,
      };
    case GET_MY_PREOFFERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        preoffersList: action.payload.preoffers,
      };
    case GET_MY_PREOFFERS_FAILURE:
      return {
        ...state,
        hasError: true,
        isFetching: false,
      };
    default:
      return state;
  }
};

function MyPreOffers() {
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  // Handle pagination
  const [currentPage, setCurentPage] = useState(1);
  const itemsPerPage = 9;
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
        type: GET_MY_PREOFFERS_REQUEST,
      });

      fetch(
        apiUrl(
          `/preoffers/user/${authState.user.id}?page=${currentPage}&itemsPerPage=${itemsPerPage}`
        ),
        {
          headers: {
            Authorization: authState.token,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw response;
          }
        })
        .then((data) => {
          dispatch({
            type: GET_MY_PREOFFERS_SUCCESS,
            payload: data,
          });
        })
        .catch((error) => {
          console.error("Error trying to fetch the events by user", error);
          if (error.status === 401) {
            refreshToken(authState.refreshToken, authDispatch, navigate);
          } else if (error.status === 403) {
            navigate("/forbidden");
          } else {
            dispatch({
              type: GET_MY_PREOFFERS_FAILURE,
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
    authState.user.id,
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
        <Breadcrumbs location={"Mis preofertas"} />
      </motion.div>
      <section>
        <article className="container">
          <div className="row">
            {state.isFetching ? (
              <Loader />
            ) : state.hasError ? (
              <p>Error al obtener los datos</p>
            ) : (
              <React.Fragment>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.3 }}
                  viewport={{ once: true }}
                >
                  {state.preoffersList.length > 0 ? (
                    state.preoffersList.map((preoffer) => (
                      <MyPreofferCard key={preoffer.id} preoffer={preoffer} />
                    ))
                  ) : (
                    <div className="col-lg-8">
                      <h3>No hay preofertas para mostrar</h3>
                      <div className="separator"></div>
                      <p>
                        Si ya ha realizado preofertas en el pasado, es posible
                        que el remate haya sido despublicado y las preofertas
                        eliminadas.
                      </p>
                      <p>Para preofertar, visite nuestra Cartelera.</p>
                      <a href="/cartelera" className="button button-dark-outline">
                        <i className="fas fa-home me-2"></i> Ver Cartelera
                      </a>
                    </div>
                  )}
                </motion.div>
              </React.Fragment>
            )}
            <Pagination
              elementList={state.preoffersList}
              currentPage={currentPage}
              prevPageFunction={prevPage}
              nextPageFunction={nextPage}
            />
          </div>
        </article>
      </section>
    </React.Fragment>
  );
}

export default MyPreOffers;
