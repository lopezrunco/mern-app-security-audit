import { useNavigate } from "react-router-dom";
import { useContext, useReducer } from "react";

import { refreshToken } from "../../../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../../../utils/api-url";
import { AuthContext } from "../../../../../../../App";
import {
  DELETE_POST_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
} from "../../../../../../../utils/action-types";
import { returnRouteBlogActions } from "../../../../../../../utils/return-route-by-user-type";

const initialState = {
  post: undefined,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case DELETE_POST_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case DELETE_POST_SUCCESS:
      return {
        ...state,
        isSending: false,
        post: action.payload.post,
      };
    case DELETE_POST_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

export const DeletePostModal = ({ postId, closeFunction }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  const handleClick = () => {
    dispatch({
      type: DELETE_POST_REQUEST,
    });

    fetch(apiUrl(`/posts/${postId}`), {
      method: "DELETE",
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
          type: DELETE_POST_SUCCESS,
          payload: data,
        });
        navigate("/mensaje", {
          state: {
            title: "Artículo borrado",
            message: "El artículo ha sido borrado con éxito.",
            duration: "2000",
            navigateTo: returnRouteBlogActions(authState.user.role),
          },
        });
      })
      .catch((error) => {
        console.error("Error trying to delete the post", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: DELETE_POST_FAILURE,
          });
        }
      });
  };

  return (
    <div className="delete-modal">
      <div className="content-wrap">
        <p>¿Está seguro que desea eliminar el artículo?</p>
        <div>
          <a className="button button-dark me-3" onClick={handleClick}>
            <i className="fas fa-check"></i> Aceptar
          </a>
          <a className="button button-dark" onClick={closeFunction}>
            <i className="fas fa-times"></i> Cancelar
          </a>
        </div>
      </div>
    </div>
  );
};
