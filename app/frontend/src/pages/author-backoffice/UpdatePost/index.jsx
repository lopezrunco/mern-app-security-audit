import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  EDIT_POST_FAILURE,
  EDIT_POST_REQUEST,
  EDIT_POST_SUCCESS,
  FORM_INPUT_CHANGE,
  GET_MY_POST_FAILURE,
  GET_MY_POST_REQUEST,
  GET_MY_POST_SUCCESS,
  HIDE_LOADER,
  SHOW_LOADER,
} from "../../../utils/action-types";
import { returnRouteBlogActions } from "../../../utils/return-route-by-user-type";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";

const initialState = {
  title: "",
  category: "",
  headline: "",
  content: "",
  picture: undefined,
  tags: [],
  link: "",
  published: undefined,
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
    case GET_MY_POST_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case GET_MY_POST_SUCCESS:
      return {
        ...state,
        isSending: false,
        title: action.payload.post.title,
        category: action.payload.post.category,
        headline: action.payload.post.headline,
        content: action.payload.post.content,
        picture: action.payload.post.picture,
        tags: action.payload.post.tags,
        published: action.payload.post.published,
        link: action.payload.post.link,
      };
    case GET_MY_POST_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    case EDIT_POST_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case EDIT_POST_SUCCESS:
      return {
        ...state,
        isSending: false,
        post: action.payload.post,
      };
    case EDIT_POST_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

export const UpdatePost = () => {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [mainContent, setMainContent] = useState("");
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag !== "" && !state.tags.includes(newTag)) {
      const updatedTags = [...state.tags, newTag];
      dispatch({
        type: FORM_INPUT_CHANGE,
        payload: {
          input: "tags",
          value: updatedTags,
        },
      });
      setTagInput(""); // Clear input after adding tag
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = state.tags.filter((tag) => tag !== tagToRemove);
    dispatch({
      type: FORM_INPUT_CHANGE,
      payload: {
        input: "tags",
        value: updatedTags,
      },
    });
  };

  // On component mount, fetch the post and set data in the form
  useEffect(() => {
    authDispatch({
      type: SHOW_LOADER,
    });
    dispatch({
      type: GET_MY_POST_REQUEST,
    });

    fetch(apiUrl(`/posts/${id}`))
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        setMainContent(data.post.content);
        dispatch({
          type: GET_MY_POST_SUCCESS,
          payload: data,
        });

        // Convert the fetched array of tags to a string separated by commas and set it into the state
        const tagsArray = data.post.tags || [];
        dispatch({
          type: FORM_INPUT_CHANGE,
          payload: {
            input: "tags",
            value: tagsArray,
          },
        });

        // Set the fetched content into the Draft.js Editor
        const htmlContent = data.post.content;
        const div = document.createElement("div");
        div.innerHTML = htmlContent;
        const blocksFromHTML = convertFromHTML(htmlContent);
        const contentState = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
        const editorStateWithContent =
          EditorState.createWithContent(contentState);
        setEditorState(editorStateWithContent);
      })
      .catch((error) => {
        console.error("Error trying to fetch the post", error);
        if (error) {
          dispatch({
            type: GET_MY_POST_FAILURE,
          });
        }
      })
      .finally(() => {
        authDispatch({
          type: HIDE_LOADER,
        });
      });
  }, [authDispatch, id]);

  const stripInlineStyles = (htmlString) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    const elementsWithStyles = div.querySelectorAll("*[style]");

    elementsWithStyles.forEach((el) => {
      el.removeAttribute("style");
    });
    return div.innerHTML;
  };

  const handleInputChange = (event) => {
    dispatch({
      type: FORM_INPUT_CHANGE,
      payload: {
        input: event.target.name,
        value: event.target.value,
      },
    });
  };

  // On form submit, call the update event endpoint
  const handleFormSubmit = () => {
    dispatch({
      type: EDIT_POST_REQUEST,
    });

    fetch(apiUrl(`/posts/${id}`), {
      method: "PUT",
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
        picture: state.picture,
        tags: state.tags,
        published: state.published,
        link: state.link,
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
          type: EDIT_POST_SUCCESS,
          payload: data,
        });
        navigate("/mensaje", {
          state: {
            title: "Artículo editado",
            message: "El artículo ha sido editado con éxito.",
            duration: "2000",
            navigateTo: returnRouteBlogActions(authState.user.role),
          },
        });
      })
      .catch((error) => {
        console.error("Error al editar el articulo.", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleFormSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: EDIT_POST_FAILURE,
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
        <Breadcrumbs location={"Editar artículo"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <section className="update-post-page">
          <article className="container">
            <Title
              title="Editar artículo"
              subtitle="Los campos marcados con * son obligatorios"
            />
            <div className="row">
              <div className="col-12">
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
                        <option value={state.category}>{state.category}</option>
                        {allowedCategories.map(
                          (category) =>
                            state.category !== category && (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            )
                        )}
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

                          dispatch({
                            type: FORM_INPUT_CHANGE,
                            payload: {
                              input: "content",
                              value: stripInlineStyles(contentHtml),
                            },
                          });
                        }}
                      />
                    </label>
                  </div>

                  <div className="col-12">
                    <label htmlFor="tags">
                      Etiquetas
                      <div className="article-tag-container">
                        {state.tags.map((tag, index) => (
                          <span key={index} className="tag gray">
                            {tag}
                            <button
                              type="button"
                              title={`Eliminar etiqueta ${tag}`}
                              onClick={() => handleRemoveTag(tag)}
                              className="remove-tag-button"
                            >
                              <i className="fas fa-trash icon"></i>
                            </button>
                          </span>
                        ))}
                        <div className="add-article-tag">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddTag();
                              }
                            }}
                            placeholder="Nueva etiqueta"
                          />
                          <button type="button" onClick={handleAddTag}>
                            +
                          </button>
                        </div>
                      </div>
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
};
