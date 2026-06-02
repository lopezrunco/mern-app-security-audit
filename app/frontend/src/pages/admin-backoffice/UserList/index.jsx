import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  FETCH_USERS_FAILURE,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  HIDE_LOADER,
  SHOW_LOADER,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import Pagination from "../../../components/Pagination";
import { Loader } from "../../../components/Loader";
import UserCard from "./components/UserCard";

const initialState = {
  users: [],
  usercount: 0,
  isFetching: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasError: false,
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        users: action.payload.users,
        usercount: action.payload.meta.count,
      };
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        hasError: true,
        isFetching: false,
      };
    default:
      return state;
  }
};

function UserList() {
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
        type: FETCH_USERS_REQUEST,
      });

      fetch(
        apiUrl(`admin/users?page=${currentPage}&itemsPerPage=${itemsPerPage}`),
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
            type: FETCH_USERS_SUCCESS,
            payload: data,
          });
        })
        .catch((error) => {
          console.error("Error fetching the users", error);
          if (error.status === 401) {
            refreshToken(authState.refreshToken, authDispatch, navigate);
          } else if (error.status === 403) {
            navigate("/forbidden");
          } else {
            dispatch({
              type: FETCH_USERS_FAILURE,
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
        <Breadcrumbs location={"Usuarios activos"} />
      </motion.div>
      <section className="user-list">
        <article className="container">
          <div className="row">
            <div className="col-12">
              {!state.hasError && (
                <h3 className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.3 }}
                    viewport={{ once: true }}
                  >
                    <i className="fas fa-user me-3"></i> Total:{" "}
                    {state.usercount}
                  </motion.div>
                </h3>
              )}
            </div>
          </div>
          <div className="row user-list-container">
            {state.isFetching ? (
              <Loader />
            ) : state.hasError ? (
              <p>Error al obtener los usuarios</p>
            ) : (
              <>
                {state.users.length > 0 ? (
                  state.users.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))
                ) : (
                  <p>No hay usuarios</p>
                )}
              </>
            )}
            <Pagination
              elementList={state.users}
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

export default UserList;
