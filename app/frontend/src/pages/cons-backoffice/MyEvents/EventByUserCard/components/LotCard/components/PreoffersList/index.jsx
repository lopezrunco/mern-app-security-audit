import React, { useState } from "react";

import RefuseAcceptPreoffer from "./components/RefuseAcceptPreoffer";
import DeletePreofferModal from "./components/DeletePreofferModal";
import UserDetails from "./components/UserDetails";

function PreoffersList({ preoffers }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  return (
    <React.Fragment>
      <div className="col-12 preoffers-container mt-4 p-0 p-lg-4">
        <div className="row">
          <div className="col-12">
            {preoffers.length === 0 ? (
              <p>Este lote no tiene preofertas.</p>
            ) : (
              <h4 className="mb-4 mt-4 mt-lg-0">
                <i className="fas fa-comments-dollar me-2"></i> Preofertas:
              </h4>
            )}
            {preoffers.map((preoffer) => {
              return (
                <div key={preoffer.id} className="preoffer mb-2">
                  <span>
                    <b>U$S {preoffer.amount}</b>
                  </span>
                  <RefuseAcceptPreoffer preoffer={preoffer} />
                  <UserDetails userId={preoffer.userId} />
                  <span role="button" onClick={handleDeleteModal}>
                    Eliminar
                    <i className="ms-2 fas fa-times" id="nav-close"></i>
                    {showDeleteModal 
                      ? <DeletePreofferModal preofferId={preoffer.id} closeFunction={handleDeleteModal} />
                      : null}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default PreoffersList;
