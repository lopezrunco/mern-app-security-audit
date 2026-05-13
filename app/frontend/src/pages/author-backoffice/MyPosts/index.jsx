import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  HIDE_LOADER,
  SHOW_LOADER,
  SORT_POSTS,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";
import { Loader } from "../../../components/Loader";
import Pagination from "../../../components/Pagination";
import { PostByUserCard } from "./components/PostByUserCard";

const initialState = {
  postsList: [],
  isFetching: false,
  hasError: false,
  sortCriteria: null,
  sortOrder: "asc",
};

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasError: false,
      };
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        postsList: action.payload.posts,
      };
    case FETCH_POSTS_FAILURE:
      return {
        ...state,
        hasError: true,
        isFetching: false,
      };
    case SORT_POSTS: {
      const { criteria, order } = action.payload;
      let sortedList = [...state.postsList];

      switch (criteria) {
        case "title":
          sortedList.sort((a, b) => {
            if (order === "asc") {
              return a.title.localeCompare(b.title);
            } else {
              return b.title.localeCompare(a.title);
            }
          });
          break;
        case "createdAt":
          sortedList.sort((a, b) => {
            if (order === "asc") {
              return new Date(a.createdAt) - new Date(b.createdAt);
            } else {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
          });
          break;
        default:
          break;
      }

      return {
        ...state,
        postsList: sortedList,
        sortCriteria: criteria,
        sortOrder: order,
      };
    }
    default:
      return state;
  }
};

export const MyPosts = () => {
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  // Handle pagination
  const [currentPage, setCurentPage] = useState(1);
  const itemsPerPage = 12;
  function prevPage() {
    setCurentPage(currentPage - 1);
  }
  function nextPage() {
    setCurentPage(currentPage + 1);
  }

  const handleSort = (criteria) => {
    const newOrder =
      state.sortCriteria === criteria && state.sortOrder === "asc"
        ? "desc"
        : "asc";

    dispatch({
      type: SORT_POSTS,
      payload: {
        criteria,
        order: newOrder,
      },
    });
  };

  const SortArticles = () => {
    const handleSortChange = (e) => {
      const selectedCriteria = e.target.value;
      handleSort(selectedCriteria);
    };

    return (
      <div className="sort-articles">
        <label>
          Ordenar por:
          <select
            id="sort"
            value={state.sortCriteria}
            onChange={handleSortChange}
            className="ms-2"
          >
            <option value="title">Título</option>
            <option value="createdAt">Fecha de creación</option>
          </select>
        </label>
      </div>
    );
  };

  useEffect(() => {
    if (authState.token) {
      authDispatch({
        type: SHOW_LOADER,
      });
      dispatch({
        type: FETCH_POSTS_REQUEST,
      });

      fetch(
        apiUrl(`my-posts?page=${currentPage}&itemsPerPage=${itemsPerPage}`),
        {
          method: "POST",
          headers: {
            Authorization: authState.token,
            UserRole: authState.role,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: authState.user.id,
          }),
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
            type: FETCH_POSTS_SUCCESS,
            payload: data,
          });
        })
        .catch((error) => {
          console.error("Error trying to fetch the posts by user", error);
          if (error.status === 401) {
            refreshToken(authState.refreshToken, authDispatch, navigate);
          } else if (error.status === 403) {
            navigate("/forbidden");
          } else {
            dispatch({
              type: FETCH_POSTS_FAILURE,
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
        <Breadcrumbs location={"Mis artículos"} />
      </motion.div>
      <section className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          viewport={{ once: true }}
        >
          <Title
            title="Mis artículos"
            subtitle="Cree, edite y elimine sus artículos."
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          viewport={{ once: true }}
        >
          <article className="row">
            {state.isFetching ? (
              <Loader />
            ) : state.hasError ? (
              <p>Error al obtener los datos</p>
            ) : (
              <React.Fragment>
                <div className="blog-options">
                  <SortArticles />
                  <a className="button button-dark" href="/autor/articulos/crear">
                    <i className="fas fa-plus"></i> Crear artículo
                  </a>
                </div>
                {state.postsList.length > 0 ? (
                  state.postsList.map((post) => (
                    <PostByUserCard key={post.id} post={post} />
                  ))
                ) : (
                  <p>No hay artículos para mostrar...</p>
                )}
              </React.Fragment>
            )}
            <Pagination
              elementList={state.postsList}
              currentPage={currentPage}
              prevPageFunction={prevPage}
              nextPageFunction={nextPage}
            />
          </article>
        </motion.div>
      </section>
    </React.Fragment>
  );
};
