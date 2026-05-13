import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React, { useContext, useReducer, useState } from "react";

const CLOUDINARY_ID = import.meta.env.VITE_CLOUDINARY_ID;
import { AuthContext } from "../../../App";
import {
  CREATE_POST_FAILURE,
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  FORM_INPUT_CHANGE,
  UPDATE_IMAGE_PREVIEW,
  UPLOAD_IMAGE_FAILURE,
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_INPUT_CHANGE,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";
import { refreshToken } from "../../../utils/refresh-token";
import { apiUrl } from "../../../utils/api-url";
import { returnRouteBlogActions } from "../../../utils/return-route-by-user-type";

const initialState = {
  title: "",
  category: "",
  headline: "",
  content: "",
  picture: undefined,
  tags: [],
  link: "",
  published: true,
  userId: "",
  isSending: false,
  hasError: false,
};

const allowedCategories = [
  "Zafras",
  "Ferias",
  "Pantalla",
  "Equinos",
  "Eventos",
  "Sociales",
  "Otros",
];

const reducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_CHANGE:
      return {
        ...state,
        [action.payload.input]: action.payload.value,
      };
    case CREATE_POST_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        isSending: false,
        post: action.payload.post,
      };
    case CREATE_POST_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    case UPLOAD_INPUT_CHANGE:
      return {
        ...state,
        image: action.payload,
      };
    case UPDATE_IMAGE_PREVIEW:
      return {
        ...state,
        imagePreview: action.payload,
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
        imageUrl: action.payload.url,
        isSending: false,
      };
    case UPLOAD_IMAGE_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

export const CreatePost = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [mainContent, setMainContent] = useState("");

  const stripInlineStyles = (htmlString) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    const elementsWithStyles = div.querySelectorAll("*[style]");

    elementsWithStyles.forEach((el) => {
      el.removeAttribute("style");
    });
    return div.innerHTML;
  };

  const handleInputChange = (post) => {
    const { name, value } = post.target;

    if (name === "tags") {
      // Creates an array of tags with every comma separated word
      const tagsArray = value.split(",").map((tag) => tag.trim());
      dispatch({
        type: FORM_INPUT_CHANGE,
        payload: {
          input: name,
          value: tagsArray,
        },
      });
    } else {
      dispatch({
        type: FORM_INPUT_CHANGE,
        payload: {
          input: name,
          value: value,
        },
      });
    }
  };

  const handleUploadInputChange = (imgElement) => {
    // Update the image preview when a new image is selected
    if (imgElement) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({
          type: UPDATE_IMAGE_PREVIEW,
          payload: reader.result,
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
    dispatch({
      type: UPLOAD_IMAGE_REQUEST,
    });

    const data = new FormData();
    data.append("file", state.image);
    data.append("upload_preset", "campoeventos");
    data.append("cloud_name", "dvkq2sewj");

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

  const handleFormSubmit = () => {
    dispatch({
      type: CREATE_POST_REQUEST,
    });

    fetch(apiUrl("/posts/create"), {
      method: "POST",
      headers: {
        Authorization: authState.token,
        UserRole: authState.role,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: state.title,
        category: state.category,
        headline: state.headline,
        content: mainContent,
        picture: state.imageUrl,
        tags: state.tags,
        link: state.link,
        published: state.published,
        userId: authState.user.id,
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
          type: CREATE_POST_SUCCESS,
          payload: data,
        });
        navigate("/mensaje", {
          state: {
            title: "Artículo creado",
            message: "El artículo ha sido creado con éxito.",
            duration: "2000",
            navigateTo: returnRouteBlogActions(authState.user.role),
          },
        });
      })
      .catch((error) => {
        console.error("Error al crear el articulo", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleFormSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: CREATE_POST_FAILURE,
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
        <Breadcrumbs location={"Crear artículo"} />
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
              title="Crear artículo"
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
                <label htmlFor="category">
                  Categoría *
                  <select
                    value={state.category}
                    onChange={handleInputChange}
                    name="category"
                    id="category"
                  >
                    <option value="">Seleccionar categoría</option>
                    {allowedCategories.map((category, index) => (
                      <option key={index}>{category}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="col-12">
                <label htmlFor="headline">
                  Texto introducción
                  <input
                    type="text"
                    value={state.headline}
                    onChange={handleInputChange}
                    name="headline"
                    id="headline"
                  />
                </label>
              </div>

              <div className="col-12">
                <label htmlFor="tags">
                  Etiquetas (Separadas con comas)
                  <input
                    type="text"
                    value={state.tags.join(", ")}
                    onChange={handleInputChange}
                    name="tags"
                    id="tags"
                  />
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

              <div className="col-12">
                <label htmlFor="content">
                  Contenido
                  <Editor
                    editorState={editorState}
                    wrapperClassName="card"
                    editorClassName="card-body"
                    toolbar={{
                      options: [
                        "inline",
                        "blockType",
                        "fontSize",
                        "list",
                        "textAlign",
                        "history",
                        "embedded",
                        "emoji",
                        "image",
                      ],
                      inline: false,
                      list: { inDropdown: true },
                      textAlign: { inDropdown: true },
                      link: { inDropdown: true },
                      history: { inDropdown: true },
                    }}
                    onEditorStateChange={(newState) => {
                      setEditorState(newState);
                      const contentState = convertToRaw(
                        newState.getCurrentContent()
                      );
                      const contentHtml = draftToHtml(contentState);
                      setMainContent(stripInlineStyles(contentHtml));
                    }}
                  />
                </label>
              </div>

              <div className="add-event-img">
                <label htmlFor="picture">
                  <div className="row align-items-center">
                    <div className="col-lg-3">Imagen del artículo</div>
                    <div className="col-lg-9">
                      <input
                        id="picture"
                        name="picture"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleUploadInputChange(e.target.files[0])
                        }
                      ></input>
                    </div>
                  </div>
                </label>
                {state.imagePreview && (
                  <div className="confirmation-modal">
                    <div className="container">
                      <div className="row">
                        <div className="col-12 modal-container">
                          <img
                            src={state.imagePreview}
                            alt="Previsualización de la imagen."
                          />
                          <p>
                            El archivo <i>{state.image.name}</i> se usará como
                            imagen del artículo.
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
              </div>

              <button
                className="button button-dark"
                onClick={handleFormSubmit}
                disabled={state.isSending}
              >
                <i className="fas fa-plus"></i>
                {state.isSending ? "Por favor, espere..." : "Crear articulo"}
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
