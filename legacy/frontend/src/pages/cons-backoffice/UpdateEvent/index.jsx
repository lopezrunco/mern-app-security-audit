import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { validateYoutubeUrl } from "../../../utils/validate-you-tube-url";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  EDIT_EVENT_FAILURE,
  EDIT_EVENT_REQUEST,
  EDIT_EVENT_SUCCESS,
  FORM_INPUT_CHANGE,
  GET_MY_EVENT_FAILURE,
  GET_MY_EVENT_REQUEST,
  GET_MY_EVENT_SUCCESS,
  HIDE_LOADER,
  SHOW_LOADER,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";

import "./styles.scss";

const initialState = {
  title: "",
  eventType: "",
  category: "",
  description: "",
  company: "",
  organizer: "",
  breeder: "",
  funder: "",
  location: "",
  duration: "",
  startBroadcastTimestamp: "",
  eventDate: "",
  eventHour: "",
  broadcastLinkId: undefined,
  externalLink: "",
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_CHANGE:
      return {
        ...state,
        [action.payload.input]: action.payload.value,
      };
    case GET_MY_EVENT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case GET_MY_EVENT_SUCCESS:
      return {
        ...state,
        isSending: false,
        title: action.payload.event.title,
        eventType: action.payload.event.eventType,
        category: action.payload.event.category,
        description: action.payload.event.description,
        company: action.payload.event.company,
        organizer: action.payload.event.organizer,
        breeder: action.payload.event.breeder,
        funder: action.payload.event.funder,
        location: action.payload.event.location,
        duration: action.payload.event.duration,
        startBroadcastTimestamp: action.payload.event.startBroadcastTimestamp,
        broadcastLinkId: action.payload.event.broadcastLinkId,
        externalLink: action.payload.event.externalLink,
        eventDate: action.payload.event.startBroadcastTimestamp.split("T")[0],
        eventHour: new Date(
          action.payload.event.startBroadcastTimestamp
        ).toLocaleString("es-uy", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    case GET_MY_EVENT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    case EDIT_EVENT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case EDIT_EVENT_SUCCESS:
      return {
        ...state,
        isSending: false,
        event: action.payload.event,
      };
    case EDIT_EVENT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function UpdateEvent() {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [editDate, setEditDate] = useState(false);
  const [editHour, setEditHour] = useState(false);
  const navigate = useNavigate();

  let actualDate = new Date(state.startBroadcastTimestamp).toLocaleDateString(
    "es-uy"
  );
  let actualHour = new Date(state.startBroadcastTimestamp).toLocaleString(
    "es-uy",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const handleEditDateClick = () => {
    setEditDate(true);
  };

  const handleEditHourClick = () => {
    setEditHour(true);
  };

  // On component mount, fetch the event and set data in the form
  useEffect(() => {
    authDispatch({
      type: SHOW_LOADER,
    });
    dispatch({
      type: GET_MY_EVENT_REQUEST,
    });

    fetch(apiUrl(`/events/${id}`))
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        dispatch({
          type: GET_MY_EVENT_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to fetch the event", error);

        if (error) {
          dispatch({
            type: GET_MY_EVENT_FAILURE,
          });
        }
      })
      .finally(() => {
        authDispatch({
          type: HIDE_LOADER,
        });
      });
  }, [authDispatch, id]);

  const handleInputChange = (event) => {
    dispatch({
      type: FORM_INPUT_CHANGE,
      payload: {
        input: event.target.name,
        value: event.target.value,
      },
    });
  };

  const getTimeStamp = (date, hour) => {
    return new Date(`${date}T${hour}`).getTime();
  };

  // On form submit, call the update event endpoint
  const handleFormSubmit = () => {
    dispatch({
      type: EDIT_EVENT_REQUEST,
    });

    fetch(apiUrl(`events/${id}`), {
      method: "PUT",
      headers: {
        Authorization: authState.token,
        UserRole: authState.role,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: state.title,
        eventType: state.eventType,
        category: state.category,
        description: state.description,
        company: state.company,
        organizer: state.organizer,
        breeder: state.breeder,
        funder: state.funder,
        location: state.location,
        duration: state.duration,
        startBroadcastTimestamp: getTimeStamp(state.eventDate, state.eventHour),
        broadcastLinkId: validateYoutubeUrl(state.broadcastLinkId),
        externalLink: state.externalLink,
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
          type: EDIT_EVENT_SUCCESS,
          payload: data,
        });
        navigate("/mensaje", {
          state: {
            title: "Remate editado",
            message: "El remate ha sido editado con éxito.",
            duration: "2000",
            navigateTo: "/consignatarios/mis-remates",
          },
        });
      })
      .catch((error) => {
        console.error("Error al editar el remate.", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleFormSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: EDIT_EVENT_FAILURE,
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
        <Breadcrumbs location={"Editar remate"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <section className="update-event-page">
          <article className="container">
            <Title
              title="Editar remate"
              subtitle="Los campos marcados con * son obligatorios"
            />

            <div className="row">
              <div className="col-12">
                <div className="form-container row">
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

                  <div className="col-lg-6">
                    <label htmlFor="eventType">
                      Tipo de evento
                      <input
                        type="text"
                        value={state.eventType}
                        onChange={handleInputChange}
                        name="eventType"
                        id="eventType"
                      />
                    </label>
                  </div>

                  <div className="col-lg-6">
                    <label htmlFor="category">
                      Categoría
                      <input
                        type="text"
                        value={state.category}
                        onChange={handleInputChange}
                        name="category"
                        id="category"
                      />
                    </label>
                  </div>

                  <label htmlFor="description">
                    Descripción
                    <textarea
                      value={state.description}
                      onChange={handleInputChange}
                      name="description"
                      id="description"
                      cols="10"
                      rows="7"
                      maxLength="600"
                    ></textarea>
                  </label>

                  <div className="col-lg-6">
                    <label htmlFor="company">
                      Rematador
                      <input
                        type="text"
                        value={state.company}
                        onChange={handleInputChange}
                        name="company"
                        id="company"
                      />
                    </label>
                  </div>

                  <div className="col-lg-6">
                    <label htmlFor="organizer">
                      Organizador
                      <input
                        type="text"
                        value={state.organizer}
                        onChange={handleInputChange}
                        name="organizer"
                        id="organizer"
                      />
                    </label>
                  </div>

                  <div className="col-lg-6">
                    <label htmlFor="breeder">
                      Cabaña
                      <input
                        type="text"
                        value={state.breeder}
                        onChange={handleInputChange}
                        name="breeder"
                        id="breeder"
                      />
                    </label>
                  </div>

                  <div className="col-lg-6">
                    <label htmlFor="funder">
                      Financiación
                      <input
                        type="text"
                        value={state.funder}
                        onChange={handleInputChange}
                        name="funder"
                        id="funder"
                      />
                    </label>
                  </div>

                  <div className="col-lg-6">
                    <label htmlFor="location">
                      Lugar
                      <input
                        type="text"
                        value={state.location}
                        onChange={handleInputChange}
                        name="location"
                        id="location"
                      />
                    </label>
                  </div>

                  <div className="col-lg-6">
                    <label htmlFor="duration">
                      Duración (hs.)
                      <input
                        type="number"
                        value={state.duration}
                        onChange={handleInputChange}
                        name="duration"
                        id="duration"
                      />
                    </label>
                  </div>

                  <label htmlFor="broadcastLinkId">
                    Enlace transmisión
                    <input
                      type="text"
                      value={state.broadcastLinkId}
                      onChange={handleInputChange}
                      name="broadcastLinkId"
                      id="broadcastLinkId"
                    />
                  </label>

                  <label htmlFor="externalLink">
                    Enlace Preofertas
                    <input
                      type="text"
                      value={state.externalLink}
                      onChange={handleInputChange}
                      name="externalLink"
                      id="externalLink"
                    />
                  </label>

                  <div className="col-lg-6">
                    <label htmlFor="eventDate">
                      Fecha *
                      {!editDate && (
                        <span className="editable-data">
                          <div className="content">
                            <i className="fas fa-calendar"></i>
                            {actualDate}
                          </div>
                          <i
                            className="fas fa-pencil-alt edit-icon"
                            onClick={handleEditDateClick}
                          ></i>
                        </span>
                      )}
                      <input
                        hidden={!editDate ? "hidden" : null}
                        type="date"
                        id="eventDate"
                        name="eventDate"
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </div>

                  <div className="col-lg-6">
                    <label htmlFor="eventHour">
                      Hora *
                      {!editHour && (
                        <span className="editable-data">
                          <div className="content">
                            <i className="fas fa-clock"></i>
                            {actualHour}
                          </div>
                          <i
                            className="fas fa-pencil-alt edit-icon"
                            onClick={handleEditHourClick}
                          ></i>
                        </span>
                      )}
                      <input
                        hidden={!editHour ? "hidden" : null}
                        type="time"
                        id="eventHour"
                        name="eventHour"
                        pattern="[0-9]{2}:[0-9]{2}"
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </div>

                  <button
                    className="button button-dark"
                    onClick={handleFormSubmit}
                    disabled={state.isSubmitting}
                  >
                    <i className="fas fa-sync-alt"></i>
                    {state.isSubmitting ? "Por favor, espere..." : "Actualizar"}
                  </button>

                  {state.hasError &&
                    (state.errorMessage ? (
                      <span className="error-message">
                        {state.errorMessage}
                      </span>
                    ) : (
                      <span className="error-message">
                        Ocurrió un error. Revise los datos e intente nuevamente.
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </article>
        </section>
      </motion.div>
    </React.Fragment>
  );
}

export default UpdateEvent;
