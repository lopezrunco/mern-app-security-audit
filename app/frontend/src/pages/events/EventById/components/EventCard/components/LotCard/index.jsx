import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useReducer } from "react";

import { refreshToken } from "../../../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../../../utils/api-url";
import { AuthContext } from "../../../../../../../App";
import {
  GET_PREOFFERS_FAILURE,
  GET_PREOFFERS_REQUEST,
  GET_PREOFFERS_SUCCESS,
} from "../../../../../../../utils/action-types";

import NoVideoMsj from "../../../../../../../components/NoVideoMsj";
import PreoffersList from "./components/PreoffersList";

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

function LotCard({ lot }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

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
        lotId: lot.id,
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
  }, [authDispatch, authState.refreshToken, authState.token, lot.id, navigate]);

  return (
    <React.Fragment>
      <div className="col-lg-7 mb-5 mb-lg-0">
        <h3>
          <i className="fas fa-layer-group me-3 mb-3"></i> {lot.title}
        </h3>
        {lot.category && <div className="category-tag"><b>Categoría:</b> {lot.category}</div>}
        {lot.description && <p><b>Descripción:</b> {lot.description}</p>}
        {lot.name && <p><b>Nombre:</b> {lot.name}</p>}
        {lot.rp && <p><b>RP:</b> {lot.rp}</p>}
        {lot.pedigree && <p><b>Pedigree:</b> {lot.pedigree}</p>}
        {lot.animals && <p><b>Cantidad:</b> {lot.animals}</p>}
        {lot.weight && <p><b>Peso(Kg):</b> {lot.weight}</p>}
        {lot.age && <p><b>Fecha nac.:</b> {lot.age}</p>}
        {lot.class && <p><b>Clase:</b> {lot.class}</p>}
        {lot.race && <p><b>Raza:</b> {lot.race}</p>}
        {lot.location && <p><b>Ubicación:</b> {lot.location}</p>}
        {lot.certificate && <p><b>Certificado:</b> {lot.certificate}</p>}
        {lot.type && <p><b>Tipo:</b> {lot.type}</p>}
        {lot.observations && <p><b>Observaciones:</b> {lot.observations}</p>}
      </div>
      <div className="col-lg-5 mb-5 mb-lg-0">
        {lot.YTVideoSrc ? (
          <iframe
            width="100%"
            height="300"
            src={`https://www.youtube.com/embed/${lot.YTVideoSrc}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <NoVideoMsj msj="Este lote aún no tiene video." />
        )}
      </div>
      {state.showPreoffers ? (
        <PreoffersList preoffers={state.data} lotId={lot.id} />
      ) : (
        <div className="col-12 mt-5">
          <p>Cargando preofertas...</p>
        </div>
      )}
    </React.Fragment>
  );
}

export default LotCard;
