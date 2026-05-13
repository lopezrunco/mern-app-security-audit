import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useReducer } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  GET_LOT_FAILURE,
  GET_LOT_REQUEST,
  GET_LOT_SUCCESS,
  HIDE_LOADER,
  SHOW_LOADER,
} from "../../../utils/action-types";

import LotCard from "../EventById/components/EventCard/components/LotCard";
import { Breadcrumbs } from "../../../components/Breadcrumbs";

const initialState = {
  lot: undefined,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case GET_LOT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case GET_LOT_SUCCESS:
      return {
        ...state,
        isSending: false,
        lot: action.payload.lot,
      };
    case GET_LOT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function LotById() {
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
        type: GET_LOT_REQUEST,
      });

      fetch(apiUrl(`/lots/${id}`), {
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
            type: GET_LOT_SUCCESS,
            payload: data,
          });
        })
        .catch((error) => {
          console.error("Error trying to fetch the lot", error);

          if (error.status === 401) {
            refreshToken(authState.refreshToken, authDispatch, navigate);
          } else if (error.status === 403) {
            navigate("/forbidden");
          } else {
            dispatch({
              type: GET_LOT_FAILURE,
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
        <Breadcrumbs location={"Detalles de lote"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <section>
          <article className="container">
            <div className="row">
              {state.lot && <LotCard lot={state.lot} />}
              {state.hasError && <p>Error al obtener el lote</p>}
            </div>
          </article>
        </section>
      </motion.div>
    </React.Fragment>
  );
}

export default LotById;
