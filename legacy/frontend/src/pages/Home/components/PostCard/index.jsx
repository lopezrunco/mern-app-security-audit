import { useNavigate } from "react-router-dom";

import imgUrl from "../../../../assets/no-media.jpg";

import { getDate } from "../../../../utils/get-date";
import {
  ALL,
  CONTENT_LEFT,
  CONTENT_RIGHT,
  DARK,
  IMG_TITLE,
} from "../../../../utils/blog-card-types";

import "./styles.scss";

export const PostCard = ({ post, colClass, btnClass, cardType }) => {
  const navigate = useNavigate();

  switch (cardType) {
    case ALL:
      return (
        <div className={colClass}>
          <div
            className={`all-content-post-card ${post.published ? '' : 'unpublished'}`}
            onClick={() => navigate(`/articulos/${post.id}`)}
          >
            <div className="img-wrapper">
              {post.picture ? (
                <img src={post.picture} width="100%" />
              ) : (
                <img src={imgUrl} width="100%" />
              )}
            </div>
            <div className="content">
              <h3>{post.title}</h3>
              <small>
                {post.createdAt && (
                  <span>
                    <i className="fas fa-calendar-alt"></i>{" "}
                    {getDate(post.createdAt)}
                  </span>
                )}
                {post.category && (
                  <span>
                    <i className="fas fa-folder"></i> {post.category}
                  </span>
                )}
              </small>
              <p>{post.headline}</p>
              <a className={`button ${btnClass}`}>
                Leer más <i className="fas fa-chevron-right ms-2"></i>
              </a>
            </div>
          </div>
        </div>
      );
    case CONTENT_RIGHT:
      return (
        <div className={colClass}>
          <div
            className={`content-right-post-card ${post.published ? '' : 'unpublished'}`}
            onClick={() => navigate(`/articulos/${post.id}`)}
          >
            <div className="img-wrapper">
              {post.picture ? (
                <img src={post.picture} width="100%" />
              ) : (
                <img src={imgUrl} width="100%" />
              )}
            </div>
            <div className="content">
              <h3>{post.title}</h3>
              <small>
                {post.createdAt && (
                  <span>
                    <i className="fas fa-calendar-alt"></i>{" "}
                    {getDate(post.createdAt)}
                  </span>
                )}
                {post.category && (
                  <span>
                    <i className="fas fa-folder"></i> {post.category}
                  </span>
                )}
              </small>
              <p>{post.headline}</p>
              <a className={`button ${btnClass}`}>
                Leer más <i className="fas fa-chevron-right ms-2"></i>
              </a>
            </div>
          </div>
        </div>
      );
    case CONTENT_LEFT:
      return (
        <div className={colClass}>
          <div
            className={`content-left-post-card ${post.published ? '' : 'unpublished'}`}
            onClick={() => navigate(`/articulos/${post.id}`)}
          >
            <div className="img-wrapper">
              {post.picture ? (
                <img src={post.picture} width="100%" />
              ) : (
                <img src={imgUrl} width="100%" />
              )}
            </div>
            <div className="content">
              <h3>{post.title}</h3>
              <small>
                {post.createdAt && (
                  <span>
                    <i className="fas fa-calendar-alt"></i>{" "}
                    {getDate(post.createdAt)}
                  </span>
                )}
                {post.category && (
                  <span>
                    <i className="fas fa-folder"></i> {post.category}
                  </span>
                )}
              </small>
              <p>{post.headline}</p>
              <a className={`button ${btnClass}`}>
                Leer más <i className="fas fa-chevron-right ms-2"></i>
              </a>
            </div>
          </div>
        </div>
      );
    case IMG_TITLE:
      return (
        <div className={colClass}>
          <div
            className={`img-title-post-card ${post.published ? '' : 'unpublished'}`}
            onClick={() => navigate(`/articulos/${post.id}`)}
          >
            <div className="img-wrapper">
              <h3>
                {post.title}
                <br />{" "}
                {post.createdAt && <small>{getDate(post.createdAt)}</small>}
              </h3>
              {post.picture ? (
                <img src={post.picture} width="100%" />
              ) : (
                <img src={imgUrl} width="100%" />
              )}
            </div>
          </div>
        </div>
      );
    case DARK:
      return (
        <div className={colClass}>
          <div
            className={`dark-post-card ${post.published ? '' : 'unpublished'}`}
            onClick={() => navigate(`/articulos/${post.id}`)}
          >
            <div className="img-wrapper">
              {post.picture ? (
                <img src={post.picture} width="100%" />
              ) : (
                <img src={imgUrl} width="100%" />
              )}
            </div>
            <div className="content">
              <h3>{post.title}</h3>
              <small>
                {post.createdAt && (
                  <span>
                    <i className="fas fa-calendar-alt"></i>{" "}
                    {getDate(post.createdAt)}
                  </span>
                )}
                {post.category && (
                  <span>
                    <i className="fas fa-folder"></i> {post.category}
                  </span>
                )}
              </small>
              <p>{post.headline}</p>
              <a className={`button ${btnClass}`}>
                Leer más <i className="fas fa-chevron-right ms-2"></i>
              </a>
            </div>
          </div>
        </div>
      );
    default:
      return <p>Ocurrió un error, por favor refresque la página.</p>;
  }
};
