import { useNavigate } from "react-router-dom";
import { useContext, useReducer } from "react";

import { refreshToken } from "../../../../../utils/refresh-token";
import { getYoutubeId } from "../../../../../utils/getYoutubeID";
import { apiUrl } from "../../../../../utils/api-url";
import { AuthContext } from "../../../../../App";
import {
  EDIT_LOT_FAILURE,
  EDIT_LOT_REQUEST,
  EDIT_LOT_SUCCESS,
  FORM_INPUT_CHANGE,
} from "../../../../../utils/action-types";

const initialState = {
  YTVideoSrc: undefined,
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
    case EDIT_LOT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case EDIT_LOT_SUCCESS:
      return {
        ...state,
        isSending: false,
        YTVideoSrc: action.payload.YTVideoSrc,
      };
    case EDIT_LOT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function YouTubeVideo({ lotId }) {
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

  const handleSubmit = () => {
    dispatch({
      type: EDIT_LOT_REQUEST,
    });

    fetch(apiUrl(`/lots/${lotId}`), {
      method: "PUT",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        YTVideoSrc:
          state.YTVideoSrc === undefined
            ? undefined
            : getYoutubeId(state.YTVideoSrc),
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
          type: EDIT_LOT_SUCCESS,
          payload: data,
        });
        navigate(`/consignatarios/mis-remates/${lotId}/lote-editado`);
      })
      .catch((error) => {
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: EDIT_LOT_FAILURE,
          });
        }
      });
  };

  return (
    <div className="col-12 upload-file-page">
      <div className="select-file">
        <h3>Enlace de Youtube</h3>
        <label htmlFor="YTVideoSrc">
          <input
            required
            type="text"
            value={state.YTVideoSrc}
            onChange={handleInputChange}
            name="YTVideoSrc"
            id="YTVideoSrc"
            placeholder="www.youtube.com/su-video"
          />
        </label>
        <button
          className="button button-dark"
          onClick={handleSubmit}
          disabled={state.isSubmitting}
        >
          <i className="fas fa-check"></i>
          {state.isSubmitting ? "Por favor, espere..." : "Aceptar"}
        </button>

        {state.hasError && (
          (state.errorMessage) 
            ? <span className="error-message">{state.errorMessage}</span> 
            : <span className="error-message">Ocurrió un error. Revise los datos e intente nuevamente.</span>
        )}
      </div>
    </div>
  );
}

export default YouTubeVideo;
