import React, { useState } from "react";

import { getDate } from "../../../../../utils/get-date";

import imgUrl from "../../../../../assets/no-media.jpg";

import { DeletePostModal } from "./components/DeletePostModal";

function Card({ myPost }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-lg-3 mb-5">
          {myPost.category && (
            <span className="post-category-tag">{myPost.category}</span>
          )}
          {myPost.picture ? (
            <img
              src={myPost.picture}
              width="100%"
              className="sm-border-radius"
            />
          ) : (
            <img src={imgUrl} width="100%" className="sm-border-radius" />
          )}
          <a
            className="rounded-icon blue over-top"
            href={`/autor/articulos/mis-articulos/${myPost.id}/upload`}
          >
            <i className="fas fa-camera"></i>
          </a>
        </div>
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="mb-0">{myPost.title}</h4>
              <small>{myPost.published ? '(Publicado)' : '(No publicado)'}</small>
              <p className="date mt-2">
                <i className="fas fa-calendar me-2"></i>{" "}
                {getDate(myPost.createdAt)}
              </p>
            </div>
            <div className="options-buttons">
              <a
                className="rounded-icon blue"
                href={`/autor/articulos/mis-articulos/editar/${myPost.id}`}
              >
                <i className="fas fa-pen"></i>
              </a>
              <a className="rounded-icon danger" onClick={handleDeleteModal}>
                <i className="fas fa-trash"></i>
              </a>
            </div>
          </div>
          <div>
            <p>
              <b>{myPost.headline}</b>
            </p>
            <div dangerouslySetInnerHTML={{ __html: myPost.content }} />
            {myPost.link && (
              <a
                className="button view-more"
                href={myPost.link}
                target="_blank"
                rel="noreferrer"
              >
                Ir a enlace <i className="fas fa-chevron-right ms-2"></i>
              </a>
            )}
            {myPost.tags.length > 0 && (
              <React.Fragment>
                <hr className="mt-4" />
                <div className="article-tag-container">
                  <i className="fas fa-tags me-3"></i>
                  {myPost.tags.map((tag, i) => {
                    return (
                      <span className="tag gray" key={i}>
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <DeletePostModal postId={myPost.id} closeFunction={handleDeleteModal} />
      )}
    </React.Fragment>
  );
}

export default Card;
