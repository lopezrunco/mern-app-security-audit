import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useReducer } from "react";

import { refreshToken } from "../../../../../../../utils/refresh-token";
import { apiUrl } from "../../../../..../../../../../utils/api-url";
import { AuthContext } from "../../../../../../../App";
import {
  GET_PREOFFERS_FAILURE,
  GET_PREOFFERS_REQUEST,
  GET_PREOFFERS_SUCCESS,
} from "../../../../../../../utils/action-types";

import NoVideoMsj from "../../../../../../../components/NoVideoMsj";

import "./styles.scss";

const initialState = {
  data: undefined,
  isSending: false,
  hasError: false,
  showPreoffers: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case GET_PREOFFERS_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case GET_PREOFFERS_SUCCESS:
      return {
        ...state,
        isSending: false,
        data: action.payload.preoffers,
        showPreoffers: true,
      };
    case GET_PREOFFERS_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function LotPreview({
  lotId,
  lotTitle,
  lotvideoId,
  lotCategory,
  animals,
  name,
  location,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const getLastAcceptedPreoffer = (preoffersList) => {
    let amountList = [];
    preoffersList.map((preoffer) => {
      if (preoffer.accepted) amountList.push(preoffer.amount);
    });
    if (amountList.length === 0) {
      return null;
    } else {
      return (
        <span className="last-preoffer-tag">
          Mayor preoferta:{" "}
          <b>U$S {amountList.sort((a, b) => a - b).reverse()[0]}</b>
        </span>
      );
    }
  };

  useEffect(() => {
    dispatch({
      type: GET_PREOFFERS_REQUEST,
    });

    fetch(apiUrl("/preoffers"), {
      method: "POST",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lotId: lotId,
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
          type: GET_PREOFFERS_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to get the preoffers", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: GET_PREOFFERS_FAILURE,
          });
        }
      });
  }, [authDispatch, authState.refreshToken, authState.token, lotId, navigate]);

  return (
    <div className="col-12 lot-preview">
      <div className="row">
        <div className="col-lg-4 video-preview">
          {lotvideoId ? (
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${lotvideoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <NoVideoMsj msj="Lote sin video" />
          )}
        </div>
        <div className="col-lg-8 info-preview">
          {lotTitle && <h4>{lotTitle}</h4>}
          {lotCategory && <p><b>Categoría: </b>{lotCategory}</p>}
          {name && <p><b>Nombre: </b>{name}</p>}
          {animals && <p><b>Animales: </b>{animals}</p>}
          {location && <p><b>Ubicación: </b>{location}</p>}
          {state.data ? (
            state.data.length > 0 ? (
              getLastAcceptedPreoffer(state.data)
            ) : (
              <b>Sin preofertas</b>
            )
          ) : (
            "Cargando..."
          )}
          {authState.token 
            ? <a className="last-preoffer-tag" href={`/lotes/${lotId}`}>
                Detalles / preofertar <i className="fas fa-chevron-right ms-2"></i>
              </a>
            : <a className="last-preoffer-tag" href='/login'>
                Inicie sesión para preofertar <i className="fas fa-chevron-right ms-2"></i>
              </a>
          }
        </div>
      </div>
    </div>
  );
}

export default LotPreview;
