import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer } from "react";

import { refreshToken } from "../../../../../../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../../../../../../utils/api-url";
import { AuthContext } from "../../../../../../../../../../App";
import {
  FETCH_USER_FAILURE,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  HIDE_LOADER,
  SHOW_LOADER,
} from "../../../../../../../../../../utils/action-types";

import "./styles.scss";

const initialState = {
  user: undefined,
  isFetching: false,
  hasError: false,
  showUserDetails: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasError: false,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        user: action.payload.user,
        showUserDetails: true,
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
        hasError: true,
      };
    case "HIDE_MODAL":
      return {
        ...state,
        user: undefined,
        showUserDetails: false,
      };
    default:
      return state;
  }
};

function UserDetails({ userId }) {
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispacth] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleClick = () => {
    authDispatch({
      type: SHOW_LOADER,
    });
    dispacth({
      type: FETCH_USER_REQUEST,
    });

    fetch(apiUrl(`/admin/users/${userId}`), {
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
        dispacth({
          type: FETCH_USER_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error fetching the user", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.state === 403) {
          navigate("/forbidden");
        } else {
          dispacth({
            type: FETCH_USER_FAILURE,
          });
        }
      })
      .finally(() => {
        authDispatch({
          type: HIDE_LOADER,
        });
      });
  };

  const handleCloseModal = () => {
    dispacth({
      type: "HIDE_MODAL",
    });
  };

  return (
    <React.Fragment>
      <a onClick={handleClick} role="button">
        Ver usuario <i className="fas fa-user"></i>
      </a>
      {state.showUserDetails && (
        <div className="user-details-modal">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="content-wrap">
                  <h3>Datos de usuario</h3>
                  <div className="separator"></div>
                  <p>
                    <b>Nombre de usuario: </b>
                    {state.user.nickname}
                  </p>
                  <p>
                    <b>Email: </b>
                    {state.user.email}
                  </p>
                  {state.user.phone && (
                    <p>
                      <b>Teléfono celular: </b>
                      {state.user.phone}
                    </p>
                  )}
                  {state.user.telephone && (
                    <p>
                      <b>Teléfono fijo: </b>
                      {state.user.telephone}
                    </p>
                  )}
                  {state.user.address && (
                    <p>
                      <b>Dirección: </b>
                      {state.user.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <i
              className="fas fa-times close-icon"
              onClick={handleCloseModal}
            ></i>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default UserDetails;
