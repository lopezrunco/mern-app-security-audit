import { useNavigate } from "react-router-dom";
import { useContext, useReducer } from "react";

import {
  DELETE_AD_FAILURE,
  DELETE_AD_REQUEST,
  DELETE_AD_SUCCESS,
} from "../../../../../utils/action-types";
import { AuthContext } from "../../../../../App";
import { apiUrl } from "../../../../../utils/api-url";
import { refreshToken } from "../../../../../utils/refresh-token";
import { returnRouteAdsActions } from "../../../../../utils/return-route-by-user-type";

const initialState = {
  ad: undefined,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case DELETE_AD_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case DELETE_AD_SUCCESS:
      return {
        ...state,
        isSending: false,
        ad: action.payload.ad,
      };
    case DELETE_AD_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

export const DeleteAdModal = ({ adId, adTitle, closeFunction }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  const handleClick = () => {
    dispatch({
      type: DELETE_AD_REQUEST,
    });

    fetch(apiUrl(`/ads/${adId}`), {
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
          type: DELETE_AD_SUCCESS,
          payload: data,
        });
        navigate("/mensaje", {
          state: {
            title: "Anuncio borrado",
            message: "El anuncio ha sido borrado con éxito.",
            duration: "2000",
            navigateTo: returnRouteAdsActions(authState.user.role),
          },
        });
      })
      .catch((error) => {
        console.error("Error trying to delete the ad", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: DELETE_AD_FAILURE,
          });
        }
      });
  };

  return (
    <div className="delete-modal">
      <div className="content-wrap">
        <p>
          ¿Está seguro que desea eliminar el anuncio <b>{adTitle}</b>?
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
