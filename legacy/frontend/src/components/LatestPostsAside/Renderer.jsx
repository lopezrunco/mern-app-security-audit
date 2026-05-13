import { Link } from "react-router-dom";

import imgUrl from "../../assets/no-media.jpg";

export const Renderer = ({ state }) => {
  return (
    <div className="latest-posts-aside">
      <h4>Últimos artículos</h4>
      <div className="separator"></div>
      {state.isFetching ? (
        <p>Cargando...</p>
      ) : state.hasError ? (
        <p>Error al obtener los datos</p>
      ) : state.postsList.length > 0 ? (
        state.postsList.map((post) => <LatestPosts key={post.id} post={post} />)
      ) : (
        <p>No hay artículos para mostrar...</p>
      )}
    </div>
  );
};

const LatestPosts = ({ post }) => {
  const { id, title, picture, createdAt } = post;

  return (
    <Link to={`/articulos/${id}`}>
      <div className="wapper">
        <div className="post-img">
          {picture ? (
            <img src={picture} width="100%" />
          ) : (
            <img src={imgUrl} width="100%" />
          )}
        </div>
        <div className="content">
          <p>
            <b>{title}</b>
          </p>
          <small>{new Date(createdAt).toLocaleDateString("es-UY")}</small>
        </div>
      </div>
    </Link>
  );
};
