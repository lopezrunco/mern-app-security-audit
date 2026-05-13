import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  EDIT_USER_FAILURE,
  EDIT_USER_REQUEST,
  EDIT_USER_SUCCESS,
  FORM_INPUT_CHANGE,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";

const initialState = {
  telephone: "",
  phone: "",
  address: "",
  isSubmitting: false,
  errorMessage: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_CHANGE:
      return {
        ...state,
        [action.payload.input]: action.payload.value,
      };
    case EDIT_USER_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case EDIT_USER_SUCCESS:
      return {
        ...state,
        isSending: false,
        user: action.payload.user,
      };
    case EDIT_USER_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function UpdateUserInfo() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    dispatch({
      type: FORM_INPUT_CHANGE,
      payload: {
        input: event.target.name,
        value: event.target.value,
      },
    });
  };

  const handleFormSubmit = () => {
    dispatch({
      type: EDIT_USER_REQUEST,
    });

    fetch(apiUrl(`user/${authState.user.id}/update`), {
      method: "PUT",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        telephone: state.telephone,
        phone: state.phone,
        address: state.address,
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
          type: EDIT_USER_SUCCESS,
          payload: data,
        });
        navigate("/mensaje", {
          state: {
            title: "Datos actualizados",
            message: "Ahora podrá hacer preofertas en la plataforma.",
            duration: "4000",
            navigateTo: "/cartelera",
          },
        });
      })
      .catch((error) => {
        console.error("Error al actualizar la información de usuario", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleFormSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: EDIT_USER_FAILURE,
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
        <Breadcrumbs location={"Complete sus datos"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        viewport={{ once: true }}
      >
        <section className="update-user-page">
          <article className="container">
            <Title
              title="Complete sus datos"
              subtitle="Para hacer preofertas, debe facilitar sus datos de contacto."
            />
            <div className="row">
              <div className="col-12">
                <div className="form-container row">
                  <div className="col-lg-6">
                    <label htmlFor="phone">
                      Teléfono (Sin espacios ni guiones) *
                      <input
                        required
                        type="number"
                        value={state.phone}
                        onChange={handleInputChange}
                        name="phone"
                        id="phone"
                      />
                    </label>
                  </div>
                  <div className="col-lg-6">
                    <label htmlFor="telephone">
                      Telefono fijo
                      <input
                        type="number"
                        value={state.telephone}
                        onChange={handleInputChange}
                        name="telephone"
                        id="telephone"
                      />
                    </label>
                  </div>
                  <div className="col-12">
                    <label htmlFor="address">
                      Dirección *
                      <input
                        required
                        type="text"
                        value={state.address}
                        onChange={handleInputChange}
                        name="address"
                        id="address"
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

export default UpdateUserInfo;
