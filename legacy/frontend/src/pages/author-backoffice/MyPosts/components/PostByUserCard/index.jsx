import { useNavigate } from "react-router-dom";

import imgUrl from "../../../../../assets/no-media.jpg";

import { getDate } from "../../../../../utils/get-date";

import "./styles.scss";

export const PostByUserCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div className="col-12">
      <div className={`my-post-card ${post.published ? '' : 'unpublished'}`}>
        <div className="row">
          <div className="col-lg-9">
            <div className="content">
              <h3>{post.title}</h3>
              <p className="date">
                <i className="fas fa-calendar me-2"></i>{" "}
                {getDate(post.createdAt)}
              </p>
              <p>{post.headline}</p>
              <a
                className="button view-more mb-0"
                onClick={() =>
                  navigate(`/autor/articulos/mis-articulos/${post.id}`)
                }
              >
                <i className="fas fa-chevron-right me-2"></i> Ver más / Editar
              </a>
            </div>
          </div>
          <div className="col-lg-3">
            {post.category && (
              <span className="post-category-tag">{post.category}</span>
            )}
            {post.picture ? (
              <img src={post.picture} width="100%" />
            ) : (
              <img src={imgUrl} width="100%" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
