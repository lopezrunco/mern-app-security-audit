import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer } from "react";

import {
  EDIT_POST_FAILURE,
  EDIT_POST_REQUEST,
  EDIT_POST_SUCCESS,
} from "../../../../../utils/action-types";
import { AuthContext } from "../../../../../App";
import { apiUrl } from "../../../../../utils/api-url";
import { refreshToken } from "../../../../../utils/refresh-token";

const initialState = {
  coverImgName: "",
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case EDIT_POST_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case EDIT_POST_SUCCESS:
      return {
        ...state,
        isSending: false,
        coverImgName: action.payload.coverImgName,
      };
    case EDIT_POST_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

export const AppendImage = ({ articleId, imageName }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = () => {
    dispatch({
      type: EDIT_POST_REQUEST,
    });

    fetch(apiUrl(`/posts/${articleId}`), {
      method: "PUT",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        picture: imageName,
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
          type: EDIT_POST_SUCCESS,
          payload: data,
        });
        navigate(`/autor/articulos/mis-articulos/${articleId}`);
      })
      .catch((error) => {
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: EDIT_POST_FAILURE,
          });
        }
      });
  };

  return (
    <React.Fragment>
      <p>¿Usar este archivo como imagen del artículo?</p>
      <a className="button button-dark mb-0" onClick={handleSubmit}>
        <i className="fas fa-check"></i> Aceptar
      </a>
    </React.Fragment>
  );
};
