import "./styles.scss";

export const NotFoundMessage = () => {
  return (
    <article className="container">
      <div className="row not-found">
        <div className="col-xl-5">
          <h1>404!</h1>
        </div>
        <div className="col-xl-7">
          <h2>No encontrado</h2>
          <p>
            La página solicitada ha sido movida o eliminada de este sitio.{" "}
            <br />
            Por favor, regrese a la página principal e intente de nuevo.
          </p>
          <a className="button button-dark" href="/">
            <i className="fas fa-home"></i> Inicio
          </a>
        </div>
      </div>
    </article>
  );
};
