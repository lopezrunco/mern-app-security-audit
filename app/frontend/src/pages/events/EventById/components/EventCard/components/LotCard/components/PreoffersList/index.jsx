import { useNavigate } from "react-router-dom";
import { useContext, useReducer } from "react";

import { apiUrl } from "../../../../../../../../../utils/api-url";
import { refreshToken } from "../../../../../../../../../utils/refresh-token";
import { AuthContext } from "../../../../../../../../../App";
import {
  CREATE_PREOFFER_FAILURE,
  CREATE_PREOFFER_REQUEST,
  CREATE_PREOFFER_SUCCESS,
  FORM_INPUT_CHANGE,
  GET_USER_BY_ID_FAILURE,
  GET_USER_BY_ID_REQUEST,
  GET_USER_BY_ID_SUCCESS,
} from "../../../../../../../../../utils/action-types";

import "./styles.scss";

const initialState = {
  userId: undefined,
  user: undefined,
  amount: undefined,
  accepted: false,
  date: undefined,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    // Update state on input change
    case FORM_INPUT_CHANGE:
      return {
        ...state,
        amount: action.payload.value,
      };
    case CREATE_PREOFFER_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case CREATE_PREOFFER_SUCCESS:
      return {
        ...state,
        isSending: false,
        amount: action.payload.amount,
      };
    case CREATE_PREOFFER_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    case GET_USER_BY_ID_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case GET_USER_BY_ID_SUCCESS:
      return {
        ...state,
        isSending: false,
        user: action.payload.user,
      };
    case GET_USER_BY_ID_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function PreoffersList({ preoffers, lotId }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  // On input focus, check the user info in the DB
  const checkUserInfo = () => {
    console.log("Checking user data...");
    fetch(apiUrl(`/admin/users/${authState.id}`), {
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
          type: GET_USER_BY_ID_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to fetch the user", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: GET_USER_BY_ID_FAILURE,
          });
        }
      });
  };

  // On input change, set the value in state
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
    // On submit, check if the user info has address and phone. If not, redirect to update user page. If yes, do the preoffer.
    if (state.user.address || state.user.phone) {
      dispatch({
        type: CREATE_PREOFFER_REQUEST,
      });

      fetch(apiUrl("/preoffers/create"), {
        method: "POST",
        headers: {
          Authorization: authState.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: authState.user.id,
          date: Date.now(),
          amount: state.amount,
          accepted: state.accepted,
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
            type: CREATE_PREOFFER_SUCCESS,
            payload: data,
          });
          navigate("/mensaje", {
            state: {
              title: "¡Exito!",
              message: "Su preoferta a sido realizada correctamente.",
              duration: "3000",
              navigateTo: "/cartelera",
            },
          });
        })
        .catch((error) => {
          console.error("Error creating the preoffer", error);

          if (error.status === 401) {
            refreshToken(authState.refreshToken, authDispatch, navigate, () =>
              handleFormSubmit()
            );
          } else if (error.status === 403) {
            navigate("/forbidden");
          } else {
            dispatch({
              type: CREATE_PREOFFER_FAILURE,
            });
          }
        });
    } else {
      navigate("/actualizar-usuario");
    }
  };

  return (
    <div className="col-12 preoffers-container mt-3 p-4">
      <div className="container p-0">
        <div className="row justify-content-between">
          <div className="col-lg-4 mb-5 mb-lg-0">
            <h4 className="mb-4">
              Preofertas realizadas:
            </h4>
            {preoffers.length === 0 && (
              <p>Aún no hay preofertas en este lote.</p>
            )}
            {preoffers.map((preoffer) => {
              return (
                <div className="preoffer mb-2" key={preoffer.id}>
                  <b>U$S {preoffer.amount}</b>
                  {preoffer.accepted ? (
                    <span className="acepted">Aceptada</span>
                  ) : (
                    <span className="refused">No aceptada</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="col-lg-5">
            <h4 className="mb-4">
              Hacer Preoferta (U$S):
            </h4>
            <div className="make-preoffer-container">
              <input
                type="number"
                onFocus={checkUserInfo}
                onChange={handleInputChange}
                min="1"
                name="quantity"
                id="quantity"
                placeholder="Ingrese cantidad"
              />
              <button
                className="button button-light-outline"
                onClick={handleFormSubmit}
                disabled={state.isSubmitting}
              >
                <i className="fas fa-comments-dollar me-2"></i>
                {state.isSubmitting ? "Espere..." : "Preofertar"}
              </button>
              {state.hasError && (
                (state.errorMessage) 
                  ? <span className="error-message">{state.errorMessage}</span> 
                  : <span className="error-message">Ocurrió un error.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreoffersList;
