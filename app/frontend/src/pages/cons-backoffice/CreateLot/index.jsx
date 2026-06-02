import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useReducer } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { getYoutubeId } from "../../../utils/getYoutubeID";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  CREATE_LOT_FAILURE,
  CREATE_LOT_REQUEST,
  CREATE_LOT_SUCCESS,
  FORM_INPUT_CHANGE,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";

const initialState = {
  title: "",
  category: "",
  name: "",
  description: "",
  rp: "",
  pedigree: "",
  animals: "",
  weight: "",
  age: "",
  class: "",
  state: "",
  observations: "",
  race: "",
  certificate: "",
  location: "",
  type: "",
  open: true,
  sold: false,
  completed: false,
  YTVideoSrc: undefined,
  videoSrc: undefined,
  eventId: "",
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_CHANGE:
      return {
        ...state,
        eventId: action.payload.eventId,
        [action.payload.input]: action.payload.value,
      };
    case CREATE_LOT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case CREATE_LOT_SUCCESS:
      return {
        ...state,
        isSending: false,
        lot: action.payload.lot,
      };
    case CREATE_LOT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function CreateLot() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleInputChange = (event) => {
    dispatch({
      type: FORM_INPUT_CHANGE,
      payload: {
        input: event.target.name,
        value: event.target.value,
        eventId: id,
      },
    });
  };

  const handleFormSubmit = () => {
    dispatch({
      type: CREATE_LOT_REQUEST,
    });

    fetch(apiUrl("/lots/create"), {
      method: "POST",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: state.title,
        category: state.category,
        name: state.name,
        description: state.description,
        rp: state.rp,
        pedigree: state.pedigree,
        animals: state.animals,
        weight: state.weight,
        age: state.age,
        class: state.class,
        state: state.state,
        observations: state.observations,
        race: state.race,
        certificate: state.certificate,
        location: state.location,
        type: state.type,
        open: state.open,
        sold: state.sold,
        completed: state.completed,
        YTVideoSrc:
          state.YTVideoSrc === undefined
            ? undefined
            : getYoutubeId(state.YTVideoSrc),
        videoSrc: state.videoSrc,
        eventId: state.eventId,
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
          type: CREATE_LOT_SUCCESS,
          payload: data,
        });
        // TO DO: Refactor this line to use the Message page
        navigate(`/consignatarios/mis-remates/${id}/lote-creado`);
      })
      .catch((error) => {
        console.error("Error al crear el lote", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleFormSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: CREATE_LOT_FAILURE,
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
        <Breadcrumbs location={"Subir lote"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        viewport={{ once: true }}
      >
        <section>
          <article className="container">
            <Title
              title="Subir lote"
              subtitle="Los campos marcados con * son obligatorios"
            />
            <div className="row">
              <div className="col-12">
                <div className="form-container row">
                  <div className="col-12">
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

                  <div className="col-lg-6">
                    <label htmlFor="name">
                      Nombre
                      <input
                        type="text"
                        value={state.name}
                        onChange={handleInputChange}
                        name="name"
                        id="name"
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

                  <div className="col-lg-3">
                    <label htmlFor="rp">
                      RP
                      <input
                        type="number"
                        value={state.rp}
                        onChange={handleInputChange}
                        name="rp"
                        id="rp"
                      />
                    </label>
                  </div>

                  <div className="col-lg-3">
                    <label htmlFor="animals">
                      Cantidad
                      <input
                        type="number"
                        value={state.animals}
                        onChange={handleInputChange}
                        name="animals"
                        id="animals"
                      />
                    </label>
                  </div>

                  <div className="col-lg-3">
                    <label htmlFor="weight">
                      Peso
                      <input
                        type="number"
                        value={state.weight}
                        onChange={handleInputChange}
                        name="weight"
                        id="weight"
                      />
                    </label>
                  </div>

                  <div className="col-lg-3">
                    <label htmlFor="age">
                      Fecha nac.
                      <input
                        type="text"
                        value={state.age}
                        onChange={handleInputChange}
                        name="age"
                        id="age"
                      />
                    </label>
                  </div>

                  <div className="col-lg-3">
                    <label htmlFor="class">
                      Clase
                      <input
                        type="text"
                        value={state.class}
                        onChange={handleInputChange}
                        name="class"
                        id="class"
                      />
                    </label>
                  </div>

                  <div className="col-lg-3">
                    <label htmlFor="state">
                      Estado
                      <input
                        type="text"
                        value={state.state}
                        onChange={handleInputChange}
                        name="state"
                        id="state"
                      />
                    </label>
                  </div>

                  <div className="col-lg-3">
                    <label htmlFor="race">
                      Raza
                      <input
                        type="text"
                        value={state.race}
                        onChange={handleInputChange}
                        name="race"
                        id="race"
                      />
                    </label>
                  </div>

                  <div className="col-lg-3">
                    <label htmlFor="type">
                      Tipo
                      <input
                        type="text"
                        value={state.type}
                        onChange={handleInputChange}
                        name="type"
                        id="type"
                      />
                    </label>
                  </div>

                  <div className="col-lg-6">
                    <label htmlFor="pedigree">
                      Pedigree
                      <input
                        type="text"
                        value={state.pedigree}
                        onChange={handleInputChange}
                        name="pedigree"
                        id="pedigree"
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

                  <div className="col-lg-3">
                    <label htmlFor="certificate">
                      Certificado
                      <input
                        type="text"
                        value={state.certificate}
                        onChange={handleInputChange}
                        name="certificate"
                        id="certificate"
                      />
                    </label>
                  </div>

                  <div className="col-lg-9">
                    <label htmlFor="ytvideo">
                      Enlace (YouTube)
                      <input
                        type="text"
                        value={state.YTVideoSrc}
                        onChange={handleInputChange}
                        name="YTVideoSrc"
                        id="ytvideo"
                      />
                    </label>
                  </div>

                  <label htmlFor="observations">
                    Observaciones
                    <textarea
                      value={state.observations}
                      onChange={handleInputChange}
                      name="observations"
                      id="observations"
                      cols="10"
                      rows="7"
                      maxLength="600"
                    ></textarea>
                  </label>

                  <button
                    className="button button-dark"
                    onClick={handleFormSubmit}
                    disabled={state.isSubmitting}
                  >
                    <i className="fas fa-plus"></i>
                    {state.isSubmitting ? "Por favor, espere..." : "Subir lote"}
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

export default CreateLot;
