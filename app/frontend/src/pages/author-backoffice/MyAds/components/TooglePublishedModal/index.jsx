import { useNavigate } from "react-router-dom";
import { useContext, useReducer } from "react";

import {
  EDIT_AD_FAILURE,
  EDIT_AD_REQUEST,
  EDIT_AD_SUCCESS,
} from "../../../../../utils/action-types";
import { AuthContext } from "../../../../../App";
import { apiUrl } from "../../../../../utils/api-url";
import { refreshToken } from "../../../../../utils/refresh-token";
import { returnRouteAdsActions } from "../../../../../utils/return-route-by-user-type";

const initialState = {
  published: undefined,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case EDIT_AD_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case EDIT_AD_SUCCESS:
      return {
        ...state,
        isSending: false,
        ad: action.payload.ad,
      };
    case EDIT_AD_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

export const TooglePublishedModal = ({
  adId,
  adTitle,
  published,
  closeFunction,
}) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  const handleClick = () => {
    dispatch({
      type: EDIT_AD_REQUEST,
    });

    fetch(apiUrl(`/ads/${adId}`), {
      method: "PUT",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        published: !published,
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
          type: EDIT_AD_SUCCESS,
          payload: data,
        });
        navigate("/mensaje", {
          state: {
            title: `Anuncio ${published ? "despublicado" : "publicado"}`,
            message: `El anuncio ha sido ${
              published ? "despublicado" : "publicado"
            } con éxito.`,
            duration: "2000",
            navigateTo: returnRouteAdsActions(authState.user.role),
          },
        });
      })
      .catch((error) => {
        console.error("Error al editar el anuncio.", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleClick()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: EDIT_AD_FAILURE,
          });
        }
      });
  };

  return (
    <div className="edit-modal">
      <div className="content-wrap">
        <p>
          ¿Está seguro que desea {published ? "despublicar" : "publicar"} el
          anuncio <b>{adTitle}</b>?
        </p>
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
