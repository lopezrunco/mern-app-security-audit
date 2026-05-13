import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useReducer } from "react";

import { refreshToken } from "../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../utils/api-url";
import { AuthContext } from "../../../../../App";
import {
  GET_LOT_FAILURE,
  GET_LOT_REQUEST,
  GET_LOT_SUCCESS,
} from "../../../../../utils/action-types";

import PreofferDetails from "./components/PreofferDetails";

import "./styles.scss";

const initialState = {
  lot: undefined,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case GET_LOT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case GET_LOT_SUCCESS:
      return {
        ...state,
        isSending: false,
        lot: action.payload.lot,
      };
    case GET_LOT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function MyPreofferCard({ preoffer }) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  useEffect(() => {
    dispatch({
      type: GET_LOT_REQUEST,
    });

    fetch(apiUrl(`/lots/${preoffer.lotId}`), {
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
          type: GET_LOT_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to fetch the lot", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: GET_LOT_FAILURE,
          });
        }
      });
  }, [
    authDispatch,
    authState.refreshToken,
    authState.token,
    navigate,
    preoffer.lotId,
  ]);

  return (
    <div className="col-lg-4">
      <div className="border mb-3 p-4">
        <div className="preoffer-card">
          <div className="amount-accepted-refused mb-4">
            <h4 className="my-1">U$S {preoffer.amount}</h4>
            {preoffer.accepted ? (
              <span className="acepted">Aceptada</span>
            ) : (
              <span className="refused">No aceptada</span>
            )}
          </div>
          {state.lot ? (
            <PreofferDetails
              lotTitle={state.lot.title}
              lotId={preoffer.lotId}
              YTVideoSrc={state.lot.YTVideoSrc}
              lotEventId={state.lot.eventId}
            />
          ) : (
            <p>Cargando información...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyPreofferCard;
