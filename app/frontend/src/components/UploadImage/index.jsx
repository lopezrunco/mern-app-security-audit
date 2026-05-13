import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import React, { useContext, useReducer } from "react";

const CLOUDINARY_ID = import.meta.env.VITE_CLOUDINARY_ID;

import {
  CLEAR_IMAGE_INPUT,
  UPDATE_IMAGE_PREVIEW,
  UPLOAD_IMAGE_FAILURE,
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_INPUT_CHANGE,
} from "../../utils/action-types";
import { refreshToken } from "../../utils/refresh-token";
import { AuthContext } from "../../App";

const initialState = {
  image: undefined,
  imgUrl: "",
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_IMAGE_PREVIEW:
      return {
        ...state,
        imagePreview: action.payload,
      };
    case UPLOAD_INPUT_CHANGE:
      return {
        ...state,
        image: action.payload,
      };
    case UPLOAD_IMAGE_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        imgUrl: action.payload.url,
        isSending: false,
      };
    case UPLOAD_IMAGE_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    case CLEAR_IMAGE_INPUT:
      return {
        ...state,
        image: undefined,
        imagePreview: undefined,
      };
    default:
      return state;
  }
};

export const UploadImage = ({ onImageUpload }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUploadInputChange = (imgElement) => {
    if (imgElement) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(imgElement.type)) {
        alert("Por favor, seleccione una imágen válida (JPEG, PNG o GIF)");
        dispatch({ type: CLEAR_IMAGE_INPUT });
        document.getElementById("adImg").value = "";
        return;
      }
      // Validate file size to 5 MB
      const maxSize = 5 * 1024 * 1024;
      if (imgElement.size > maxSize) {
        alert("Por favor, seleccione un archivo menor a 5 MB");
        dispatch({ type: CLEAR_IMAGE_INPUT });
        document.getElementById("adImg").value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const sanitized = DOMPurify.sanitize(reader.result);
        dispatch({
          type: UPDATE_IMAGE_PREVIEW,
          payload: sanitized,
        });
      };
      reader.readAsDataURL(imgElement);
    }
    dispatch({
      type: UPLOAD_INPUT_CHANGE,
      payload: imgElement,
    });
  };

  const handleImageSubmit = () => {
    if (!state.image) {
      alert("Por favor, seleccione una imagen para subir.");
      return;
    }
    dispatch({
      type: UPLOAD_IMAGE_REQUEST,
    });

    const data = new FormData();
    data.append("file", state.image);
    data.append("upload_preset", "campoeventos");
    data.append("cloud_name", CLOUDINARY_ID);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_ID}/image/upload`, {
      method: "post",
      body: data,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        onImageUpload(data.url);
        dispatch({
          type: UPLOAD_IMAGE_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error uploading the image: ", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleImageSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: UPLOAD_IMAGE_FAILURE,
          });
        }
      })
      .finally(() => {
        dispatch({
          type: UPDATE_IMAGE_PREVIEW,
          payload: undefined,
        });
      });
  };

  const cancelImageUpload = () => {
    dispatch({
      type: UPDATE_IMAGE_PREVIEW,
      payload: undefined,
    });
  };

  return (
    <React.Fragment>
      <input
        id="adImg"
        name="adImg"
        type="file"
        accept="image/*"
        onChange={(e) => handleUploadInputChange(e.target.files[0])}
      ></input>
      {state.imagePreview && (
        <div className="confirmation-modal">
          <div className="container">
            <div className="row">
              <div className="col-12 modal-container">
                <img
                  src={state.imagePreview}
                  alt="Previsualización del anuncio."
                />
                <p>
                  El archivo <i>{state.image.name}</i> se usará como anuncio.
                </p>
                <button
                  className="button button-dark"
                  onClick={handleImageSubmit}
                  disabled={state.isSending}
                >
                  <i className="fas fa-check"></i>{" "}
                  {state.isSending ? "Cargando..." : "Confirmar"}
                </button>
                <button
                  className="button button-dark-outline"
                  onClick={cancelImageUpload}
                  disabled={state.isSending}
                >
                  <i className="fas fa-times"></i> Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
