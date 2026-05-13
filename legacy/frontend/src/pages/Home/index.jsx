import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { refreshToken } from "../../utils/refresh-token";
import { apiUrl } from "../../utils/api-url";
import { AuthContext } from "../../App";
import {
  ALL,
  CONTENT_LEFT,
  CONTENT_RIGHT,
  DARK,
  IMG_TITLE,
} from "../../utils/blog-card-types";
import {
  FETCH_EVENTS_FAILURE,
  FETCH_EVENTS_REQUEST,
  FETCH_EVENTS_SUCCESS,
} from "../../utils/action-types";

import { Intro } from "../../components/Intro";
import { Live } from "../../components/Live";
import { Ad } from "../../components/Ad";
import { LastPosts } from "./components/LastPosts";
import { PostsByCategory } from "./components/PostsByCategory";

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

export const Home = () => {
  const navigate = useNavigate();
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  const [currentPage, setCurentPage] = useState(1);
  const itemsPerPage = 15;

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
        <Intro />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        viewport={{ once: true }}
      >
        <Live events={state.eventsList} />
      </motion.div>

      <LastPosts
        bgClass="bg-light"
        containerClass="container"
        btnClass="button-dark-outline"
        items="6"
        colClass={"col-lg-4"}
        cardType={ALL}
        showTitle={false}
      />

      <div className="container">
        <div className="ad-wrapper">
          <Ad position="news-1-left" />
          <Ad position="news-1-right" />
        </div>
      </div>

      <PostsByCategory
        bgClass="bg-md-light"
        containerClass="container"
        btnClass="button-dark"
        category="Zafras"
        items="2"
        colClass={"col-lg-6"}
        cardType={ALL}
        showTitle={true}
      />

      <div className="container">
        <div className="ad-wrapper">
          <Ad position="news-2-left" />
          <Ad position="news-2-right" />
        </div>
      </div>

      <PostsByCategory
        bgClass="bg-light"
        containerClass="container"
        btnClass="button button-dark-outline"
        category="Ferias"
        items="3"
        colClass={"col-12"}
        cardType={CONTENT_RIGHT}
        showTitle={true}
      />

      <div className="container">
        <div className="ad-wrapper">
          <Ad position="news-3-left" />
          <Ad position="news-3-right" />
        </div>
      </div>

      <PostsByCategory
        bgClass="bg-md-light"
        containerClass="container"
        btnClass="button button-dark"
        category="Pantalla"
        items="2"
        colClass={"col-lg-6"}
        cardType={IMG_TITLE}
        showTitle={true}
      />

      <div className="container">
        <div className="ad-wrapper">
          <Ad position="news-4-left" />
          <Ad position="news-4-right" />
        </div>
      </div>

      <PostsByCategory
        bgClass="bg-light"
        containerClass="container"
        btnClass="button button-dark"
        category="Equinos"
        items="3"
        colClass={"col-lg-12"}
        cardType={CONTENT_LEFT}
        showTitle={true}
      />

      <div className="container">
        <div className="ad-wrapper">
          <Ad position="news-5-left" />
          <Ad position="news-5-right" />
        </div>
      </div>

      <PostsByCategory
        bgClass="bg-md-light"
        containerClass="container"
        btnClass="button button-light-outline"
        category="Eventos"
        items="2"
        colClass={"col-lg-12"}
        cardType={DARK}
        showTitle={true}
      />

      <PostsByCategory
        bgClass="bg-image"
        containerClass="container-fluid"
        btnClass="button button-dark"
        category="Sociales"
        items="3"
        colClass={"col-lg-4"}
        cardType={IMG_TITLE}
        showTitle={false}
        showBanner={true}
      />
    </React.Fragment>
  );
};
