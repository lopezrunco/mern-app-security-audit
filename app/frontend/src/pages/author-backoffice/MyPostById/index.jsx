import { motion } from "framer-motion";
import React, { useContext, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { refreshToken } from "../../../utils/refresh-token";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  GET_MY_POST_FAILURE,
  GET_MY_POST_REQUEST,
  GET_MY_POST_SUCCESS,
  HIDE_LOADER,
  SHOW_LOADER,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import Card from "./components/Card";

const initialState = {
  myPost: undefined,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case GET_MY_POST_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case GET_MY_POST_SUCCESS:
      return {
        ...state,
        isSending: false,
        myPost: action.payload.post,
      };
    case GET_MY_POST_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

export const MyPostById = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  useEffect(() => {
    if (authState.token) {
      authDispatch({
        type: SHOW_LOADER,
      });
      dispatch({
        type: GET_MY_POST_REQUEST,
      });

      fetch(apiUrl(`/posts/${id}`), {
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
            type: GET_MY_POST_SUCCESS,
            payload: data,
          });
        })
        .catch((error) => {
          console.error("Error trying to fetch the post", error);
          if (error.status === 401) {
            refreshToken(authState.refreshToken, authDispatch, navigate);
          } else if (error.status === 403) {
            navigate("/forbidden");
          } else {
            dispatch({
              type: GET_MY_POST_FAILURE,
            });
          }
        })
        .finally(() => {
          authDispatch({
            type: HIDE_LOADER,
          });
        });
    }
  }, [authDispatch, authState.refreshToken, authState.token, id, navigate]);

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Detalles del artículo"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        viewport={{ once: true }}
      >
        <section className="my-post-by-id">
          <article className="container">
            {state.myPost && <Card myPost={state.myPost} />}
            {state.hasError && <p>Error al obtener el artículo</p>}
          </article>
        </section>
      </motion.div>
    </React.Fragment>
  );
};
