import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useReducer, useState } from "react";

import {
  EDIT_AD_FAILURE,
  EDIT_AD_REQUEST,
  EDIT_AD_SUCCESS,
  FORM_INPUT_CHANGE,
  GET_MY_AD_FAILURE,
  GET_MY_AD_REQUEST,
  GET_MY_AD_SUCCESS,
  HIDE_LOADER,
  SHOW_LOADER,
} from "../../../utils/action-types";
import { AuthContext } from "../../../App";
import { apiUrl } from "../../../utils/api-url";
import { refreshToken } from "../../../utils/refresh-token";
import { returnRouteAdsActions } from "../../../utils/return-route-by-user-type";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";
import { UploadImage } from "../../../components/UploadImage";

const initialState = {
  title: "",
  position: "",
  imgUrl: "",
  link: "",
  published: true,
  userId: "",
  isSending: false,
  hasError: false,
};

const allowedPositions = [
  "news-1-left",
  "news-1-right",
  "news-2-left",
  "news-2-right",
  "news-3-left",
  "news-3-right",
  "news-4-left",
  "news-4-right",
  "news-5-left",
  "news-5-right",
];

const positionDisplayNames = {
  "news-1-left": "Después de Últimas noticias (izquierda)",
  "news-1-right": "Después de Últimas noticias (derecha)",
  "news-2-left": "Después de Zafras (izquierda)",
  "news-2-right": "Después de Zafras (derecha)",
  "news-3-left": "Después de Ferias (izquierda)",
  "news-3-right": "Después de Ferias (derecha)",
  "news-4-left": "Después de Pantalla (izquierda)",
  "news-4-right": "Después de Pantalla (derecha)",
  "news-5-left": "Después de Equinos (izquierda)",
  "news-5-right": "Después de Equinos (derecha)",
};

const reducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_CHANGE:
      return {
        ...state,
        [action.payload.input]: action.payload.value,
      };
    case GET_MY_AD_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case GET_MY_AD_SUCCESS:
      return {
        ...state,
        isSending: false,
        title: action.payload.ad.title,
        position: action.payload.ad.position,
        imgUrl: action.payload.ad.imgUrl,
        link: action.payload.ad.link,
        published: action.payload.ad.published,
      };
    case GET_MY_AD_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
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

export const UpdateAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  // On component mount, fetch the ad and set data in the form
  useEffect(() => {
    authDispatch({
      type: SHOW_LOADER,
    });
    dispatch({
      type: GET_MY_AD_REQUEST,
    });

    fetch(apiUrl(`/ads/${id}`), {
      method: "GET",
      headers: {
        Authorization: authState.token,
        UserRole: authState.role,
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
          type: GET_MY_AD_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to fetch the ad", error);
        if (error) {
          dispatch({
            type: GET_MY_AD_FAILURE,
          });
        }
      })
      .finally(() => {
        authDispatch({
          type: HIDE_LOADER,
        });
      });
  }, [authDispatch, authState.token, authState.user.id, id]);

  const handleInputChange = (event) => {
    dispatch({
      type: FORM_INPUT_CHANGE,
      payload: {
        input: event.target.name,
        value: event.target.value,
      },
    });
  };

  const handleImageUpload = (url) => {
    setImageUrl(url);
    dispatch({
      type: FORM_INPUT_CHANGE,
      payload: {
        input: "imgUrl",
        value: url,
      },
    });
  };

  const handleFormSubmit = () => {
    dispatch({
      type: EDIT_AD_REQUEST,
    });

    fetch(apiUrl(`/ads/${id}`), {
      method: "PUT",
      headers: {
        Authorization: authState.token,
        UserRole: authState.role,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: state.title,
        position: state.position,
        imgUrl: state.imgUrl,
        link: state.link,
        published: state.published,
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
            title: "Anuncio editado",
            message: "El anuncio ha sido editado con éxito.",
            duration: "2000",
            navigateTo: returnRouteAdsActions(authState.user.role),
          },
        });
      })
      .catch((error) => {
        console.error("Error al editar el anuncio.", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleFormSubmit()
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
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Editar anuncio"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <section className="update-ad-page">
          <article className="container">
            <Title
              title="Editar anuncio"
              subtitle="Los campos marcados con * son obligatorios"
            />
            <div className="form-container row">
              <div className="col-lg-6">
                <label htmlFor="title">
                  Título *
                  <input
                    required
                    type="text"
                    value={state.title}
                    onChange={handleInputChange}
                    name="title"
                    id="title"
                  />
                </label>
              </div>

              <div className="col-lg-6">
                <label htmlFor="position">
                  Posición *
                  <select
                    value={state.position}
                    onChange={handleInputChange}
                    name="position"
                    id="position"
                  >
                    <option value="">Seleccionar posición</option>
                    {/* Shows a user-friendly name but keeps the original value */}
                    {allowedPositions.map((position, index) => (
                      <option key={index} value={position}>
                        {positionDisplayNames[position]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="col-lg-6">
                <label htmlFor="link">
                  Enlace
                  <input
                    type="text"
                    value={state.link}
                    onChange={handleInputChange}
                    name="link"
                    id="link"
                  />
                </label>
              </div>

              <div className="col-lg-6">
                <label htmlFor="published">
                  Publicado
                  <select
                    value={state.published}
                    onChange={handleInputChange}
                    name="published"
                    id="published"
                  >
                    <option value={true}>Sí</option>
                    <option value={false}>No</option>
                  </select>
                </label>
              </div>

              <div className="add-ad-img">
                <label htmlFor="adImg">
                  <div className="row align-items-center">
                    <div className="col-lg-3">Imagen</div>
                    <div className="col-lg-9">
                      <UploadImage onImageUpload={handleImageUpload} />
                    </div>
                  </div>
                </label>
              </div>

              <button
                className="button button-dark"
                onClick={handleFormSubmit}
                disabled={state.isSending}
              >
                <i className="fas fa-sync-alt"></i>
                {state.isSending ? "Por favor, espere..." : "Actualizar"}
              </button>

              {state.hasError &&
                (state.errorMessage ? (
                  <span className="error-message">{state.errorMessage}</span>
                ) : (
                  <span className="error-message">
                    Ocurrió un error. Revise los datos e intente nuevamente.
                  </span>
                ))}
            </div>
          </article>
        </section>
      </motion.div>
    </React.Fragment>
  );
};
