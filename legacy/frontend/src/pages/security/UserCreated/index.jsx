import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { LOGIN } from "../../../utils/action-types";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";

import "./style.scss";

function UserCreated() {
  // From auth AuthContext take the dispatch function to indicate login
  const { dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const initialState = {
    nickname: "",
    password: "",
    token: "",
    isSubmitting: false,
    errorMessage: null,
  };

  const [data, setData] = useState(initialState);

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = () => {
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null, // Avoid error messages during the fetch
    });

    fetch(apiUrl("login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname: data.nickname,
        password: data.password,
        token: data.token,
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
          type: LOGIN,
          payload: data,
        });
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setData({
          ...data,
          isSubmitting: false,
          errorMessage: "Sus datos son incorrectos. Intente nuevamente.",
        });
      });
  };

  return (
    <section className="user-created-screen">
      <article className="container">
        <div className="row">
          <div className="col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="login-container">
                <h1 className="text-center">
                  Inicie sesión para activar su cuenta
                </h1>
                <div className="separator"></div>
                <p className="text-center">
                  Su usuario ha sido creado, solo debe ingresar sus datos una
                  vez más.
                </p>

                <label htmlFor="nickname">
                  <input
                    type="text"
                    value={data.nickname}
                    onChange={handleInputChange}
                    name="nickname"
                    id="nickname"
                  />
                  Nombre de usuario *
                </label>

                <label htmlFor="password">
                  <input
                    type="password"
                    value={data.password}
                    onChange={handleInputChange}
                    name="password"
                    id="password"
                  />
                  Contraseña *
                </label>

                <button
                  onClick={handleFormSubmit}
                  disabled={data.isSubmitting}
                  className="button button-dark"
                >
                  <i className="fas fa-user"></i>
                  {data.isSubmitting ? "Enviando datos..." : "Enviar datos"}
                </button>

                {data.errorMessage && (
                  <span className="error-message">{data.errorMessage}</span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default UserCreated;
